import { Request, Response, RequestHandler, NextFunction } from "express";
import {
  StudentSchema,
  studentSchema,
  teacherSchema,
  TeacherSchema,
  UserSchema,
} from "./auth.schema";
import { BadRequestError, UnAuthorizedError } from "../../errors/httpErrors";
import { isAccountTaken } from "../../utils/isAccountTaken";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/db";
import { ResponseHandler } from "../../utils/responseHandler";
import { getOtp } from "../../utils/getOtp";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../../utils/mailHandlers";
import { createToken } from "../../utils/createToken";
import { isSamePassword } from "../../utils/isSamePassword";
import { generateHash } from "../../utils/generateHash";
import * as z from "zod";
interface UserData extends UserSchema {
  is_email_verified?: boolean;
}
const createUser = async ({
  dob,
  email,
  name,
  profile_photo,
  password,
  is_email_verified = false,
}: UserData) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const createdUser = await prisma.user.create({
    data: {
      dob,
      email,
      name,
      password: hashedPassword,
      profile_photo: profile_photo ?? "",
      is_email_verified,
    },
  });
  return createdUser;
};
const registerStudent: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, profile_photo, dob, username, password, programme } =
      req.body as StudentSchema;
    const studentData: Record<string, unknown> = {
      name,
      email,
      profile_photo,
      dob: new Date(dob),
      username,
      password,
      programme: "computer science",
    };
    // parse the data
    const validation = studentSchema.safeParse(studentData);
    if (!validation.success) {
      throw new BadRequestError(validation.error.format() as unknown as string);
    }
    const accountExists = await isAccountTaken(email, username);
    if (accountExists) {
      throw new BadRequestError("a user with these details already exists");
    }

    const createdUser = await createUser({
      name,
      dob: studentData.dob as Date,
      email,
      profile_photo,
      password,
    });

    const student = await prisma.student.create({
      data: {
        programme: studentData.programme as string,
        username,
        userId: createdUser.id,
      },
    });
    await prisma.rankProgress.create({
      data: {
        AdvancedCount: 0,
        EasyCount: 0,
        ExpertCount: 0,
        HardCount: 0,
        MediumCount: 0,
        studentId: student.id,
      },
    });
    studentData.profileId = student.id;
    studentData.userId = createdUser.id;
    delete studentData.password;
    const otp = await getOtp(createdUser.id);
    await sendVerificationEmail(createdUser.email, createdUser.name, otp);
    const token = createToken({
      is_email_verified: false,
      isTeacher: false,
      userId: studentData.userId as string,
      profileId: student.id,
    });
    ResponseHandler.send(
      res,
      201,
      { ...studentData, token },
      "successfully registered student"
    );
  } catch (err) {
    next(err);
  }
};
const registerTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, profile_photo, dob, password, certificate } =
      req.body as TeacherSchema;
    const teacherData: Record<string, unknown> = {
      name,
      email,
      profile_photo,
      dob: new Date(dob),
      password,
      certificate,
    };
    const validation = teacherSchema.safeParse(teacherData);
    if (!validation.success) {
      throw new BadRequestError(validation.error.format() as unknown as string);
    }
    const accountExists = await isAccountTaken(email);
    if (accountExists) {
      throw new BadRequestError("a user with these details already exists");
    }
    const createdUser = await createUser({
      name,
      dob,
      email,
      profile_photo,
      password,
      is_email_verified: true,
    });
    //@TODO: perform some verification on the teachers uploaded certificate
    const teacher = await prisma.teacher.create({
      data: {
        certificate,
        isVerified: true,
        userId: createdUser.id,
      },
    });
    teacherData.userId = createdUser.id;
    delete teacherData.password;
    // not sending email verification to teachers (will be added later no time)
    /* const otp = await getOtp(createdUser.id);
    await sendVerificationEmail(createdUser.email, createdUser.name, otp); */
    const token = createToken({
      is_email_verified: true,
      isTeacher: true,
      userId: teacherData.userId as string,
      profileId: teacher.id,
    });
    ResponseHandler.send(
      res,
      201,
      { ...teacherData, token, profileId: teacher.id },
      "successfully registered teacher"
    );
  } catch (err) {
    next(err);
  }
};
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const foundUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        studentProfile: {
          select: {
            id: true,
            username: true,
          },
        },
        teacherProfile: {
          select: {
            id: true,
          },
        },
      },
    });
    if (foundUser === null) {
      throw new UnAuthorizedError("invalid email or password!");
    }
    const isSame = isSamePassword(foundUser.password, password);
    if (!isSame) {
      throw new UnAuthorizedError("invalid email or password!");
    }
    let profileId =
      foundUser.teacherProfile?.id ?? foundUser.studentProfile?.id ?? "";
    if (profileId === "") {
      throw new UnAuthorizedError("user profile does not exist");
    }
    const token = createToken({
      is_email_verified: foundUser.is_email_verified,
      isTeacher: foundUser.teacherProfile !== null,
      userId: foundUser.id,
      profileId,
    });
    ResponseHandler.send(
      res,
      200,
      {
        isTeacher: foundUser.teacherProfile !== null,
        token,
        userId: foundUser.id,
        profileId,
        name: foundUser.name,
        profile_photo: foundUser.profile_photo,
        is_email_verified: foundUser.is_email_verified,
        username: foundUser.studentProfile?.username,
      },
      "successfully logged in user"
    );
  } catch (err) {
    next(err);
  }
};
const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, userId } = req.body;
    if (typeof otp === "undefined" || typeof otp !== "number") {
      throw new BadRequestError(
        "otp field is required and has to be a type of number"
      );
    }
    if (typeof userId !== "string") {
      throw new BadRequestError("invalid type of userId");
    }
    const existingOtp = await prisma.oTP.findFirst({
      where: {
        AND: [
          {
            userId,
          },
          {
            token: otp,
          },
        ],
      },
    });
    if (existingOtp === null) {
      throw new BadRequestError("otp does not exist");
    }
    if (existingOtp.expiresAt.getTime() < new Date().getTime()) {
      await prisma.oTP.delete({
        where: {
          id: existingOtp.id,
        },
      });
      throw new UnAuthorizedError(
        "otp has expired, try requesting for a new one"
      );
    }
    const foundUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        is_email_verified: true,
      },
      include: {
        studentProfile: {
          select: {
            id: true,
            username: true,
          },
        },
        teacherProfile: {
          select: {
            id: true,
          },
        },
      },
    });
    let profileId =
      foundUser.teacherProfile?.id ?? foundUser.studentProfile?.id ?? "";
    if (profileId === "") {
      throw new UnAuthorizedError("user profile does not exist");
    }
    const token = createToken({
      is_email_verified: true,
      userId: foundUser.id,
      isTeacher: foundUser.teacherProfile !== null,
      profileId,
    });
    ResponseHandler.send(
      res,
      200,
      { token, ...foundUser },
      "successfully verified user email"
    );
  } catch (err) {
    next(err);
  }
};
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const emailValidator = z.object({
      email: z.string().email().trim(),
    });
    const { email } = req.body;
    const isValidEmail = emailValidator.safeParse({ email });
    if (!isValidEmail.success) {
      throw new BadRequestError(
        isValidEmail.error.format() as unknown as string
      );
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user == null) {
      throw new BadRequestError(
        "a user with the given email address does not exist!"
      );
    }

    // set a 30 minutes expiration Time
    const now = new Date();
    const expirationTime = new Date(now.getTime() + 168 * 60 * 60 * 1000); // add 168 hours in milliseconds
    const hash = generateHash(32);
    let createdToken = await prisma.passwordResetToken.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
        token: hash,
        expiresAt: expirationTime,
      },
      update: {
        token: hash,
        expiresAt: expirationTime,
      },
    });
    await sendPasswordResetEmail(user.email, user.name, hash);
    ResponseHandler.send(
      res,
      200,
      { userId: user.id },
      "successfully sent password reset email"
    );
  } catch (err) {
    next(err);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, token, newPassword } = req.body;
    if (typeof userId !== "string") {
      throw new BadRequestError("invalid type of userId");
    }
    if (typeof token !== "string") {
      throw new BadRequestError("invalid type of token");
    }
    if (typeof newPassword !== "string") {
      throw new BadRequestError("invalid type of newPassword");
    }
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        AND: [
          {
            userId,
          },
          {
            token,
          },
        ],
      },
    });
    if (passwordResetToken === null) {
      throw new BadRequestError("invalid token");
    }
    if (passwordResetToken.expiresAt.getTime() < new Date().getTime()) {
      await prisma.passwordResetToken.delete({
        where: {
          id: passwordResetToken.id,
        },
      });
      throw new UnAuthorizedError("token has expired");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    await prisma.passwordResetToken.delete({
      where: {
        id: passwordResetToken.id,
      },
    });
    ResponseHandler.send(res, 200, {}, "successfully changed password");
  } catch (err) {
    next(err);
  }
};
const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    if (typeof userId !== "string") {
      throw new BadRequestError("invalid type of userId");
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        name: true,
        id: true,
      },
    });
    if (foundUser === null) {
      throw new BadRequestError("user does not exist!");
    }
    const otp = await getOtp(userId);
    await sendVerificationEmail(foundUser.email, foundUser.name, otp);
    ResponseHandler.send(res, 201, { ...foundUser }, "successfully resent otp");
  } catch (err) {
    next(err);
  }
};
export {
  registerStudent,
  registerTeacher,
  login,
  verifyEmail,
  resetPassword,
  changePassword,
  resendOtp,
};

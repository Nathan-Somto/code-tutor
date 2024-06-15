import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        profileId: string;
        userId: string;
        is_email_verified: boolean;
        isTeacher: boolean;
      };
    }
  }
}

import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { sendMail } from "../services/sendMail";
import { generateOtp } from "./getOtp";
async function parseEmailTemplate(fileName: string, variables: Record<string, string>){
  let folderPath = path.join(__dirname, '..', 'views', 'email_templates', fileName);
  if(!fsSync.existsSync(folderPath)){
    throw new Error("email template does not exist");
  }
  let emailTemplate = await fs.readFile(path.join(__dirname, '..', 'views', 'email_templates', fileName), 'utf-8');
  for (const key in variables) {
    emailTemplate = emailTemplate.replace(new RegExp(`\\$\\{${key}\\}`, 'gi'), variables[key]);
  }
  return emailTemplate
}
export async function sendVerificationEmail(
  email: string,
  name: string,
  otpCode: number
): Promise<void> {
  // read the contents of the verification email
  // maybe use a buffer
  const verificationMail = await parseEmailTemplate('verifyEmail.html', {
    name,
    otpCode: otpCode.toString(),
    clientLink: `${process.env.Client ??'http://localhost:5173'}/verify-email/${email}`
  });
  console.log(verificationMail);
  // pass the user information to the sendMail service
  await sendMail(email, "Verify Your Email", verificationMail);
}
console.log("code executing");

// test call
//sendVerificationEmail('nturner560@gmail.com','Nathan Turner', generateOtp(6)).then(() => {console.log("email sent successfully")}).catch((err) => console.error((err as Error).message));
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const passwordResetMail = await parseEmailTemplate('passwordReset.html', {
    name,
    token,
    clientLink: `${process.env.Client?? 'http://localhost:5173'}/reset-password/${token}`
  });
  await sendMail(email, "Reset Your Password", passwordResetMail);
}

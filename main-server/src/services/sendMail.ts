import nodemailer from "nodemailer"
export async function sendMail(
    email: string,
    subject:string,
    html:string
): Promise<boolean>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      })
      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject,
        html
      })
      console.log('email sent sucessfully');
      return true;
  }

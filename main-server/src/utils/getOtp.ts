import { prisma } from "../config/db";
export function generateOtp(length: number): number{
    let startNum = +('1'+''.padEnd(length-1, '0'));
    let endNum = +('9'+ ''.padEnd(length-1, '0'));
    return Math.floor(startNum + Math.random() * endNum);
}
export async function getOtp(
    userId: string
): Promise<number>{
    
    const otp = generateOtp(6);
    const now = new Date();
    const otpData = {
        token: otp,
        expiresAt: new Date(now.getTime() + (60 * 60 * 168 * 1000)) //expires after 168 hours
    }
    await prisma.oTP.upsert(
            {
                where : {
                    userId
                },
                create: {
                    ...otpData,
                    userId
                },
                update : {
                    ...otpData
                }
            }
         )
    
    return otp;
}
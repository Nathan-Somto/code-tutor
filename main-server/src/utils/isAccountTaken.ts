import { prisma } from "../config/db";

export async function isAccountTaken(
    email:string,
    username?: string  
): Promise<boolean>{
 const emailIsTaken = await prisma.user.findUnique({
    where:{
        email
    },
    select: {
        id: true
    }
 })
 if(emailIsTaken !== null){
    return true
 }
 if(username){
    const usernameIstaken = await prisma.student.findUnique({
        where : {
            username
        },
        select: {
            id : true
        }
    });
    if(usernameIstaken !== null){
        return true
    }
 }
 return false
}
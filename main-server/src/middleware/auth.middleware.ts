import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UnAuthorizedError } from '../errors/httpErrors';
import jwt from "jsonwebtoken";
import { prisma } from '../config/db';
export const  auth  = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const headers = req.headers['authorization'] ?? req.headers['Authorization'];
        if(!headers){
            throw new UnAuthorizedError( 'No token provided');
        }
        const token = headers.toString().split(' ')[1];
        console.log("the token: ", token)
        const payload:tokenData =  jwt.verify(token,process.env.JWT_SECRET ?? '') as unknown as tokenData;
        if(!payload.is_email_verified){
            throw new UnAuthorizedError("Please verify your email in order to access this resource");
        }
        console.log("token payload", payload);
       const user = await prisma.user.findUnique({
            where: {
                id: payload.userId
            },
            select: {
                email: true,
                name: true
            }
        });
        if(user === null){
            throw new UnAuthorizedError("user account does not exist");
        };
        req.user = {
            ...user,
            ...payload
        }
        next();
    }catch(e){
        next(e);
    }
}
import { NextFunction, Request, Response } from "express";

import { UnAuthorizedError } from "../errors/httpErrors";

export const teacherMiddleware = async(req:Request, res:Response, next:NextFunction) => {
    try{
        console.log(req.user);
        if(!req.user) {
            throw new UnAuthorizedError("user is not authorized");
        }
        const {isTeacher} = req.user;
        if(!isTeacher){
            throw new UnAuthorizedError("only teachers are allowed to access this resource");
        };
        next();
    }
    catch(e){
        next(e);
    }
} 
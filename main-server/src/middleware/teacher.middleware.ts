import { NextFunction } from "express";
import { AuthorizedRequest } from "../types";
import { UnAuthorizedError } from "../errors/httpErrors";

export const teacherMiddleware = async(req:AuthorizedRequest, res:Response, next:NextFunction) => {
    try{
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
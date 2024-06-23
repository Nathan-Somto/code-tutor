import {Response} from "express";
interface ResponseObj<T> {
    timeStamp: string,
    success: boolean,
    body: T,
    message?: string
}
class ResponseHandler{
    static send<T>(res:Response, statusCode:number=200, body:T, message?:string, success=true){
        const responseObj: ResponseObj<T> = {
            timeStamp: new Date().toISOString(),
            success,
            body
        }
        if(message){
            responseObj.message = message;
        }
        res.status(statusCode).json(responseObj);
    }
}
export {
    ResponseHandler
}
import {Response} from "express";
interface ResponseObj<T> {
    timeStamp: string,
    success: boolean,
    data: T,
    message?: string
}
class ResponseHandler{
    static send<T>(res:Response, statusCode:number=200, data:T, message?:string, success=true){
        const responseObj: ResponseObj<T> = {
            timeStamp: new Date().toISOString(),
            success,
            data
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
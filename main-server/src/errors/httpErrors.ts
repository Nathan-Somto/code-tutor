class HttpError extends Error{
    statusCode: number
    constructor(message:string, statusCode:number){
        super(message)
        this.message = message
        this.statusCode = statusCode
    }
}

class BadRequestError extends HttpError{
    constructor(message="Bad Request"){
        super(message, 400)
    }
}

class NotFoundError extends HttpError{
    constructor(message = "The resource you ar looking for cannot be found!"){
        super(message, 404)
    }
}

class UnAuthorizedError extends HttpError{
    constructor (message ="Unauhtorized request") {
        super(message, 401)
    }
}
class ForbiddenError extends HttpError{
    constructor(message="Action is Forbidden"){
        super(message, 403)
    }
}
class ServerError extends HttpError {
    constructor (message ="Internal Server Error"){
        super(message, 500)
    }
}

export {
    ServerError,
    BadRequestError,
    ForbiddenError,
    HttpError,
    UnAuthorizedError,
    NotFoundError
}
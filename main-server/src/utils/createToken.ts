import jwt from "jsonwebtoken";

export function createToken(data: tokenData){
    return jwt.sign(data, process.env.JWT_SECRET as unknown as string, {
        expiresIn: '7d'
    });
}

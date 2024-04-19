import {Request} from "express";
export  interface AuthorizedRequest extends Request {
        user: {
            email: string,
            name: string,
            profileId: string;
            userId: string;
            is_email_verified: boolean;
            isTeacher: boolean;
        } // Assuming User is the type representing a user
    }

import {Request} from 'express';
import { UnAuthorizedError } from '../errors/httpErrors';
export const checkIfOwner = (req: Request, message="not authorized") => {
    const {studentId} = req.params;
    const profileId = req.user?.profileId;
    if (studentId !== profileId) {
      throw new UnAuthorizedError(message);
    }
    return studentId;
}
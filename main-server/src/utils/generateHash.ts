import crypto from "crypto"
export function generateHash(bytes: number){
      return crypto.randomBytes(bytes).toString('hex') ;
};
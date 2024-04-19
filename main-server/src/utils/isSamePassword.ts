import bcrypt from "bcryptjs";
async function isSamePassword(hashedPassword: string, userPassword: string){
    const isSame = await bcrypt.compare(hashedPassword, userPassword);
    return isSame;
}
export {
    isSamePassword
}
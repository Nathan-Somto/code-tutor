import apiClient from "@/config/apiClient";
export type LoginType = {
    email: string;
    password: string;
}
export function loginService(data: LoginType){
 return apiClient.post('/auth/login', data );
}
export type RegisterType = {
    certificate: string;
    name: string;
    email: string;
    password: string;
    dob: Date;
    profile_photo?: string | undefined;
}
export function registerService(data: RegisterType){
    return apiClient.post('/auth/register-teacher', data);
}
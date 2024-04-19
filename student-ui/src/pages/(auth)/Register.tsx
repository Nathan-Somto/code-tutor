import RegisterForm from "@/components/auth/RegisterForm"
import AuthHeader from "@/components/auth/authHeader";
export default function RegisterPage(){
    return (
        <>
        <AuthHeader
         actionText="Login"
         actionLink="/login"
        />
        <div className="mt-16"></div>
        <RegisterForm
        title="Create your Profile"
        buttonText="Create Account"
        />
        </>
    )
}
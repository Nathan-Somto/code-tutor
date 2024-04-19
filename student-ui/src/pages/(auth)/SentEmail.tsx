import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Lottie from "react-lottie";
import emailAnimation from "@/data/lottieFiles/email-animation.json"
export default function VerifyEmail(){
    const [searchParams, _setSearchParams] = useSearchParams();
    const email = searchParams.get("email");
    const sentEmail = searchParams.get("sent-mail");
    const navigate = useNavigate()
    React.useEffect(() => {
        if(!sentEmail || !email){
            navigate('/login');
        }
    }, [sentEmail]);
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-6">
            <div className="h-[300px] max-w-[400px] w-full">
            <Lottie
            options={{
                loop: true,
                autoplay: true,
                animationData: emailAnimation,
            }}
            />
            </div>
            <div className="text-center">
                <h3 className="text-4xl tracking-wide leading-normal mb-3 font-medium">Verification email sent!</h3>
                <p className="opacity-80 w-[80%] mx-auto">Please check the inbox of this email  <span className="text-primary">{email}</span>  to verify your profile</p>
            </div>
        </div>
    )
}
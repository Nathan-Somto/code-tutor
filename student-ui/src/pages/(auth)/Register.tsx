import RegisterForm from "@/components/auth/RegisterForm"
import AuthHeader from "@/components/auth/authHeader";
import RegisterImage from "@/assets/auth/register.png";
export default function RegisterPage(){
    return (
        <>
        <AuthHeader
         actionText="Login"
         actionLink="/login"
        />
        <div className="mt-20 w-full lg:grid  lg:grid-cols-2  h-[calc(100vh-20*0.25rem)]">
        <figure className="hidden overflow-hidden dark:bg-background/50 relative lg:block rounded-md  px-5">
      <img
        src={RegisterImage}
        alt="register image"
        className="object-cover w-full h-full hover:scale-125 dark:brightness-75  transition-all duration-500 ease-in-out"
      />
    </figure>
    <div className="xl:min-w-md min-w-sm">
        <RegisterForm
        title="Create your Profile"
        buttonText="Create Account"
        />
    </div>
        </div>
        </>
    )
}
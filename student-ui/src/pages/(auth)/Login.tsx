import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { mainApi } from "@/config/axios";
import AuthHeader from "@/components/auth/authHeader"
import { useMutate } from "@/hooks/query/useMutate";
import { Auth, useAuth } from "@/providers/AuthProvider";
import LoginImage from "@/assets/auth/login.png"
import { useToast } from "@/components/ui/use-toast";
export default function LoginPage() {
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
  const {mutateAsync, isPending} = useMutate<typeof loginData>({
    defaultMessage: "failed to login user!",
    method: 'post',
    route: '/auth/login'
  })
  const {login} =useAuth()
  const{toast} = useToast()
 
  const disableButton = loginData.password.length === 0 || isPending || isSubmitting;
  
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      const response = await mutateAsync(loginData);
      console.log(response)
      const data = response.data?.body;
      console.log(data)
    if(data?.isTeacher){
      toast({
        title: "Error",
        description: "Teacher's or Instructors are not allowed to login here!",
        variant: "destructive",
      });
      return;
    }
    const authData: Auth = {
      profile_photo: data?.profile_photo,
      profileId: data?.profileId,
      token: data?.token,
      userId: data?.userId,
      username: data?.username
    }
    login(authData);
    if(!data?.is_email_verified){
      await mainApi.post('/auth/resend-otp', {userId: data?.userId});
      navigate(`/sent-email/?email=${"mkparusomtochi26@gmail.com"}&sent-mail=${true}`);
    return;
    } 
    navigate('/courses');
    } catch (err) {
      console.error((err as Error).message);
    }
    finally{
      setIsSubmitting(false)
    }
  };
  return (
    <div className="max-h-screen">
    <AuthHeader
    actionText="Register"
    actionLink="/register"
    />
    <div className="w-full lg:grid  lg:grid-cols-2 mt-20 h-[calc(100vh-20*0.25rem)]">
    <figure className="hidden overflow-hidden dark:bg-background/50 relative lg:block rounded-md  px-5">
      <img
        src={LoginImage}
        alt="login image"
        className="object-cover w-full h-full hover:scale-125 dark:brightness-75  transition-all duration-500 ease-in-out"
      />
    </figure>
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="w-full grid  place-items-center">
        <div className="flex items-center justify-center">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">
                Login 
              </h1>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
             
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      name="email"
                      value={loginData.email}
                      onChange={handleChange}
                    />
                 
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="******"
                  value={loginData.password}
                  onChange={handleChange}
                />
              </div>
                  <Link
                    to="/reset-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
              <Button
                disabled={disableButton}
                variant={"primary"}
                type="submit"
                className="w-full"
              >{
                (isPending || isSubmitting) ? 'Submitting...': 'Login'
              }
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </form>
    
    </div>
    </div>
  );
}

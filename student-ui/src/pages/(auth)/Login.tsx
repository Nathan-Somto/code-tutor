import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { mainApi } from "@/config/axios";
import AuthHeader from "@/components/auth/authHeader"
export default function LoginPage() {
  const [loginData, setLoginData] = React.useState({
    username: "",
    password: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const studentLogin = searchParams.get("studentLogin");
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!studentLogin) {
      setSearchParams({
        studentLogin: "true",
      });
    }
  }, [studentLogin]);
  const disableButton = loginData.password.length === 0;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // send the data to the main server login endpoint
      //const response = await mainApi.post('/auth/login', loginData);
      // if the user's email has not been verified send them to the sent email page
      navigate(`/sent-email/?email=${"mkparusomtochi26@gmail.com"}&sent-mail=${true}`);
      // store the user's profile in global state
      // redirect to their dashboard
    } catch (err) {
      console.error((err as Error).message);
    }
  };
  return (
    <>
    <AuthHeader
    actionText="Register"
    actionLink="/register"
    />
    <form onSubmit={handleSubmit}>
      <div className="w-full grid  place-items-center h-[calc(100vh-16*0.25rem)]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">
                Login 
              </h1>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
             
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      required
                      name="username"
                      value={loginData.username}
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
              >
                Login
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </form>
    </>
  );
}

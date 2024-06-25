import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormItem,
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import AuthHeader from "@/components/auth/authHeader";
import { Button } from "@/components/ui/button";
import { MailCheckIcon } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutate } from "@/hooks/query/useMutate";
import { Auth, useAuth } from "@/providers/AuthProvider";
import { mainApi } from "@/config/axios";
import { useToast } from "@/components/ui/use-toast";
import { displayError } from "@/utils/displayError";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function VerifyEmail() {
  const { email } = useParams();
  const submitRef = React.useRef<HTMLButtonElement | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, state } = useAuth();
  const { mutate, isPending } = useMutate<{ otp: number, userId: string }>({
    route: '/auth/verify-email',
    method: 'post',
    defaultMessage: "Failed to verify email",
    onSuccess(response) {
      const { token, studentProfile, profile_photo, id } = response?.data?.body;
      if (studentProfile !== null) {
        const authData: Auth = {
          token,
          profile_photo,
          profileId: studentProfile?.id,
          userId: id,
          username: studentProfile?.username,
        };
        login(authData);
        navigate('/courses');
        return;
      }
      toast({
        title: "Error",
        description: "Could not find student profile",
        variant: "destructive",
      });
    },
  });

  const [isResending, setIsResending] = React.useState(false);
  const [resendTimeout, setResendTimeout] = React.useState(30);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isButtonDisabled) {
      timer = setInterval(() => {
        setResendTimeout((prev) => {
          if (prev === 1) {
            setIsButtonDisabled(false);
            clearInterval(timer);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isButtonDisabled]);

  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    console.log(state.auth);
    if(state?.auth === null || state.auth?.userId === null){

      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }
    const formattedData = {otp: +data.pin, userId: state.auth.userId as string}
    console.log(formattedData);
    // Convert the pin to a number.
    mutate(formattedData);
    // Send to the backend endpoint.
    // Redirect user to the dashboard
  }

  async function resendOtp() {
    setIsResending(true);
    try {
      console.log(email);
      // Pass email to the resend otp endpoint
      await mainApi.post('/auth/resend-otp', { email });
      // If successful tell user to check their email for new otp code.
      toast({
        title: "Success",
        description: "A new OTP has been sent to your email",
        variant: "default",
      });
      setIsButtonDisabled(true);
    } catch (error) {
      displayError(toast, error, 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <>
      <AuthHeader actionText="Register" actionLink="/register" />
      <div className="h-screen flex mt-24 items-center flex-col">
        <Form {...form}>
          <div className="mb-6 text-center">
            <div className="text-primary/80 mb-5 flex items-center justify-center">
              <MailCheckIcon size={60} />
            </div>
            <h1 className="text-3xl tracking-wider mb-2 leading-3 font-semibold">
              Verify Your Email
            </h1>
            <p className="text-neutral-600 mt-4">
              Enter the otp sent to{" "}
              <span className="text-neutral-500 font-medium">{email}</span>
            </p>
          </div>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-w-fit space-y-6 mx-auto flex justify-center flex-col"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className=" grid place-items-center">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      onChange={(e) => {
                        console.log(e);
                        field.onChange(e);
                      }}
                      disabled={
                        form.formState.isSubmitting ||
                        form.formState.isLoading ||
                        isPending
                      }
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center my-8">
              <p>Didn't receive OTP code?</p>
              <button
                type="button"
                onClick={resendOtp}
                className="p-0 max-h-fit text-primary hover:underline disabled:opacity-50"
                disabled={isButtonDisabled || isResending}
              >
                Resend Code {isButtonDisabled && `(${resendTimeout}s)`}
              </button>
            </div>
            <Button
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              ref={submitRef}
              disabled={
                isPending
              }
              type="submit"
              variant="primary"
              size="lg"
            >
            {isPending ? "Verifying...": "Verify & Proceed"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

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
import { useParams } from "react-router-dom";
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
  function handleSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // convert the pin to a number.
    // send to the backend endpoint.
    // redirect user to the dashboard
  }
  function resendOtp() {
    console.log(email);
    // pass email to the resend otp endpoint
    // if successfully tell user to check their email for new otp code.
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
              render={({ field }) => {
                //console.log(field)
                return (
                  <FormItem className=" grid place-items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        onChange={(e) => {
                          console.log(e);
                          field.onChange(e);
                          if (e.length === 6 && submitRef.current) {
                            submitRef.current.click();
                          }
                        }}
                        disabled={form.formState.isSubmitting || form.formState.isLoading}
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
                );
              }}
            />
            <div className="text-center my-8 ">
              <p>Didn't receive OTP code?</p>
              <button
                type="button"
                onClick={resendOtp}
                className="p-0 max-h-fit text-primary hover:underline"
              >
                Resend Code
              </button>
            </div>
            <Button className="disabled:opacity-50 disabled:cursor-not-allowed" ref={submitRef} disabled={form.formState.isSubmitting || form.formState.isLoading} type="submit" variant="primary" size="lg">
              Verify & Proceed
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

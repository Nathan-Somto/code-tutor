import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, Camera } from "lucide-react";
import { useMutate } from "@/hooks/query/useMutate";
import { AxiosResponse } from "axios";
import { Auth, useAuth } from "@/providers/AuthProvider";
import { useToast } from "../ui/use-toast";
import { uploadFiles } from "@/config/uploadthing";
import { displayError } from "@/utils/displayError";

type Props = {
  title: "Create your Profile" | "Update your Profile";
  buttonText: "Create Account" | "Update Account";
};

const MAXIMGSIZE = 4196304;

const formSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  profile_photo: z.string().optional(),
  dob: z.string(),
  password: z.string(),
  username: z.string().min(5).max(24),
});
type FormValues = z.infer<typeof formSchema>;
export default function RegisterForm({
  title = "Create your Profile",
  buttonText = "Create Account",
}: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = React.useState<string>("");
  const [imageFile, setImageFile] = React.useState<null | File>(null);
  const[isSubmitting, setIsSubmitting] = useState(false);
  const {login} = useAuth()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });
  const {toast} = useToast();
  const handleImage = (files: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();
    let file = files?.target?.files === null ? null : files.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        console.error("must be an image type");
      } else if (file.size > MAXIMGSIZE) {
        console.error("image too large!");
      } else {
        reader.onloadend = () => {
          setImageFile(file);
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  const onSuccess = (response: AxiosResponse<any, any>) => {
    const {profileId, userId, profile_photo, token, username, email} = (response.data?.body);
    login({profileId, userId, profile_photo, token, username })
    //navigate(`/sent-email/?email=${email}&sent-mail=true`);
    navigate('/courses')
  }
  const {mutate, isPending} = useMutate<FormValues>({
    defaultMessage:"Could not register user",
    method:"post",
    route: `/auth/register-student`,
    onSuccess
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try{
      if(!imageFile){
        toast({
          title: "Image is required",
          description: "Please upload a profile image!",
          variant: "destructive"
        })
        return;
      }
     const result = await uploadFiles('imageUploader', {
      files: [imageFile as File],
      skipPolling: true,
     })
     let newValues = {...values, profile_photo: result[0].url}
      console.log(newValues);
      mutate(newValues);
    }catch(err){
      displayError(toast, err, "Could not register user")
    }
    finally{
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[450px] mx-auto py-6">
        <div className="mb-5">
          <h1 className="text-3xl font-medium tracking-wide leading-normal text-center">{title}</h1>
        </div>
        <figure className="flex justify-center items-center gap-5 relative text-sm flex-wrap flex-shrink-0">
              <div className="h-20 w-20 relative">
                {imageFile || image.length > 0 ? (
                  <img
                    src={image}
                    alt="avatar preview"
                    className="ring-2 h-full w-full ring-slate-500 rounded-[50%] object-cover"
                  />
                ) : (
                  <User className="ring-2 h-full w-full ring-slate-500 rounded-[50%] text-gray-500 p-2" />
                )}
                <Button
                  type="button"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                  size="icon"
                  variant="ghost"
                  className="-right-2 border-transparent text-slate-300 ring-transparent ring-offset-transparent ring-offset-0 hover:ring-2 p-0 ring-0 border-none -bottom-[17.5px] z-[10] absolute"
                >
                  <Camera />
                </Button>
              </div>
              <input
                ref={inputRef}
                type="file"
                id="avatar"
                hidden
                onChange={handleImage}
                accept="image/*"
                max={1}
              />
            </figure>
        {step === 1 && (
          <>
           
            <div className="space-y-4 mt-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email Address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between mt-5">
              <Button variant="secondary" onClick={prevStep} disabled={step === 1}>
                Back
              </Button>
              <Button variant="primary" onClick={nextStep}>
                Next
              </Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="space-y-4 mt-5">
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOB</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between mt-5">
              <Button variant="secondary" onClick={prevStep} disabled={isPending || isSubmitting}>
                Back
              </Button>
              <Button type="submit" variant="primary" disabled={isPending || isSubmitting}>
                { isSubmitting ? isPending ? 'Creating...' : 'Submitting...': buttonText}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}

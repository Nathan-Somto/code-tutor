import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import * as z from "zod";
import { User, Camera } from "lucide-react";
type Props = {
  title: "Create your Profile" | "Update your Profile";
  buttonText: "Create Account" | "Update Account";
};
const MAXIMGSIZE = 4196304;

export default function RegisterForm({
  title = "Create your Profile",
  buttonText = "Create Account",
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>();
  const formSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email(),
    profile_photo: z.string().optional(),
    dob: z.date(),
    password: z.string(),
    username: z.string().min(5).max(24),
  });
  const [image, setImage] = React.useState<string>("");
  const [imageFile, setImageFile] = React.useState<null | File>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur"
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleImage = (files: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();
    let file = files?.target?.files === null ? null : files.target.files[0] ;
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[450px] mx-auto py-6">
        <div className="mb-5">
          <h1 className="text-3xl font-medium tracking-wide leading-normal text-center">{title}</h1>
        </div>
        <figure className="flex justify-center  items-center gap-5 relative text-sm flex-wrap flex-shrink-0">
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
          <Button type="button" onClick={() => {
            inputRef.current?.click();
          }} size="icon" variant="ghost" className="-right-2 border-transparent text-slate-300 ring-transparent ring-offset-transparent ring-offset-0 hover:ring-2  p-0  ring-0 border-none -bottom-[17.5px] z-[10] absolute">
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
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DOB</FormLabel>
              <FormControl>
                <Input className="" type="date" {...field} />
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
              <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        {...field}
                        
                      /> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button disabled={form.formState.isDirty} variant="primary" className="w-full mt-5">{buttonText}</Button>
      </form>
    </Form>
  );
}

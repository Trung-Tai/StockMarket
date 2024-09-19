"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import banner from "@/assets/images/cryto-image.png";
import logingg from "@/assets/images/icongg.png";

import React from "react";
import GoogleSignInButton from "@/app/components/ui/GoogleSignInButton";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (signInData?.error) {
      console.error("Sign in error:", signInData.error);
    } else {
      console.log("Sign in successful:", signInData);
      router.refresh();
      router.push("/");
    }
  };
  return (
    <main className="bg-[url('/images/saoBang.png')] flex items-center justify-center h-screen bg-no-repeat bg-cover bg-center">
      <div className="bg-gray-300 rounded-2xl flex max-w-3xl p-5 items-center bg-opacity-20">
        <div className="md:w-1/2 px-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2"></div>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Welcome to Eagle Eye Stock
          </h2>

          <Form {...form}>
            <div className="mb-4">
              <GoogleSignInButton>
                <Image src={logingg} alt="Google Logo" width={24} height={24} />
                Log in with Google
              </GoogleSignInButton>
            </div>
          </Form>
        </div>
        <div className="w-full lg:w-1/2">
          <Image
            src={banner}
            alt="register"
            className="object-cover w-full h-full"
            width={700}
            height={1000}
          />
        </div>
      </div>
    </main>
  );
};

export default SignInForm;

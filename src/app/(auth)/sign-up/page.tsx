"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/SignupSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setusername] = useState("");
  const [usernameMessage, setusernameMessage] = useState("");
  const [isCheckingMessage, setisCheckingMessage] = useState(false);
  const [isSubmittingForm, setisSubmittingForm] = useState(false);
  // const debounceUsername = useDebounceValue(username, 200); //if you not understand then go to usehook.ts website
  const debounced = useDebounceCallback(setusername, 300); //if you not understand then go to usehook.ts website
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  //api call when change the value of debounceUsername
  useEffect(() => {
    const CheckUsernameUnique = async () => {
      if (username) {
        setisCheckingMessage(true);
        setusernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setusernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setusernameMessage(
            axiosError.response?.data.message || " Error checking username"
          );
        } finally {
          setisCheckingMessage(false);
        }
      }
    };
    CheckUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmittingForm(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
      setisSubmittingForm(false);


    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let axiosMessage = axiosError.response?.data.message;
      
      toast({
        title: "Error",
        description: axiosMessage || "Error in signup",
        variant: "destructive",
      });
      setisSubmittingForm(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-extrabold text-4xl tracking-tight lg:text-5xl mb-6">
            {" "}
            Join Annonymus Message
          </h1>
          <p className="mb-4"> Sign up to start yout annonymus adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingMessage && <Loader2 className="animate-spin" />}
                  {usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
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
                    <Input  placeholder="email" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmittingForm}>
              {isSubmittingForm ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                " Sign up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          Already a member?
          <Link href="/sign-in" className="text-blue-500 hover:text-blue-600">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;

/*
 //use of next auth
import { useSession, signIn, signOut } from "next-auth/react";
export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        </>
    );
  }
  return (
    <>
    <div className="container  m-auto flex justify-items-center items-center flex-col gap-5 p-5">
        <h1 className=" text-2xl ">This is Sign in page</h1>
        <button
          onClick={() => signIn()}
          className="border-solid border-2 border-sky-500  m-auto rounded-full py-3 px-12 text-xl"
        >
          Sign in
        </button>
      </div>
      </>
    );
  }
  */

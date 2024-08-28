"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
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
import { loginSchema } from "@/Schemas/LoginSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (response?.error) {
      toast({
        title: "Login failed",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    }
    if (response?.url) {
      router.replace("/dashboard");
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
          <p className="mb-4"> Sign in to start yout annonymus adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
            <Button type="submit">Sign in</Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          Don't have any account?
          <Link href="/sign-up" className="text-blue-500 hover:text-blue-600">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;

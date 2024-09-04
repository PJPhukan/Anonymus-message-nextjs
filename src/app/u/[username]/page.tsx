"use client";

import { MessageSchema } from "@/Schemas/MessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
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

const Message = () => {
  const params = useParams();
  const username = params?.username as string; // Use type assertion here
  const { toast } = useToast();

  // Zod form validation implementation
  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues :{
      content:''
    }
  });

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        content: data.content,
        username,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      // Ensure the error is handled correctly
      const axiosMessage =
        axiosError.response?.data.message || "Error sending message";
      toast({
        title: "Error",
        description: axiosMessage,
        variant: "destructive",
      });
    }
  };

  
  return (
    <div className="container">
      <h1 className="text-4xl text-center my-4">Public Profile Link</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-2/3 m-auto"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">Message</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Send</Button>
        </form>
      </Form>
    </div>
  );
};

export default Message;

"use client";

import CardMessage from "@/components/CardMessage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/Schemas/AcceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const [messages, setmessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  //optimistic UI approch
  const HandleDeleteMessages = (messageId: string) => {
    setmessages(
      messages.filter((message) => {
        return message._id !== messageId;
      })
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  //get user accept messages status
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch accept messages status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  //get user all messages
  const fetchAllMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-message");
        setmessages(response.data.messages || []);
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages",
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Failed",
          description:
            axiosError.response?.data.message || "Failed to load user messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setmessages]
  );

  //call the callback function the dashboard page load
  useEffect(() => {
    if (!session || !session.user) return; //if there is no session or session.user then return
    fetchAcceptMessages();
    fetchAllMessages();
  }, [session, setValue, fetchAcceptMessages, fetchAllMessages]);

  //handle switch change
  const handleChangeSwitch = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptmessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Success",
        description:
          response.data.message ||
          "Successfully changed accept messages status",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to change accept messages status",
        variant: "destructive",
      });
    }
  };

  //Link generation function
  const user: User = session?.user as User;
  const username = user?.username || user?.email;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  //Copy to clipboard functionality
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "URL has been copied to clipboard",
    });
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete<ApiResponse>("/api/delete-message", {
        data: {
          messageId,
        },
      });
      toast({
        title: "Message deleted successfully",
        description: "This message has been permanently deleted",
      });
      HandleDeleteMessages(messageId);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description: errorMessage || "Error deleting message",
        variant: "destructive",
      });
    }
  };
  if (!session || !session.user) {
    return (
      <div className="text-center">
        <Link href="/log-in">Please login </Link>
      </div>
    );
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy profile link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
            id="purl"
          />
          <label htmlFor="purl" className="hidden">
            profileUrl label
          </label>
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleChangeSwitch}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages?.map((message, index) => (
            <CardMessage
              key={message._id as string}
              messages={message}
              onDeleteMessage={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

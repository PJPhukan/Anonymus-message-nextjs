import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User.model";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
type MessageCard = {
  messages: Message;
  onDeleteMessage: (messageId: any) => void;
};
const CardMessage = ({ messages, onDeleteMessage }: MessageCard) => {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.post(`/api/delete-message/${messages._id}`);
      toast({
        title: "Message deleted successfully",
        description: "This message has been permanently deleted",
      });
      onDeleteMessage(messages._id); //TODO:Check when it call
      console.log("Message _id :", messages._id); //TODO: Remove when after testing
      console.log("Message id :", messages.id); //TODO: Remove after testing
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
  // const handleDelete = () => {
  // TODO: implement delete message functionality

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      {/* <CardContent></CardContent>
      <CardFooter></CardFooter> */}
    </Card>
  );
};

export default CardMessage;

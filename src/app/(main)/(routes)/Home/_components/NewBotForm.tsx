"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import DbConnectForm from "./db-connect-form";
import FileUploadForm from "./file-upload-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";




export default function NewBotForm() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {" "}
          <PlusIcon className="mr-1 h-3 w-3" /> Add Chatbot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Chatbot</DialogTitle>
          <DialogDescription>
            Choose to either upload files or connect a database for your
            chatbot.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
            <TabsTrigger value="connect">Connect Database</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <FileUploadForm />
          </TabsContent>
          <TabsContent value="connect">
            <DbConnectForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

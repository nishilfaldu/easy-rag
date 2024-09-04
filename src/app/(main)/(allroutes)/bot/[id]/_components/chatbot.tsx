"use client";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { MessageSquare, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatbotProps {
  bot: FunctionReturnType<typeof api.bots.getBotById> | undefined;
}

export default function Chatbot({ bot }: ChatbotProps) {
  const { isAuthenticated } = useConvexAuth();
  const messages = useQuery(
    api.messages.list,
    isAuthenticated && bot
      ? {
          botId: bot._id,
        }
      : "skip"
  );
  const sendMessage = useMutation(api.messages.send);
  const [leftWidth] = useState(50);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
  const [inputValue, setInputValue] = useState("");

  async function handleSendMessage(
    botId: Id<"bots"> | undefined,
    isViewer: boolean,
    text: string
  ) {
    if (!botId) {
      return;
    }
    sendMessage({
      botId: botId,
      isViewer: true,
      text: inputValue,
    });
    setInputValue("");
  }

  useEffect(() => {
    chatContainerRef.current?.scrollTo(
      0,
      chatContainerRef.current.scrollHeight
    );
  }, [messages]);

  return (
    <div className="flex flex-col" style={{ width: `${100 - leftWidth}%` }}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {bot?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask me something
            </p>
          </div>
        </div>
      </div>

      <ScrollArea
        className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto"
        ref={chatContainerRef}
      >
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.isViewer ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] shadow-md transition-all duration-300 ease-in-out ${
                message.isViewer
                  ? "bg-gradient-to-r from-purple-500 to-[#4c5cfc] text-white rounded-br-none animate-slide-left"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none animate-slide-right"
              }`}
            >
              {message.isViewer ? (
                message.text
              ) : (
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-5 h-5 mt-1 text-purple-500" />
                  <span>{message.text}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              bot &&
              handleSendMessage(bot?._id, true, inputValue)
            }
            className="flex-grow bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
          />
          <Button
            onClick={async () => {
              await handleSendMessage(bot?._id, true, inputValue);
            }}
            className="bg-gradient-to-r from-purple-500 to-[#4c5cfc] hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

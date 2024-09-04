"use client";
import type { FunctionReturnType } from "convex/server";
import { Bot, Database, File, Cpu, Brain } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";

import Chatbot from "./chatbot";
import type { api } from "../../../../../../../convex/_generated/api";
import CodeCopyPaste from "./code-copy-paste";

interface BotDetailsPageProps {
  bot: FunctionReturnType<typeof api.bots.getBotById> | undefined;
}


export default function BotDetailsPage({ bot }: BotDetailsPageProps) {
  
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const getStatusColor = (progress: string | undefined) => {
    if (progress === "error") {
      return " bg-red-100 text-red-800";
    }
    if (progress === "loading") {
      return "bg-yellow-100 text-yellow-800";
    }
    if (progress === "splitting") {
      return "bg-blue-100 text-blue-800";
    }
    if (progress === "embedding") {
      return "bg-purple-100 text-purple-800";
    }

    return "bg-green-100 text-green-800";
  };

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) {
        return;
      }
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setLeftWidth(Math.max(20, Math.min(80, newLeftWidth)));
    },
    [isDragging]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const htmlString = `
  <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Clerk JavaScript Starter with Chatbot</title>
  </head>

  <body>
    <div id="app"></div>

    <!-- Clerk Script Tag -->
    <script
      async
      crossorigin="anonymous"
      data-clerk-publishable-key="process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
      onload="window.Clerk.load()"
      src="https://bold-dolphin-3.clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
      type="text/javascript"
    ></script>

    <script>
      window.addEventListener("load", async function () {
        await Clerk.load();

        if (Clerk.user) {
          document.getElementById("app").innerHTML = 
            <div id="user-button"></div>
            <div id="chatbot-container" style="width: 100%; height: 500px; border: none; border-radius: 8px;"></div>
          ;

          const userButtonDiv = document.getElementById("user-button");
          Clerk.mountUserButton(userButtonDiv);

          // Chatbot integration
          const iframe = document.createElement("iframe");
          iframe.src = https://easy-rag.vercel.app/bot/${bot?._id};
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = "none";
          iframe.style.borderRadius = "8px";

          const chatbotContainer = document.getElementById("chatbot-container");
          if (chatbotContainer) {
            chatbotContainer.appendChild(iframe);
          } else {
            console.error("Container with ID 'chatbot-container' not found.");
          }
        } else {
          document.getElementById("app").innerHTML =  <div id="sign-in"></div>;

          const signInDiv = document.getElementById("sign-in");
          Clerk.mountSignIn(signInDiv);
        }
      });
    </script>
  </body>
</html>
  `;

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-foreground overflow-hidden"
    >
      <div
        style={{ width: `${leftWidth}%` }}
        className="p-6 border-r border-gray-200 dark:border-gray-700 overflow-auto"
      >
        <div className="flex">
        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4c5cfc] to-[#b880fc]">
          Chatbot Details
        </h2></div>
        <div className="space-y-6">
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Bot className="w-8 h-8 text-purple-500" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Name:
              </span>
              <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-sm">
                {bot?.name}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Status:{" "}
              </span>

              <span
                className={`text-sm font-normal px-2 py-0.5 rounded-full ${getStatusColor(
                  bot?.progress
                )}`}
              >
                {bot?.progress}{" "}
              </span>
            </div>
          </div>

          {!bot?.isDb ? (
            <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <File className="w-8 h-8 text-blue-500" />
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Files Uploaded:
                </span>
                <span>
                {bot?.documents && bot.documents.length > 0 ? (bot.documents.map((doc) => (
                  <div key={doc._id} className="mb-1">
                    <a href={doc.url} className=" bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm underline" target="_blank" rel="noopener noreferrer">
                      {doc._id}
                    </a>
                  </div>
                    ))
                  ) : (
                    "No documents available"
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <Database className="w-8 h-8 text-indigo-500" />
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Database:
                </span>
                <span className="ml-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-sm">
                  PostgreSQL
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Cpu className="w-8 h-8 text-orange-500" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Embedding Transformer:
              </span>
              <span className="ml-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-sm">
                {bot?.embeddingModel}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Brain className="w-8 h-8 text-pink-500" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                LLM Model:
              </span>
              <span className="ml-2 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded-full text-sm">
                {bot?.completionModel}
              </span>
            </div>
          </div>
          <CodeCopyPaste code={htmlString} language="javascript" />
        </div>
      </div>
      <div
        className="w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-col-resize flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-8 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
      </div>
      <Chatbot bot={bot} />
    </div>
  );
}

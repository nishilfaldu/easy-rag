"use client";
import type { FunctionReturnType } from "convex/server";
import { Bot, Database, File, Cpu, Brain } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";

import Chatbot from "./chatbot";
import type { api } from "../../../../../../../convex/_generated/api";




interface BotDetailsPageProps {
  bot: FunctionReturnType<typeof api.bots.getBotById> | undefined;
}

export default function BotDetailsPage({ bot } : BotDetailsPageProps) {
  console.log(bot);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const getStatusColor = (progress: string | undefined) => {
    if (progress === "error") { return " bg-red-100 text-red-800"; }
    if (progress === "loading") { return "bg-yellow-100 text-yellow-800"; }
    if (progress === "splitting") { return "bg-blue-100 text-blue-800"; }
    if (progress === "embedding") { return "bg-purple-100 text-purple-800"; }

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
      if (!isDragging || !containerRef.current) { return; }
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
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
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-foreground overflow-hidden">
      <div style={{ width: `${leftWidth}%` }} className="p-6 border-r border-gray-200 dark:border-gray-700 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4c5cfc] to-[#b880fc]">Chatbot Details</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Bot className="w-8 h-8 text-purple-500" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Name:</span> 
              <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-sm">{bot?.name}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Status:  </span> 
            
                    <span
                    className={`text-sm font-normal px-2 py-0.5 rounded-full ${getStatusColor(
                      bot?.progress
                    )}`}
                  >{bot?.progress} </span>
            </div>
          </div>
        
          { !bot?.isDb ? (<div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <File className="w-8 h-8 text-blue-500" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Files Uploaded:</span> 
              <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">chatbot_data.json</span>
            </div>
          </div>)
          : (<div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Database className="w-8 h-8 text-indigo-500" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Database:</span> 
              <span className="ml-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-sm">PostgreSQL</span>
            </div>
          </div>)}
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Cpu className="w-8 h-8 text-orange-500" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Embedding Transformer:</span> 
              <span className="ml-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-sm">{bot?.embeddingModel}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <Brain className="w-8 h-8 text-pink-500" />
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">LLM Model:</span> 
              <span className="ml-2 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded-full text-sm">{bot?.completionModel}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className="w-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-col-resize flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-8 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
      </div>
      <Chatbot bot={bot}/>
    </div>
  );
}
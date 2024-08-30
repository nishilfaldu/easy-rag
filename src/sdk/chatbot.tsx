import React, { useEffect } from "react";




interface ChatbotProps {
  botId?: string;
}

export default function Chatbot({ botId }: ChatbotProps) {
  useEffect(() => {
    console.log("Chatbot component mounted"); // Add this line
    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:3000/Home";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.borderRadius = "8px";

    const container = document.getElementById("chatbot-container");
    if (container) {
      container.appendChild(iframe);
    } else {
      console.error("Container with ID 'chatbot-container' not found.");
    }

    return () => {
      if (container) {
        container.innerHTML = ""; // Clean up the iframe on component unmount
      }
    };
  }, [botId]);

  return <div id="chatbot-container" />;
}

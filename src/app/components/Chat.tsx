"use client";

import { useState, useEffect, useRef } from "react";
import useWebSocket from "@/app/hooks/useWebsocket";

export default function Chat() {
  const socketUrl =
    process.env.NEXT_PUBLIC_WS_URL ?? "ws://api.skatepark.chat/ws";

  const { messages, sendMessage } = useWebSocket(socketUrl);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Skate Chat 💬
      </h1>

      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        className="border border-gray-300 dark:border-gray-700 p-4 w-full h-64 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-inner space-y-2 custom-scrollbar"
      >
        {messages.map((msg, index) => {
          const text = typeof msg === "string" ? msg : msg.text;
          const isOwnMessage = index % 2 === 0; // Simulated sender styling

          return (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm max-w-[80%] ${
                isOwnMessage
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100 self-start"
              }`}
              style={{
                alignSelf: isOwnMessage ? "flex-end" : "flex-start",
              }}
            >
              {text}
            </div>
          );
        })}
      </div>

      {/* Input + Send Button */}
      <div className="mt-4 flex w-full gap-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
          onClick={handleSend}
        >
          Send 🚀
        </button>
      </div>
    </div>
  );
}

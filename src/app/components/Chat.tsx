"use client";

import { useState, useEffect, useRef } from "react";
import useWebSocket, { Message } from "@/app/hooks/useWebsocket";

interface Channel {
  name: string;
  channelId: string;
}

interface ChatProps {
  channelId: string; // Channel ID passed as a prop
}

export default function Chat({ channelId }: Readonly<ChatProps>) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>(channelId);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const socketUrl =
    process.env.NEXT_PUBLIC_WS_URL ?? "ws://api.skatepark.chat/ws";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "https://api.skatepark.chat";

  const { messages, sendMessage, error, isConnected, connectWebSocket } =
    useWebSocket(socketUrl, selectedChannel);

  // Fetch available channels once on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch(`${baseUrl}/channels`);
        const data = await response.json();
        setChannels(data);
      } catch (err) {
        console.error("Failed to fetch channels:", err);
      }
    };
    fetchChannels();
  }, [baseUrl]);

  // Handle channel selection change
  const handleChannelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newChannel = event.target.value;
    setSelectedChannel(newChannel);
    connectWebSocket(newChannel); // Fully reconnect WebSocket
  };

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

  // If WebSocket fails, show retry button instead of chat
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-xl font-semibold text-red-500">
          ⚠️ Connection Error
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2">{error}</p>
        <button
          onClick={() => connectWebSocket(selectedChannel)}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all"
        >
          Retry 🔄
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Skate Chat 💬
      </h1>

      {/* Channel Dropdown */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Channel:
        </label>
        <select
          value={selectedChannel}
          onChange={handleChannelChange}
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {channels.map((ch) => (
            <option key={ch.channelId} value={ch.channelId}>
              {ch.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        className="border border-gray-300 dark:border-gray-700 p-4 w-full h-64 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-inner space-y-2 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet...</p>
        ) : (
          messages.map((msg: Message, index: number) => {
            console.log("🔹 Rendering message:", msg);

            // Ensure message has valid content
            const content = msg?.content || "";
            if (!content) {
              console.warn("⚠️ Unexpected message format:", msg);
              return null;
            }

            const isOwnMessage = index % 2 === 0;

            return (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm max-w-[80%] break-words whitespace-pre-wrap ${
                  isOwnMessage
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100 self-start"
                }`}
                style={{
                  wordBreak: "break-word", // Ensures long words wrap
                  whiteSpace: "pre-wrap", // Preserves spaces and new lines
                }}
              >
                {content}
              </div>
            );
          })
        )}
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

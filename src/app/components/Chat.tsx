"use client";

import { useState, useEffect, useRef } from "react";
import useWebSocket from "@/app/hooks/useWebsocket";
import ChannelSelector from "./ChannelSelector";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import WebSocketError from "./WebSocketError";

interface Channel {
  name: string;
  channelId: string;
}

interface ChatProps {
  channelId: string;
}

export default function Chat({ channelId }: Readonly<ChatProps>) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>(channelId);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const socketUrl =
    process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.skatepark.chat/ws/relay";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "https://api.skatepark.chat";

  const {
    messages,
    systemMessage,
    sendMessage,
    error,
    isConnected,
    connectWebSocket,
  } = useWebSocket(socketUrl, selectedChannel);

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

  if (!isConnected) {
    return (
      <WebSocketError
        error={error ?? ""}
        onRetry={() => connectWebSocket(selectedChannel)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        HypeWizard Chat 💬
      </h1>

      <ChannelSelector
        channels={channels}
        selectedChannel={selectedChannel}
        onChange={handleChannelChange}
      />

      <MessageList messages={messages} ref={chatContainerRef} />

      {/* 🔹 Display System Message Below Input Field */}
      {systemMessage && (
        <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-2">
          {systemMessage}
        </p>
      )}

      <MessageInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onHype={() => sendMessage("@hype https://hypewizard.com")}
      />
    </div>
  );

  function handleChannelChange(newChannel: string) {
    setSelectedChannel(newChannel);
    connectWebSocket(newChannel);
  }

  function handleSend() {
    if (input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  }
}

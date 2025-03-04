import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

export interface Message {
  type: string;
  content?: string;
  created_at: number;
  pubkey?: string;
  channelId?: string;
  status?: string;
  text?: string;
}

export default function useWebSocket(url: string, channelId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const receivedMessageSet = useRef<Set<string>>(new Set()); // Track received messages

  // 🔗 **WebSocket Connection Setup**
  const connectWebSocket = (newChannelId: string) => {
    console.log("🔌 Initializing WebSocket connection...", newChannelId);

    if (typeof window === "undefined") {
      console.log("🛑 SSR detected: Skipping WebSocket setup.");
      return;
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("🔌 WebSocket already exists, skipping connection.");
      return;
    }

    setError(null);
    setIsConnected(false);
    setMessages([]); // Clear messages on channel change
    setSystemMessage(null); // Reset system messages
    receivedMessageSet.current.clear(); // Clear duplicate tracking

    if (socketRef.current) {
      console.log("🔌 Closing existing WebSocket...");
      socketRef.current.close();
    }

    const sessionToken = Cookies.get("ws_session");
    console.log({ sessionToken });

    console.log("✅ Connecting to WebSocket...");
    const ws = new WebSocket(`${url}?session=${sessionToken}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      setIsConnected(true);
      setError(null);
      ws.send(JSON.stringify({ type: "subscribe", channel_id: newChannelId }));
    };

    ws.onmessage = (event) => {
      try {
        const parsedMessage: Message = JSON.parse(event.data);
        console.log("📥 Received WebSocket message:", parsedMessage);

        // ✅ **Handle System Messages**
        if (parsedMessage.type === "confirmation" && parsedMessage.text) {
          console.log("✅ System Message:", parsedMessage.text);
          setSystemMessage(parsedMessage.text);

          // 🕒 **Auto-Clear System Message After 2 Seconds**
          if (parsedMessage.text === "Finished crawling") {
            setTimeout(() => {
              setSystemMessage(null);
            }, 2000);
          }

          return;
        }

        // ✅ **Handle Regular Chat Messages**
        if (parsedMessage.content && parsedMessage.created_at) {
          const messageKey = `${parsedMessage.created_at}-${parsedMessage.content}`;

          if (!receivedMessageSet.current.has(messageKey)) {
            receivedMessageSet.current.add(messageKey);

            setMessages((prev) =>
              [
                ...prev,
                {
                  content: parsedMessage.content,
                  created_at: parsedMessage.created_at,
                  pubkey: parsedMessage.pubkey,
                  type: parsedMessage.type,
                },
              ].sort((a, b) => a.created_at - b.created_at)
            );
          } else {
            console.log("⚠️ Duplicate message ignored:", parsedMessage.content);
          }
        } else {
          console.warn("⚠️ Unexpected message format:", parsedMessage);
        }
      } catch (err) {
        console.error("⚠️ Invalid JSON received:", err, event.data);
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection failed");
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket disconnected");
      setIsConnected(false);
      setError("Disconnected from WebSocket");
      socketRef.current = null;
    };
  };

  useEffect(() => {
    fetch("/api/set-cookie")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Server Response:", data);
        connectWebSocket(channelId);
      })
      .catch((err) => console.error("❌ Error setting cookie:", err));

    return () => {
      if (socketRef.current) {
        console.log("🔌 Cleaning up WebSocket...");
        socketRef.current.close();
      }
    };
  }, [channelId]);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("📤 Sending message:", message);
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          text: message,
          channel_id: channelId,
          created_at: Date.now(),
        })
      );
    } else {
      setError("Unable to send message: WebSocket is disconnected");
    }
  };

  return {
    messages,
    systemMessage, // New: Expose system messages
    sendMessage,
    error,
    isConnected,
    connectWebSocket,
  };
}

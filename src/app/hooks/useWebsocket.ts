import { useState, useEffect, useRef } from "react";

export interface Message {
  type: string;
  content: string;
  created_at: number;
}

export default function useWebSocket(url: string, channelId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isEOSEReceived, setIsEOSEReceived] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connectWebSocket = (newChannelId: string) => {
    setError(null);
    setIsConnected(false);
    setIsEOSEReceived(false); // Reset when reconnecting
    setMessages([]); // Clear messages on channel change

    // Close the existing socket if it exists
    if (socketRef.current) {
      console.log("🔌 Closing old WebSocket...");
      socketRef.current.close();
    }

    // Create a new WebSocket connection
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setIsConnected(true);
      setError(null);

      // Subscribe to the selected channel
      ws.send(JSON.stringify({ type: "subscribe", channelId: newChannelId }));
    };

    ws.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        console.log("📥 Received WebSocket message:", parsedMessage);

        // End of stored events (EOSE) received
        if (parsedMessage.type === "EOSE") {
          console.log("✅ Received EOSE, sorting messages...");
          setMessages((prevMessages) =>
            [...prevMessages].sort((a, b) => a.created_at - b.created_at)
          );
          setIsEOSEReceived(true);
          return;
        }

        // Process new messages and avoid duplicates
        if (parsedMessage.content && parsedMessage.created_at) {
          setMessages((prev) => {
            // Check if message already exists
            const messageExists = prev.some(
              (msg) => msg.created_at === parsedMessage.created_at
            );

            if (!messageExists) {
              console.log("✅ Adding new message:", parsedMessage.content);
              return [
                ...prev,
                {
                  content: parsedMessage.content,
                  created_at: parsedMessage.created_at,
                } as Message, // Explicitly cast to Message
              ].sort((a, b) => a.created_at - b.created_at);
            } else {
              console.log(
                "⚠️ Duplicate message ignored:",
                parsedMessage.content
              );
              return prev; // Ignore duplicate
            }
          });
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
    };
  };

  useEffect(() => {
    connectWebSocket(channelId);

    // Cleanup function to close WebSocket on unmount
    return () => {
      if (socketRef.current) {
        console.log("🔌 Cleaning up WebSocket...");
        socketRef.current.close();
      }
    };
  }, [url, channelId]);

  const sendMessage = (message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          text: message,
          channelId,
          created_at: Date.now(), // Attach timestamp to outgoing message
        })
      );
    } else {
      setError("Unable to send message: WebSocket is disconnected");
    }
  };

  return {
    messages,
    sendMessage,
    error,
    isConnected,
    isEOSEReceived,
    connectWebSocket,
  };
}

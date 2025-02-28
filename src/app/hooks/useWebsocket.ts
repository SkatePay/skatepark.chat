import { useState, useEffect } from "react";

export default function useWebSocket(url: string, channelId: string) {
  const [messages, setMessages] = useState<{ text: string }[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWebSocket = (newChannelId: string) => {
    setError(null); // Reset error state
    setIsConnected(false); // Hide chat until connected

    if (socket) {
      socket.close(); // Fully close existing WebSocket
    }

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setIsConnected(true);
      setError(null);

      // Subscribe to selected channel
      ws.send(JSON.stringify({ type: "subscribe", channelId: newChannelId }));
    };

    ws.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        console.log("📥 Received WebSocket message:", parsedMessage);

        // Check if the message contains `content`
        if (parsedMessage.content) {
          setMessages((prev) => [...prev, { text: parsedMessage.content }]);
          console.log("✅ Added to messages:", parsedMessage.content);
        } else {
          console.warn(
            "⚠️ Unexpected message format (missing `content`):",
            parsedMessage
          );
        }
      } catch (err) {
        console.error("⚠️ Invalid JSON received:", event.data);
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection failed");
    };

    ws.onclose = () => {
      setIsConnected(false);
      setError("Disconnected from WebSocket");
    };

    setSocket(ws);
  };

  // Initial connection
  useEffect(() => {
    connectWebSocket(channelId);
  }, [url, channelId]);

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({ type: "message", text: message, channelId })
      );
    } else {
      setError("Unable to send message: WebSocket is disconnected");
    }
  };

  return { messages, sendMessage, error, isConnected, connectWebSocket };
}

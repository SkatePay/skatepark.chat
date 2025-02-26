import { useState, useEffect } from "react";

export default function useWebSocket(url: string) {
  const [messages, setMessages] = useState<{ text: string }[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = (event) => {
      try {
        if (!event.data) return; // Ignore empty messages

        const parsedMessage = JSON.parse(event.data); // Ensure it's valid JSON
        console.log("Received:", parsedMessage);

        if (parsedMessage.text) {
          setMessages((prev) => [...prev, parsedMessage]);
        }
      } catch (error) {
        console.error("Invalid JSON received:", event.data);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = () => console.log("WebSocket closed");

    setSocket(ws);

    return () => ws.close(); // Cleanup on unmount
  }, [url]);

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageObj = { text: message }; // Send structured JSON
      socket.send(JSON.stringify(messageObj));
    }
  };

  return { messages, sendMessage };
}

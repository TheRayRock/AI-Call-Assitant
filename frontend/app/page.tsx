"use client";

import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/chat", {
        message: message,
      });

      setResponse(res.data.response);
    } catch (error) {
      console.log(error);
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-5">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold text-center">AI Voice Assistant</h1>

        <textarea
          className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700"
          rows={5}
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Thinking..." : "Send"}
        </button>

        <div className="bg-gray-900 p-4 rounded-lg min-h-[200px]">
          {response || "AI response will appear here"}
        </div>
      </div>
    </div>
  );
}

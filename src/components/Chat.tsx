"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Smile,
  Minus,
  ChevronRight,
  MessageCircleMore,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import EmojiPicker from "emoji-picker-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  /* 🔹 Send message */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setShowEmoji(false);

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("https://api.constil.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage,
          session_id: sessionId,
        }),
      });

      const data = await res.json();
      console.log(data, "data");
      setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 md:h-[500px] h-[300px] w-full w-[290px] md:w-[320px] h-dvh sm:h-130 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border">
          {/* Header */}
          <div className="bg-blue-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Support</h3>
                <p className="text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <Minus size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) =>
              msg.role === "user" ? (
                <div key={index} className="flex justify-end">
                  <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={index} className="flex gap-2">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none max-w-[80%] text-sm text-gray-700 prose prose-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ),
            )}

            {loading && (
              <div className="flex gap-2">
                <div className="bg-white p-3 rounded-2xl flex gap-1">
                  <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="relative p-3 border-t bg-white flex gap-2">
            {showEmoji && (
              <div className="absolute bottom-14 left-3 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  height={350}
                  width={300}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowEmoji((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Smile size={22} />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Reply..."
              className="flex-1 outline-none text-sm"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-500 p-2 rounded-full text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 🔘 Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 bg-white text-blue-500 p-4 rounded-full shadow-lg"
      >
        <MessageCircleMore size={28} />
      </button>
    </>
  );
};

export default Chat;

import React, { useState, useEffect } from "react";
import { Box, Input, Button, HStack, VStack, Text, Avatar } from "@chakra-ui/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // ایجاد یا دریافت یوزر ایدی ها
    let storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = Math.random().toString(36).substring(7);
      sessionStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);

    // منتظر یا گوش دادن به پیام
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);
  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        userId,
        text: input,
      };
      socket.emit("sendMessage", message);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
  <div className="h-[400px] p-4 border border-gray-300 rounded-lg overflow-y-auto">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`flex ${
          msg.userId === userId ? "justify-start" : "justify-end"
        } items-center space-x-2`}
      >
        {msg.userId === userId && (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            Me
          </div>
        )}
        <div
          className={`p-3 rounded-lg max-w-[70%] ${
            msg.userId === userId ? "bg-blue-100" : "bg-green-100"
          }`}
        >
          <p className="text-sm">{msg.text}</p>
        </div>
        {msg.userId !== userId && (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            Other
          </div>
        )}
      </div>
    ))}
  </div>

  <div className="flex items-center space-x-2">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Type a message"
      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      onClick={sendMessage}
      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
    >
      Send
    </button>
  </div>
</div>

  );
};

export default ChatBox;
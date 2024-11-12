// Chat.js
import React, { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import { useGetChatResponseMutation } from '../redux/chatApi';
import userAvatar from '../assets/logo/ava3-bg.webp';
import aiAvatar from '../assets/logo/colorized.png';
import chatSvg from '../assets/logo/chat.svg'; // Import chat.svg
import { Sparkles } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [getChatResponse] = useGetChatResponseMutation();

  const handleSend = async (userMessage) => {
    console.log("User message:", userMessage);

    // Add user message to the messages state
    setMessages((prevMessages) => [
      ...prevMessages, 
      { text: userMessage, isAI: false, avatar: userAvatar }
    ]);

    // Show typing animation
    setMessages((prevMessages) => [
      ...prevMessages, 
      { text: '🤔Thinking...', isAI: true, avatar: aiAvatar, typing: true }
    ]);

    try {
      // Fetch response from API
      console.log("Sending message to API:", userMessage);
      const response = await getChatResponse({ message: userMessage }).unwrap();

      console.log("API Response:", response);

      // Remove typing animation and add AI response
      setMessages((prevMessages) =>
        prevMessages
          .filter((msg) => !msg.typing)
          .concat({ text: response, isAI: true, avatar: aiAvatar })
      );
    } catch (error) {
      console.error("Error fetching AI response:", error);

      // Handle error and show error message
      setMessages((prevMessages) =>
        prevMessages
          .filter((msg) => !msg.typing)
          .concat({ text: 'Error: Could not reach the server.', isAI: true, avatar: aiAvatar })
      );
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Conditionally render chat.svg if there are no messages */}
      {messages.length === 0 && (
        <div className="flex justify-center items-center">
          <img src={chatSvg} alt="Chat Illustration" className="w-80 h-80" />

          <h1 className="font-lato text-4xl lg:text-6xl mt-2 mb-2 font-semibold text-blue-400 tracking-widest relative">
          <span className="block lg:inline lg:pl-4">AI Sanga Kura Garne, haina ta?    
          </span>
          <span className="absolute top-0 left-0 w-full h-full text-[#a2b5ea] transform translate-x-0.5 translate-y-0 -z-10 tracking-widest">
            <span className="block lg:inline lg:pl-4">AI Sanga Kura Garne,  haina ta? 

            </span>
          </span>
        </h1>
        </div>
      )}

      <div id="chat-box" className="mb-4 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message.text}
            isAI={message.isAI}
            avatar={message.avatar}
          />
          
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default Chat;

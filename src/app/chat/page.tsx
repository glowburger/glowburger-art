"use client";

import { useState } from "react";
import Image from 'next/image';

// Type for chat messages
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'ERROR: Failed to process message. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-blue-900 bg-opacity-50 backdrop-blur-sm">
      {/* Left Container - Image */}
      <div className="w-1/2 h-full flex items-center justify-center border-r-2 border-purple-400/30 bg-black/95">
        <div className="relative w-full h-full">
          {/* Floating Grid Background */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} 
          />
          
          {/* Placeholder for image - you'll replace this later */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-purple-300/60 font-mono animate-pulse">
              IMAGE PLACEHOLDER
            </div>
          </div>
        </div>
      </div>

      {/* Right Container - Chat */}
      <div className="w-1/2 h-full bg-black/95 flex flex-col">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-purple-300/60 font-mono text-center animate-pulse">
                INITIALIZING CHAT INTERFACE...
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-sm ${
                      message.role === 'user'
                        ? 'bg-purple-400/20 text-purple-300'
                        : 'bg-purple-900/20 text-purple-200'
                    } font-mono chat-slide-in-${message.role === 'user' ? 'right' : 'left'}`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-purple-900/20 text-purple-200 p-3 rounded-sm font-mono animate-pulse">
                  Processing...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="border-t-2 border-purple-400/30 p-4">
          <div className="relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Enter your message..."
              className="w-full bg-black/50 border-2 border-purple-400/30 rounded-sm px-4 py-2 text-purple-300 font-mono focus:outline-none focus:border-purple-400/60 placeholder-purple-400/30"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  sendMessage(inputMessage);
                }
              }}
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/60 text-xs font-mono">
              {isLoading ? 'PROCESSING...' : 'PRESS ENTER TO SEND'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 
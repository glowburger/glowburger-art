"use client";

import { useState, useRef, useEffect } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages update

  // Auto-resize textarea
  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsInitializing(false);
      setIsConnected(true);
    }, 1000);  // 1000ms = 1 second
  }, []);

  useEffect(() => {
    if (isConnected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isConnected]);

  const suggestions = [
    "Hi. How are you?",
    "Tell me about your most random memory.",
    "What are you thinking about these days?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    sendMessage(suggestion);
    setShowSuggestions(false);
  };

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
          
          {/* Video Player */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full h-full border border-purple-400/30 bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden">
              <video
                src="/chat/chat art.mp4"
                className="w-full h-full object-cover filter drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Container - Chat */}
      <div className="w-1/2 h-full bg-black/95 flex flex-col">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 relative">
          {/* Sticky Connection Header */}
          {isConnected && (
            <div className="sticky top-0 z-10 bg-black/95 border-b border-purple-400/30 pb-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                  <span className="font-mono text-purple-300/80 text-sm">CONNECTION ESTABLISHED</span>
                </div>
                {/* Stylized Badge */}
                <div className="px-3 py-1 bg-purple-900/30 border border-purple-400/30 rounded-sm font-mono text-xs text-purple-300/70 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.2)] relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-400/5 to-purple-500/10 animate-pulse" />
                  <div className="relative">
                    GLOW'S PERSONAL TIMECAPSULE 4
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isInitializing ? (
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
                <div className="bg-purple-900/20 text-purple-200 p-3 rounded-sm font-mono animate-pulse max-w-[80%]">
                  <div className="text-sm">Processing...</div>
                  <div className="text-xs opacity-50 mt-1">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions Area - above input */}
        {showSuggestions && messages.length === 0 && isConnected && (
          <div className="p-4 animate-fade-in">
            <div className="flex flex-col items-center gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 bg-purple-900/30 border border-purple-400/30 
                    rounded-sm font-mono text-xs text-purple-300/70 
                    hover:bg-purple-400/20 hover:border-purple-400/50 
                    transition-colors cursor-pointer backdrop-blur-sm
                    shadow-[0_0_15px_rgba(168,85,247,0.1)]
                    text-center whitespace-nowrap
                    opacity-0 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input Area */}
        <div className="border-t-2 border-purple-400/30 p-4">
          <div className="relative flex gap-2">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTextareaInput();
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading && inputMessage.trim()) {
                    sendMessage(inputMessage);
                  }
                }
              }}
              placeholder="Enter your message..."
              className="flex-1 bg-black/50 border-2 border-purple-400/30 rounded-sm px-4 py-2 text-purple-300 font-mono focus:outline-none focus:border-purple-400/60 placeholder-purple-400/30 resize-none min-h-[40px] max-h-[160px]"
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={() => {
                if (!isLoading && inputMessage.trim()) {
                  sendMessage(inputMessage);
                }
              }}
              disabled={isLoading || !inputMessage.trim()}
              className={`px-4 py-2 rounded-sm font-mono text-sm transition-colors ${
                isLoading || !inputMessage.trim()
                  ? 'bg-purple-400/20 text-purple-300/50 cursor-not-allowed'
                  : 'bg-purple-400/30 text-purple-300 hover:bg-purple-400/40 cursor-pointer'
              }`}
            >
              {isLoading ? 'SENDING...' : 'SEND'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 
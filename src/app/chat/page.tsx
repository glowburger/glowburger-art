"use client";

import { useState, useRef, useEffect } from "react";
import Link from 'next/link';

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
    <div className="flex h-screen bg-white">
      {/* Left Container - Image */}
      <div className="w-1/2 h-full flex items-center justify-center border-r border-[#4A4A4A]/20 bg-white/95">
        {/* Back Button */}
        <Link
          href="/"
          className="
            absolute
            top-4
            left-4
            z-50
            px-4
            py-2
            bg-white
            border
            border-[#4A4A4A]/20
            rounded-sm
            font-mono
            text-sm
            text-[#4A4A4A]/70
            hover:bg-[#4A4A4A]/5
            hover:border-[#4A4A4A]/40
            transition-colors
            flex
            items-center
            gap-2
          "
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          GO BACK
        </Link>

        <div className="relative w-full h-full">
          {/* Floating Grid Background */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: `
                linear-gradient(rgba(74, 74, 74, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74, 74, 74, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} 
          />
          
          {/* Video Player */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full h-full border border-[#4A4A4A]/20 bg-white/50 rounded-lg overflow-hidden">
              <video
                src="/machine garden/computer.mp4"
                className="w-full h-full object-cover filter drop-shadow-[0_0_15px_rgba(74,74,74,0.3)]"
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
      <div className="w-1/2 h-screen bg-white flex flex-col">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Sticky Connection Header */}
          {isConnected && (
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-[#4A4A4A]/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="
                    w-2 
                    h-2 
                    bg-[#00ffd5] 
                    rounded-full 
                    animate-pulse 
                    shadow-[0_0_8px_#00ffd5] 
                    relative
                    after:content-['']
                    after:absolute
                    after:inset-0
                    after:rounded-full
                    after:shadow-[0_0_12px_#00ffd5]
                    after:animate-pulse
                  " />
                  <span className="font-mono text-[#4A4A4A]/70 text-sm">CONNECTION ESTABLISHED</span>
                </div>
                <div className="px-3 py-1 bg-[#4A4A4A]/5 border border-[#4A4A4A]/20 rounded-sm font-mono text-xs text-[#4A4A4A]/70">
                  GLOW&apos;S PERSONAL TIMECAPSULE 4
                </div>
              </div>
            </div>
          )}

          <div className="p-4 space-y-4">
            {isInitializing ? (
              <div className="text-[#4A4A4A]/60 font-mono text-center animate-pulse">
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
                        ? 'bg-[#4A4A4A]/5 text-[#4A4A4A]'
                        : 'bg-[#4A4A4A]/10 text-[#4A4A4A]'
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
                <div className="bg-[#4A4A4A]/5 text-[#4A4A4A] p-3 rounded-sm font-mono animate-pulse max-w-[80%]">
                  <div className="text-sm">...</div>
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
                  className="px-4 py-2 bg-[#4A4A4A]/5 border border-[#4A4A4A]/20 
                    rounded-sm font-mono text-xs text-[#4A4A4A]/70 
                    hover:bg-[#4A4A4A]/10 hover:border-[#4A4A4A]/40 
                    transition-colors cursor-pointer
                    text-center whitespace-nowrap"
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
        <div className="border-t border-[#4A4A4A]/20 p-4">
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
              className="flex-1 bg-[#4A4A4A]/5 border border-[#4A4A4A]/20 rounded-sm px-4 py-2 
                text-[#4A4A4A] font-mono focus:outline-none focus:border-[#4A4A4A]/40 
                placeholder-[#4A4A4A]/30 resize-none min-h-[40px] max-h-[160px]"
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
                  ? 'bg-[#4A4A4A]/20 text-[#4A4A4A]/50 cursor-not-allowed'
                  : 'bg-[#4A4A4A] text-white hover:bg-[#4A4A4A]/80 cursor-pointer'
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
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Sample album data structure (replace with your actual images)
const albums = [
  {
    id: 1,
    title: "Fun Guy Series",
    images: [
      "/0001-0144.mp4",
      "/Fun Guy Terrains Ghost.gif",
      "/base gif.gif"
    ]
  },
  {
    id: 2,
    title: "Bob's Story",
    images: [
      "/bob is ded_scene 1.1.gif",
      "/0025.png",
      "/3 discombobulated.png"
    ]
  },
  {
    id: 3,
    title: "Common Collection",
    images: [
      "/Common.gif",
      "/Common (thumbnail).gif",
      "/The Fool (Common 1).gif"
    ]
  },
  {
    id: 4,
    title: "Abstract Works",
    images: [
      "/darkprint.png",
      "/0001-0025-ezgif.com-optimize.gif",
      "/base gif (1).gif"
    ]
  }
];

// Add this video component
const MediaDisplay = ({ src }: { src: string }) => {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');

  return isVideo ? (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  ) : (
    <Image
      src={src}
      alt=""
      fill
      className="object-cover"
      sizes="(max-width: 768px) 50vw, 25vw"
    />
  );
};

// Update the ChatMessage interface
interface ChatMessage {
  type: 'image' | 'text' | 'loading';
  content: string;
  timestamp: Date;
  status: 'user' | 'system';
}

export default function Home() {
  const [currentIndices, setCurrentIndices] = useState([0, 0, 0, 0]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  

  const handleClick = async (albumIndex: number) => {
    const newIndex = (currentIndices[albumIndex] + 1) % albums[albumIndex].images.length;
    
    // Add user's image preview
    setMessages(prev => [...prev, {
      type: 'image',
      content: albums[albumIndex].images[newIndex],
      timestamp: new Date(),
      status: 'user'
    }]);

    // Add loading indicator after 300ms
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'loading',
        content: '',
        timestamp: new Date(),
        status: 'system'
      }]);
    }, 300);

    // Replace loading with actual title after 2 seconds
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(m => m.type === 'loading');
        if (loadingIndex > -1) {
          newMessages[loadingIndex] = {
            type: 'text',
            content: albums[albumIndex].title,
            timestamp: new Date(),
            status: 'system'
          };
        }
        return newMessages;
      });
    }, 2000);

    setCurrentIndices(prev => {
      const newIndices = [...prev];
      newIndices[albumIndex] = newIndex;
      return newIndices;
    });
  };

  useEffect(() => {
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen p-8 flex flex-col bg-transparent">
      <div className="flex-1 flex flex-row items-stretch gap-8 h-full" style={{ width: 'calc(100% - 4rem)' }}>
        {/* Image Grid Container */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <main className="grid grid-cols-2 h-[90vh] w-[90vh] gap-4 p-4">
            {albums.map((album, index) => (
              <div 
                key={album.id}
                className="relative aspect-square w-full h-full cursor-pointer group overflow-hidden rounded-2xl"
                style={{ zIndex: 40 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleClick(index)}
              >
                {/* Media Content Layer */}
                <div className="relative z-10 h-full w-full">
                  <div className={`
                    absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${hoveredIndex === index ? 'scale-110' : ''}
                    ${hoveredIndex !== null && hoveredIndex !== index ? 'scale-[0.98] blur-sm' : ''}
                  `}>
                    <MediaDisplay src={album.images[currentIndices[index]]} />
                  </div>
                </div>

                {/* Effects Layer */}
                <div className="absolute inset-0 z-20">
                  <div className={`
                    absolute inset-0 bg-gradient-to-b from-purple-500/5 to-pink-500/3 mix-blend-lighten transition-opacity duration-500
                    ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                  `} />

                  <div className={`
                    absolute inset-0 shadow-[0_0_60px_15px] shadow-purple-400/20 
                    transition-opacity duration-500
                    ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                  `} />

                  <div className={`
                    absolute inset-0 backdrop-blur-md transition-opacity duration-500
                    ${hoveredIndex !== null && hoveredIndex !== index ? 'opacity-50' : 'opacity-0'}
                  `} />
                </div>

                {/* Border Layer */}
                <div className="absolute inset-0 rounded-2xl border-2 border-gray-300 transition-all duration-500 group-hover:border-gray-400/50 z-30" />
              </div>
            ))}
          </main>
        </div>

        {/* Chat Container */}
        <div className="flex-1 min-w-[400px] max-w-2xl backdrop-blur-lg rounded-xl p-6 flex flex-col h-[90vh]">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Creation Log</h2>
          <div className="flex-1 overflow-y-auto flex flex-col justify-end">
            <div className="space-y-4 pr-2">
              {messages.map((message, index) => (
                message.type === 'loading' ? (
                  <div key={index} className="flex items-center space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                ) : message.type === 'image' ? (
                  <div key={index} className="flex items-start justify-end">
                    <div className="relative bg-blue-100/20 backdrop-blur-sm rounded-xl p-3 shadow-sm max-w-[80%] mr-4
                      before:content-[''] before:absolute before:-right-[8px] before:top-[10px]
                      before:w-4 before:h-4 before:bg-inherit before:backdrop-blur-sm
                      before:clip-path-bubble-arrow-right">
                      <div className="relative w-full aspect-square overflow-hidden rounded-xl">
                        <MediaDisplay src={message.content} />
                      </div>
                      <time className="text-xs text-gray-500/80 mt-1 block text-right">
                        {message.timestamp.toLocaleTimeString()}
                      </time>
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex items-start">
                    <div className="relative bg-white/20 backdrop-blur-sm rounded-xl p-3 shadow-sm max-w-[80%] ml-4
                      before:content-[''] before:absolute before:-left-[8px] before:top-[10px]
                      before:w-4 before:h-4 before:bg-inherit before:backdrop-blur-sm
                      before:clip-path-bubble-arrow">
                      <p className="text-sm font-medium text-gray-800">
                        {message.content}
                      </p>
                      <time className="text-xs text-gray-500/80 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </time>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

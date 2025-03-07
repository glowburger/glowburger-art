"use client";

import Image from "next/image";
import { useState } from "react";

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

export default function Home() {
  const [currentIndices, setCurrentIndices] = useState([0, 0, 0, 0]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleClick = (albumIndex: number) => {
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      newIndices[albumIndex] = (prev[albumIndex] + 1) % albums[albumIndex].images.length;
      return newIndices;
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="h-screen p-8 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <h1 className="text-4xl font-bold text-center mb-8">glowburger art</h1>
      
      <div className="flex-1 flex items-center justify-center">
        <main className="grid grid-cols-2 h-[90vh] w-[90vh] gap-4 p-4">
          {albums.map((album, index) => (
            <div 
              key={album.id}
              className="relative aspect-square w-full h-full cursor-pointer group overflow-hidden rounded-2xl"
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
              <div className="absolute inset-0 rounded-2xl border-2 border-gray-100 transition-all duration-500 group-hover:border-gray-200/50 z-30" />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";

// Sample album data structure (replace with your actual images)
const albums = [
  {
    id: 1,
    title: "Fun Guy Series",
    images: [
      "/Halloween Fun Guy (provoked).gif",
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

export default function Home() {
  const [currentIndices, setCurrentIndices] = useState([0, 0, 0, 0]);

  const handleClick = (albumIndex: number) => {
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      newIndices[albumIndex] = (prev[albumIndex] + 1) % albums[albumIndex].images.length;
      return newIndices;
    });
  };

  return (
    <div className="h-screen p-8 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <h1 className="text-4xl font-bold text-center mb-8">glowburger art</h1>
      <main className="grid grid-cols-2 gap-4 flex-1 w-full h-full">
        {albums.map((album, index) => (
          <div 
            key={album.id}
            className="relative w-full h-full cursor-pointer group"
            onClick={() => handleClick(index)}
          >
            <Image
              src={album.images[currentIndices[index]]}
              alt={`${album.title} - Image ${currentIndices[index] + 1}`}
              fill
              className="object-cover transition-opacity group-hover:opacity-80"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </main>
      
      <footer className="mt-8 py-4 text-center bg-black/5 dark:bg-white/5 rounded-lg">
        <div className="space-y-1">
          <p className="text-lg font-semibold">
            im open to collabs
          </p>
          <p className="text-sm opacity-80 hover:opacity-100 transition-opacity">
            let&apos;s glow together
          </p>
        </div>
      </footer>
    </div>
  );
}

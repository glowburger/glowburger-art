/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element, @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

// Update the MediaDisplay component
const MediaDisplay = ({ src, className }: { src: string; className?: string }) => {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');

  return (
    <div className={`${className || ''} relative`}>
      {isVideo ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-contain max-w-full max-h-full"
          controls={false}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <img
          src={src}
          alt=""
          className="w-full h-full object-contain max-w-full max-h-full"
          loading="lazy"
        />
      )}
    </div>
  );
};

// Update the ChatMessage interface
interface ChatMessage {
  type: 'image' | 'text' | 'loading';
  content: string;
  timestamp: Date;
  status: 'user' | 'system';
}

const HomePage = () => {
  const [mediaFiles, setMediaFiles] = useState<Array<{ path: string, metadata: any }>>([]);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('/api/media');
        if (!response.ok) throw new Error('Failed to fetch');
        const files = await response.json();
        
        // Add debug logging
        console.log('Fetched media files:', files);
        setMediaFiles(files);
      } catch (error) {
        console.error('Error loading media:', error);
        setMediaFiles([]);
      }
    };
    fetchMedia();
  }, []);

  useEffect(() => {
    // Initialize time after hydration
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-blue-900 bg-opacity-50 backdrop-blur-sm">
      {/* Left Side - Columns */}
      <div className="w-1/3 h-full flex flex-col border-r-2 border-purple-400/30 bg-black/95 scrollbar-hide">
        {/* Scrollable masonry container */}
        <div className="flex-1 overflow-y-auto p-1">
          <div className="columns-3 gap-1"> {/* CSS columns instead of grid */}
            {mediaFiles.map((file, index) => (
              <div
                key={index}
                className="break-inside-avoid mb-1 group relative overflow-hidden rounded-sm border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedMedia(file.path)}
              >
                <MediaDisplay 
                  src={file.path}
                  className="w-full h-auto max-w-full object-contain"
                />
                {/* Metadata overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs font-mono text-purple-300 truncate">
                    {file.metadata?.title || "untitled"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Status Bar - keep at bottom */}
        <div className="h-8 border-t-2 border-purple-400/30 bg-black/95 flex items-center px-4">
          <div className="flex-1 font-mono text-xs text-purple-400/60">
            {mediaFiles.length} ITEMS LOADED
          </div>
          <div className="font-mono text-xs text-purple-400/60">
            {currentTime}
          </div>
        </div>
      </div>

      {/* Right Side - Viewer */}
      <div className="w-2/3 bg-black/95 border-l-2 border-purple-400/50 flex flex-col h-screen overflow-hidden">
        {/* Media Display - Fixed Height */}
        <div className="flex-shrink-0 h-[70vh] border-b-2 border-purple-400/30 p-4 overflow-hidden">
          {selectedMedia ? (
            <MediaDisplay 
              src={selectedMedia}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-purple-400/30">
              SELECT MEDIA TO VIEW
            </div>
          )}
        </div>

        {/* Metadata Panel - Removed title header */}
        <div className="flex-1 min-h-[30vh] p-4 overflow-hidden">
          {selectedMedia && (
            <div className="font-mono text-purple-300 h-full overflow-hidden">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="col-span-1">
                  <p className="text-purple-400/60 mb-1">Collection</p>
                  <p className="text-purple-300/90 border border-purple-400/20 p-2 rounded-sm break-words">
                    {mediaFiles.find(f => f.path === selectedMedia)?.metadata?.collection || "UNCATALOGUED"}
                  </p>
                </div>
                
                <div className="col-span-3">
                  <p className="text-purple-400/60 mb-1">Description</p>
                  <div className="border border-purple-400/20 p-2 rounded-sm">
                    <p className="text-purple-300/90 leading-snug whitespace-normal">
                      {mediaFiles.find(f => f.path === selectedMedia)?.metadata?.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

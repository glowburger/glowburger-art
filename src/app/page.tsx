"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';

// MediaDisplay component with proper typing
const MediaDisplay = ({ src, className }: { src: string; className?: string }) => {
  const isVideo = ['.mp4', '.webm'].some(ext => src.endsWith(ext));
  
  return isVideo ? (
    <video 
      src={src} 
      className={className}
      autoPlay
      muted
      loop
      playsInline
    />
  ) : (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt="Artwork preview"
        fill
        className={className + ' object-contain'}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={80}
        loading="lazy"
      />
    </div>
  );
};

// Add this interface instead:
interface MediaFile {
  path: string;
  metadata?: {
    title?: string;
    description?: string;
    collection?: string;
  };
}

const HomePage = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
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
      {/* Preserved initialization animation */}
      {!mediaFiles.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse font-mono text-purple-400/60">
            INITIALIZING MEDIA...
          </div>
        </div>
      )}

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
                {/* Replace img with MediaDisplay component */}
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
      <div className="w-2/3 bg-black/95 border-l-2 border-purple-400/50 flex flex-col h-screen">
        {/* Media Display - Fixed Height */}
        <div className="flex-shrink-0 h-[70vh] border-b-2 border-purple-400/30 p-4">
          <div className="relative h-full w-full flex items-center justify-center">
            {selectedMedia ? (
              <div className="w-full h-full flex items-center justify-center">
                {/* Floating Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `
                    linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }} />
                
                <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] border border-purple-400/30 bg-black/50 backdrop-blur-sm">
                  <MediaDisplay 
                    src={selectedMedia}
                    className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  />
                  
                </div>
              </div>
            ) : (
              <div className="text-purple-300 text-center">
                <p className="text-xl mb-4 font-mono animate-pulse">
                  INITIALIZING MEDIA ARCHIVE...
                </p>
                <div className="inline-block border border-purple-400/30 p-4 bg-black/50 backdrop-blur-sm">
                  <p className="text-sm font-mono text-purple-400/70">
                    {`> SELECT_ITEM(COLLECTION: "GLOWBURGER_ART")`}
                  </p>
                  <div className="h-1 w-full bg-purple-400/20 mt-2 overflow-hidden">
                    <div className="animate-progress h-full bg-purple-400/50" 
                      style={{width: `${mediaFiles.length > 0 ? 100 : 0}%`}} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Panel - Scrollable within fixed height */}
        <div className="flex-1 min-h-[30vh] p-4">
          {selectedMedia && (
            <div className="font-mono text-purple-300 h-full">
              <h2 className="text-xl border-b border-purple-400/30 pb-2 mb-4">
                {mediaFiles.find(f => f.path === selectedMedia)?.metadata?.title || "UNTITLED"}
              </h2>
              
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

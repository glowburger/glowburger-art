"use client";

import { useAtom } from 'jotai';
import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import {
  collectionsAtom,
  allImagesAtom,
  activeTabAtom,
  selectedImageAtom,
  organizedImagesAtom,
  type MediaFile
} from '@/atoms/gallery';

const API_BASE_URL = 'https://api.glowburger.art/api/media';

const formatPathForApi = (folder: string, filename: string) => {
  const formattedFolder = folder.replace(/ /g, '-');
  return `${API_BASE_URL}/${formattedFolder}/${encodeURIComponent(filename)}`;
};

// Replace the existing MediaLoader with this new skeleton loader
const MediaLoader = () => (
  <div className="absolute inset-0 bg-white overflow-hidden">
    <div className="w-full h-full relative">
      {/* Base skeleton */}
      <div className="absolute inset-0 bg-[#4A4A4A]/5" />
      
      {/* Animated shine effect */}
      <div 
        className="absolute inset-0 animate-shine"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(74, 74, 74, 0.05) 50%, transparent 100%)',
          backgroundSize: '200% 100%'
        }}
      />
    </div>
  </div>
);

// MediaDisplay component with proper typing
const MediaDisplay = ({ src, className }: { src: string; className?: string }) => {
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  const [folder, ...filenameParts] = cleanSrc.split('/');
  const filename = filenameParts.join('/');
  const apiUrl = formatPathForApi(folder, filename);
  
  const isVideo = ['.mp4', '.webm'].some(ext => filename.toLowerCase().endsWith(ext));
  const isGif = filename.toLowerCase().endsWith('.gif');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const baseStyles = `
    transition-[filter] duration-200 ease-in-out
    [filter:grayscale(100%)_brightness(1.0)_sepia(0.2)_saturate(0.1)]
    group-hover:[filter:grayscale(0%)_brightness(1)_sepia(0)_saturate(1)]
    will-change-[filter]
    ${className || ''}
  `;

  if (isVideo) {
    return (
      <div className={`relative w-full overflow-hidden ${baseStyles}`}>
        {loading && <MediaLoader />}
        <video 
          src={apiUrl}
          className="w-full h-auto"
          autoPlay
          muted
          loop
          playsInline
          crossOrigin="anonymous"
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#4A4A4A]/10">
            <span className="font-mono text-sm text-[#4A4A4A]/60">Failed to load media</span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="relative w-full overflow-hidden">
      {loading && <MediaLoader />}
      <Image
        src={apiUrl}
        alt="Artwork preview"
        width={1200}
        height={800}
        className={`${baseStyles} w-full h-auto`}
        quality={80}
        loading="lazy"
        unoptimized={isGif}
        crossOrigin="anonymous"
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#4A4A4A]/10">
          <span className="font-mono text-sm text-[#4A4A4A]/60">Failed to load media</span>
        </div>
      )}
    </div>
  );
};

// Add this new component for raw media display
const MediaDisplayRaw = ({ src }: { src: string }) => {
  const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
  const [folder, ...filenameParts] = cleanSrc.split('/');
  const filename = filenameParts.join('/');
  const apiUrl = formatPathForApi(folder, filename);
  
  const isVideo = ['.mp4', '.webm'].some(ext => filename.toLowerCase().endsWith(ext));
  const isGif = filename.toLowerCase().endsWith('.gif');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (isVideo) {
    return (
      <div className="relative w-full overflow-hidden">
        {loading && <MediaLoader />}
        <video 
          src={apiUrl}
          className="w-full h-auto"
          autoPlay
          muted
          loop
          playsInline
          controls
          crossOrigin="anonymous"
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#4A4A4A]/10">
            <span className="font-mono text-sm text-[#4A4A4A]/60">Failed to load media</span>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="relative w-full overflow-hidden">
      {loading && <MediaLoader />}
      <Image
        src={apiUrl}
        alt="Artwork preview"
        width={2400}
        height={1600}
        className="w-full h-auto"
        quality={100}
        priority
        unoptimized={isGif}
        crossOrigin="anonymous"
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#4A4A4A]/10">
          <span className="font-mono text-sm text-[#4A4A4A]/60">Failed to load media</span>
        </div>
      )}
    </div>
  );
};

// Add this new component for the mobile menu drawer
const MobileMenuDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <>
    {isOpen && (
      <div 
        className="fixed inset-0 bg-white/80 z-40 animate-fade-in"
        onClick={onClose}
      />
    )}
    <div className={`
      fixed top-0 right-0 h-full w-64 bg-white z-50
      border-l border-[#4A4A4A]/20 transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-mono text-sm text-[#4A4A4A]/60">MENU</h3>
          <button 
            onClick={onClose}
            className="text-[#4A4A4A] hover:text-[#4A4A4A]/80"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#4A4A4A]/60">LATEST</h4>
            <div className="space-y-2">
              <a 
                href="/chat"
                onClick={onClose}
                className="
                  flex items-center gap-2 
                  text-[#4A4A4A] 
                  hover:text-[#4A4A4A]/80 
                  transition-colors
                "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
                <span className="font-mono text-sm">GlowPT4</span>
              </a>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#4A4A4A]/60">SOCIAL</h4>
            <div className="space-y-2">
              <a 
                href="https://x.com/glowburger"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#4A4A4A]/80 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="font-mono text-sm">Twitter</span>
              </a>
              <a 
                href="https://instagram.com/glowburger_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#4A4A4A]/80 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-mono text-sm">Instagram</span>
              </a>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#4A4A4A]/60">MARKETPLACES</h4>
            <div className="space-y-2">
              <a 
                href="https://d.rip/glowburger"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-sm text-[#4A4A4A] hover:text-[#4A4A4A]/80 transition-colors"
              >
                drip.haus
              </a>
              <a 
                href="https://www.mallow.art/u/glowburger"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-sm text-[#4A4A4A] hover:text-[#4A4A4A]/80 transition-colors"
              >
                mallow.art
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const HomePage = () => {
  const [collections, setCollections] = useAtom(collectionsAtom);
  const [, setAllImages] = useAtom(allImagesAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const [organizedImages] = useAtom(organizedImagesAtom);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef(0);

  useEffect(() => {
    const fetchCollectionImages = async () => {
      try {
        const response = await fetch('/api/media');
        if (!response.ok) throw new Error('Failed to fetch');
        const files: MediaFile[] = await response.json();
        
        const sortedFiles = files.sort((a, b) => b.modifiedTime - a.modifiedTime);
        setAllImages(sortedFiles);

        setCollections(prev => prev.map(collection => ({
          ...collection,
          images: files
            .filter((file) => file.path.startsWith(`/${collection.path}/`))
            .map(file => file.path)
        })));
      } catch (error) {
        console.error('Error loading media:', error);
      }
    };

    fetchCollectionImages();
  }, [setAllImages, setCollections]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.marketplace-dropdown')) {
        setIsMarketplaceOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCloseDrawer = () => {
    setSelectedImage(null);
  };

  // Add these new functions
  const getCurrentImages = () => {
    return activeTab
      ? organizedImages.filter(img => img.path.startsWith(`/${activeTab}/`))
      : organizedImages;
  };

  const handleNavigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentImages = getCurrentImages();
    const currentIndex = currentImages.findIndex(img => img.path === selectedImage.path);
    
    if (direction === 'prev') {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1;
      setSelectedImage(currentImages[prevIndex]);
    } else {
      const nextIndex = currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0;
      setSelectedImage(currentImages[nextIndex]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartY.current;
    
    // Only allow dragging downwards
    if (diff < 0) {
      setDragOffset(0);
      return;
    }
    
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // If dragged more than 150px down, close the drawer
    if (dragOffset > 150) {
      handleCloseDrawer();
    }
    
    // Reset the offset
    setDragOffset(0);
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Chat Banner */}
      <div className="relative bg-gradient-to-r from-[#FF69B4]/5 via-[#7333BD]/5 to-[#FF69B4]/5 border-b border-[#4A4A4A]/20">
        <div className="max-w-screen-xl mx-auto px-6 py-3">
          <a 
            href="/chat"
            className="
              flex items-center justify-center gap-2
              font-mono text-sm
              transition-all duration-300 ease-out
              group
              hover:scale-[1.02]
              relative
            "
          >
            <span 
              className="
                relative
                bg-gradient-to-r from-[#FF69B4] via-[#7333BD] to-[#FF69B4]
                bg-[length:300%_100%]
                animate-gradient-flow-lr
                bg-clip-text
                text-transparent
                animate-bounce-slow
                group-hover:animate-gradient-flow-lr-fast
                after:absolute after:inset-0 after:z-[-1]
                after:opacity-0 after:transition-opacity after:duration-300
                after:rounded-lg
                group-hover:after:opacity-100
              "
            >
              chat with my inner child
            </span>
            <span 
              className="
                font-mono 
                animate-bounce-slow 
                text-[#4A4A4A]
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              {'>>>'}
            </span>
          </a>
        </div>
        
        {/* Animated background gradient */}
        <div 
          className="
            absolute inset-0 -z-10
            bg-gradient-to-r from-[#FF69B4]/5 via-[#7333BD]/5 to-[#FF69B4]/5
            bg-[length:200%_100%]
            animate-gradient-flow-lr-slow
            pointer-events-none
          "
        />
      </div>

      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#4A4A4A]/20">
        <div className="max-w-screen-xl mx-auto p-6">
          <div className="flex items-center justify-between">
            {/* Artist Name and Description */}
            <div>
              <div className="flex items-center gap-4">
                <h1 className="font-mono text-2xl font-bold text-[#4A4A4A]">
                  GLOWBURGER
                </h1>
                <p className="hidden md:block font-mono text-sm text-[#4A4A4A]/70">
                  artist from singapore
                </p>
              </div>
            </div>

            {/* Social Links and Menu - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {/* X (Twitter) */}
              <a 
                href="https://x.com/glowburger" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#4A4A4A] hover:text-[#4A4A4A]/80 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/glowburger_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#4A4A4A] hover:text-[#4A4A4A]/80 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Marketplaces Dropdown */}
              <div className="relative marketplace-dropdown">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMarketplaceOpen(!isMarketplaceOpen);
                  }}
                  className="font-mono text-sm text-[#4A4A4A] border border-[#4A4A4A] 
                    px-2 py-1 hover:bg-[#4A4A4A]/10 transition-colors cursor-pointer"
                >
                  MARKETPLACES ▾
                </button>
                <div className={`
                  absolute right-0 mt-2 w-48 bg-white border border-[#4A4A4A]/20 
                  z-[60] shadow-lg shadow-black/50
                  ${isMarketplaceOpen ? 'block' : 'hidden'}
                `}>
                  <a 
                    href="https://d.rip/glowburger" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-[#4A4A4A] hover:bg-[#4A4A4A]/10 cursor-pointer"
                  >
                    drip.haus
                  </a>
                  <a 
                    href="https://www.mallow.art/u/glowburger"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="block px-4 py-2 text-sm text-[#4A4A4A] hover:bg-[#4A4A4A]/10 cursor-pointer"
                  >
                    mallow.art
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-[#4A4A4A] hover:text-[#4A4A4A]/80"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-screen-xl mx-auto px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab(null)}
              className={`font-mono text-sm px-3 py-1.5 transition-colors whitespace-nowrap cursor-pointer
                ${!activeTab 
                  ? 'bg-[#4A4A4A] text-white' 
                  : 'text-[#4A4A4A] hover:bg-[#4A4A4A]/10'
                }`}
            >
              ALL
            </button>
            {[
              'machine garden',
              'bob is ded',
              'burgers',
              'fun guys',
              'genesis'
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-mono text-sm px-3 py-1.5 transition-colors whitespace-nowrap cursor-pointer
                  ${activeTab === tab 
                    ? 'bg-[#4A4A4A] text-white' 
                    : 'text-[#4A4A4A] hover:bg-[#4A4A4A]/10'
                  }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Content Section */}
      <div className="p-6">
        {/* Masonry Layout Container */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {organizedImages.map((file, index) => (
            <div
              key={`${file.path}-${index}`}
              className="mb-4 break-inside-avoid cursor-pointer"
              onClick={() => setSelectedImage(file)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden group">
                <MediaDisplay
                  src={file.path}
                  className="transition-all duration-500 group-hover:scale-105 w-full h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Details Drawer */}
      {selectedImage && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-white/80 z-[60] animate-fade-in cursor-pointer"
            onClick={handleCloseDrawer}
            aria-label="Close drawer"
            role="button"
            tabIndex={0}
          />
          
          {/* Drawer */}
          <div 
            className={`
              fixed bg-white z-[70] border-[#4A4A4A]/20
              overflow-y-auto
              touch-pan-y
              
              /* Mobile styles */
              bottom-0 left-0 right-0
              h-[80vh]
              border-t
              rounded-t-lg
              
              /* Desktop styles */
              md:bottom-auto md:left-auto
              md:top-0 md:right-0
              md:h-full md:w-2/3
              lg:w-1/2
              md:border-l
              md:rounded-none

              /* Animation */
              transform
              transition-all
              ${isDragging ? 'transition-none' : 'duration-300 ease-out'}
              animate-slide-in-up
              md:animate-slide-in-right
            `}
            style={{
              transform: `
                translateY(${dragOffset}px)
                ${isDragging ? `scale(${1 - dragOffset / 1000})` : ''}
              `
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drag Handle - Make it more prominent */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1 rounded-full bg-[#4A4A4A]/20" />
            </div>

            {/* Navigation Arrows */}
            <div className="hidden md:flex justify-between items-center px-6 py-4 border-b border-[#4A4A4A]/20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateImage('prev');
                }}
                className="w-10 h-10 rounded-full bg-white border border-[#4A4A4A]/20 
                  flex items-center justify-center
                  text-[#4A4A4A] hover:text-[#4A4A4A]/80 
                  transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className="font-mono text-sm text-[#4A4A4A]/60">
                Navigate Gallery
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateImage('next');
                }}
                className="w-10 h-10 rounded-full bg-white border border-[#4A4A4A]/20 
                  flex items-center justify-center
                  text-[#4A4A4A] hover:text-[#4A4A4A]/80 
                  transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mobile navigation */}
            <div className="flex md:hidden justify-between items-center fixed bottom-0 left-0 right-0 
              bg-white border-t border-[#4A4A4A]/20 p-4 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateImage('prev');
                }}
                className="w-12 h-12 rounded-full bg-white border border-[#4A4A4A]/20 
                  flex items-center justify-center
                  text-[#4A4A4A] hover:text-[#4A4A4A]/80 
                  transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateImage('next');
                }}
                className="w-12 h-12 rounded-full bg-white border border-[#4A4A4A]/20 
                  flex items-center justify-center
                  text-[#4A4A4A] hover:text-[#4A4A4A]/80 
                  transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 pb-24 md:pb-6">
              {/* Image and Details */}
              <MediaDisplayRaw src={selectedImage.path} />

              {/* Image Details */}
              <div className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <h3 className="font-mono text-xs text-[#4A4A4A]/60">TITLE</h3>
                  <p className="font-mono text-lg text-[#4A4A4A]">
                    {selectedImage.metadata?.title || 'Untitled'}
                  </p>
                </div>

                {/* Category */}
                <div>
                  <h3 className="font-mono text-xs text-[#4A4A4A]/60">CATEGORY</h3>
                  <p className="font-mono text-[#4A4A4A]">
                    {collections.find(c => 
                      selectedImage.path.startsWith(`/${c.path}/`)
                    )?.name || 'Uncategorized'}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-mono text-xs text-[#4A4A4A]/60">DESCRIPTION</h3>
                  <p className="font-mono text-[#4A4A4A] whitespace-pre-wrap">
                    {selectedImage.metadata?.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;

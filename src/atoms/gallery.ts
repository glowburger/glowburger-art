import { atom } from 'jotai';

export interface MediaFile {
  path: string;
  modifiedTime: number;
  metadata?: {
    title?: string;
    description?: string;
    collection?: string;
  };
}

export interface Collection {
  name: string;
  path: string;
  thumbnail: string;
  images: string[];
}

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheManager<T> {
  get: (key: string) => T | null;
  set: (key: string, data: T) => void;
}

const createCache = <T>(): CacheManager<T> => {
  const cache = new Map<string, CacheEntry<T>>();

  return {
    get: (key: string): T | null => {
      const entry = cache.get(key);
      if (!entry) return null;
      
      if (Date.now() - entry.timestamp > CACHE_DURATION) {
        cache.delete(key);
        return null;
      }
      
      return entry.data;
    },
    
    set: (key: string, data: T): void => {
      cache.set(key, {
        data,
        timestamp: Date.now()
      });
    }
  };
};

// Create typed cache instance for MediaFile arrays
const mediaCache = createCache<MediaFile[]>();

// Atoms
export const collectionsAtom = atom<Collection[]>([
  { 
    name: 'MACHINE GARDEN', 
    path: 'machine garden',
    thumbnail: 'machine garden/thumbnail.mp4',
    images: [] 
  },
  { 
    name: 'BOB IS DED', 
    path: 'bob is ded',
    thumbnail: 'bob is ded/thumbnail.gif',
    images: [] 
  },
  { 
    name: 'BURGERS', 
    path: 'burgers', 
    thumbnail: 'burgers/thumbnail.gif',
    images: [] 
  },
  { 
    name: 'FUN GUYS', 
    path: 'fun guys',
    thumbnail: 'fun guys/thumbnail.gif',
    images: [] 
  },
  { 
    name: 'GENESIS', 
    path: 'genesis', 
    thumbnail: 'genesis/thumbnail.png',
    images: [] 
  }
]);

export const allImagesAtom = atom<MediaFile[]>([]);

export const selectedImageAtom = atom<MediaFile | null>(null);

export const activeTabAtom = atom<string | null>(null);

// Derived atoms with caching
export const filteredImagesAtom = atom((get) => {
  const activeTab = get(activeTabAtom);
  const allImages = get(allImagesAtom);
  
  const cacheKey = `filtered-${activeTab || 'all'}`;
  const cached = mediaCache.get(cacheKey);
  if (cached) return cached;
  
  const filtered = activeTab
    ? allImages.filter(file => file.path.startsWith(`/${activeTab}/`))
    : allImages;
  
  mediaCache.set(cacheKey, filtered);
  return filtered;
});

export const organizedImagesAtom = atom((get) => {
  const activeTab = get(activeTabAtom);
  const allImages = get(allImagesAtom);
  const filteredImages = get(filteredImagesAtom);

  const collectionOrder = [
    'machine garden',
    'bob is ded',
    'burgers',
    'genesis',
    'fun guys'
  ];

  return activeTab
    ? filteredImages
    : collectionOrder.reduce((acc: MediaFile[], collectionPath) => {
        const collectionImages = allImages.filter(file => 
          file.path.startsWith(`/${collectionPath}/`)
        );
        return [...acc, ...collectionImages];
      }, []);
}); 
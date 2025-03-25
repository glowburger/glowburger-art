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
export const activeTabAtom = atom<string | null>(null);
export const selectedImageAtom = atom<MediaFile | null>(null);

// Derived atoms
export const filteredImagesAtom = atom((get) => {
  const activeTab = get(activeTabAtom);
  const allImages = get(allImagesAtom);
  
  return activeTab
    ? allImages.filter(file => file.path.startsWith(`/${activeTab}/`))
    : allImages;
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
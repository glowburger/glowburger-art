import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

interface FileMetadata {
  metadata: {
    title: string;
    description: string;
    collection: string;
  };
}

interface MetadataFile {
  version: string;
  lastUpdated: string;
  files: Record<string, FileMetadata>;
}

// Helper to read metadata file
const getMetadata = (): MetadataFile => {
  const metadataPath = join(process.cwd(), 'src/app/data/artwork_metadata.json');
  const rawData = readFileSync(metadataPath, 'utf-8');
  return JSON.parse(rawData);
};

export async function GET() {
  try {
    const { files } = getMetadata();
    
    // Transform the metadata into our expected format
    const responseData = Object.entries(files).map(([path, data]) => ({
      path: path,
      metadata: data.metadata,
      modifiedTime: Date.now()
    }));

    // Add CORS headers
    const response = NextResponse.json(responseData);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    
    return response;
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load media files' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  return response;
} 
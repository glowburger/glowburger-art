import { NextResponse } from "next/server";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const scanDirectory = (dir: string, baseDir: string): string[] => {
  return readdirSync(dir).flatMap(file => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      return scanDirectory(fullPath, baseDir);
    }
    return fullPath
      .replace(baseDir, '')
      .replace(/\\/g, '/')
      .replace(/\/+/g, '/');
  });
};

export async function GET() {
  try {
    const publicDir = join(process.cwd(), 'public');
    const metadataPath = join(process.cwd(), 'src/app/data/artwork_metadata.json');
    
    const files = scanDirectory(publicDir, publicDir)
      .filter(path => ['.mp4', '.gif', '.png', '.jpg', '.jpeg', '.webm']
        .some(ext => path.endsWith(ext)));

    const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    
    const responseData = files.map(filePath => ({
      path: filePath,
      metadata: metadata.files[filePath]?.metadata || null
    }));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load media files' },
      { status: 500 }
    );
  }
} 
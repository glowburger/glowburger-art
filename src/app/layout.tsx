import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GLOWBURGER",
  description: "Digital art by GLOWBURGER, created by glowburger and vibe coding",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="32" height="32"><style>text{font-family:monospace;font-size:20px;fill:%234A4A4A}</style><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">☁︎</text></svg>',
        type: 'image/svg+xml',
        sizes: '32x32'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} antialiased`}>
        <div className="relative z-30">
          {children}
        </div>
      </body>
    </html>
  );
}

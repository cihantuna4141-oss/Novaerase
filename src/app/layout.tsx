import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/contexts/AuthProvider";
import ToastContext from "@/contexts/ToastContexts";
import { Toaster } from "sonner";


export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "NOVAREASE — Yellow Highlight Remover –  ",
    template: "NOVAREASE — Yellow Highlight Remover - %s",
  },
  description:
    "NOVAREASE — Yellow Highlight Remover – Your One-Stop Destination for All Things Pen Related.",

  keywords: [
    "yellow highlighter remover pen",
    "remove highlighter from books",
    "yellow highlight remover for textbooks",
    "paper safe yellow highlighter remover",
    "highlighter eraser pen",
    "non-damaging yellow highlight remover",
    "student yellow highlight remover",
    "study book yellow highlighter remover",
    "NOVAREASE yellow highlight remover",
    "best yellow highlighter remover pen"
  ],

  metadataBase: new URL("https://novarease.com"),

  alternates: {
    canonical: "https://novarease.com",
    languages: {
      "en-US": "https://novarease.com",
    },
  },

  openGraph: {
    title: "NOVAREASE — Yellow Highlight Remover –  ",
    description: "We Erase, We Clean, We Restore.",
    url: "https://novarease.com",
    siteName: "NOVAREASE — Yellow Highlight Remover",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOVAREASE — Yellow Highlight Remover –  ",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#D4AF37] selection:text-white">
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}

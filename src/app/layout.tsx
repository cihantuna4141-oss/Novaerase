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
    default: "NOVAREASE — Highlight Remover –  ",
    template: "NOVAREASE — Highlight Remover - %s",
  },
  description:
    "NOVAREASE — Highlight Remover – Your One-Stop Destination for All Things Pen Related.",

  keywords: [
    "highlighter remover pen",
    "remove highlighter from books",
    "highlight remover for textbooks",
    "paper safe highlighter remover",
    "highlighter eraser pen",
    "non-damaging highlight remover",
    "student highlight remover",
    "study book highlighter remover",
    "NOVAREASE highlight remover",
    "best highlighter remover pen"
  ],

  metadataBase: new URL("https://novarease.com"),

  alternates: {
    canonical: "https://novarease.com",
    languages: {
      "en-US": "https://novarease.com",
    },
  },

  openGraph: {
    title: "NOVAREASE — Highlight Remover –  ",
    description: "We Erase, We Clean, We Restore.",
    url: "https://novarease.com",
    siteName: "NOVAREASE — Highlight Remover",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOVAREASE — Highlight Remover –  ",
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

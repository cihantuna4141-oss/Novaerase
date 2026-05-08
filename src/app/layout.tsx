import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "Pen Shop –  ",
    template: "Pen Shop - %s",
  },
  description:
    "Pen Shop – Your One-Stop Destination for All Things Pen Related.",

  keywords: [
    "Pen Shop",
    "Interior Decor",
    "Design Services",
    "Furniture Works",
    "Professional Painting",
    "Pop Designs",
    "Lighting Solutions"
  ],

  metadataBase: new URL("https://yourdomain.com"),

  openGraph: {
    title: "Pen Shop –  ",
    description:
      "We Paint, We Design, We Light",
    url: "https://yourdomain.com",
    siteName: "Pen Shop",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pen Shop –  ",
      },
    ],
    locale: "en_GH",
    type: "website",
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
        
         
            {children}
           
       
      </body>
    </html>
  );
}

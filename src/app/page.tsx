import Navbar from "@/components/Navbar";
import Product from "@/components/product/Product";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Home",
  description:
    "Pen Shop – Your One-Stop Destination for All Things Pen Related.",
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 font-sans bg-zinc-50 dark:bg-black">
     <Navbar />
     <Product />
    </div>
  );
}

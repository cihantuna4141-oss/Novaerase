import Main from "@/components/Main";
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
    <div>
     <Main />
    </div>
  );
}

import Main from "@/components/Main";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "NOVAREASE – Highlighter Remover Pen",
  description:
    "NOVAREASE is a precision highlighter remover pen designed to safely erase highlighter marks from books, textbooks, and documents without damaging paper.",
}

export default function Home() {
  return (
    <div>
     <Main />
    </div>
  );
}

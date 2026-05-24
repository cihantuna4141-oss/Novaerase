"use client";
import { Play } from "lucide-react";

const VideoSection = () => {
  return (
    <section className="bg-cream py-24 px-6 border-t border-ink/5">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3 font-bold">
          See It in Action
        </p>
        <h2 className="text-4xl font-bold text-ink mb-12">
          Watch the highlight disappear.
        </h2>

        <div className="group relative aspect-video w-full bg-cream-dark rounded-2xl overflow-hidden border border-gold/20 shadow-lg cursor-pointer">
          {/* Placeholder/Thumbnail */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-cream-dark to-cream transition-transform duration-700 group-hover:scale-105">
            <div className="w-20 h-20 bg-ink rounded-full flex items-center justify-center shadow-2xl group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
              <Play className="text-cream fill-cream ml-1" size={28} />
            </div>
            <p className="text-xs tracking-[0.1em] text-ink/40 font-medium">
              NOVAREASE — Highlight Remover Demo
            </p>
          </div>

          {/* Replace with <video> or <iframe> for production */}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

"use client";
import { useState, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

const VideoSection = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartVideo = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.muted = false; // Turn on sound
      videoRef.current.currentTime = 0; // Reset to start
      videoRef.current.play();
    }
  };

  return (
    <section className="bg-cream py-24 px-6 border-t border-ink/5">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3 font-bold">
          See It in Action
        </p>
        <h2 className="text-4xl md:text-5xl font-serif italic text-ink mb-12">
          Watch the highlight disappear.
        </h2>

        <div 
          className="group relative aspect-video w-full bg-ink rounded-2xl overflow-hidden border border-gold/20 shadow-2xl transition-all duration-700"
        >
          {/* 1. THE VIDEO ELEMENT (Always there, muted at first) */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              hasStarted ? "opacity-100" : "opacity-40"
            }`}
            autoPlay
            muted
            loop
            playsInline
            // Show native controls only after starting
            controls={hasStarted}
          >
            <source src="/pen_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* 2. THE INTERACTIVE OVERLAY (Visible only before clicking) */}
          {!hasStarted && (
            <div 
              onClick={handleStartVideo}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 cursor-pointer"
            >
              {/* Center Play UI */}
              <div className="relative">
                {/* Soft glow behind button */}
                <div className="absolute inset-0 bg-gold/30 rounded-full blur-2xl group-hover:bg-gold/50 transition-all duration-500" />
                
                <div className="relative w-24 h-24 bg-gold/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <Play className="text-white fill-white ml-1" size={32} />
                </div>
              </div>

              {/* Text Information */}
              <div className="space-y-2 mix-blend-difference">
                <p className="text-sm tracking-[0.2em] text-white font-bold uppercase">
                  Click to Unmute & Play
                </p>
                <div className="flex items-center justify-center gap-4 text-[11px] text-white/70 uppercase tracking-widest font-bold">
                  <span>Full Demo</span>
                  <span className="w-1 h-1 bg-gold rounded-full" />
                  <span>Before & After</span>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[9px] text-white/40 uppercase tracking-[0.4em] font-black">
                <RotateCcw size={12} className="animate-spin-slow" />
                Live Preview
              </div>
            </div>
          )}

          {/* Luxury Corner Border (Decorative) */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/20 rounded-tl-xl pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/20 rounded-br-xl pointer-events-none" />
        </div>

        <p className="mt-8 text-xs text-ink/40 font-medium tracking-wide">
          *Real-time demonstration on archival 80gsm paper. Results may vary by ink type.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;
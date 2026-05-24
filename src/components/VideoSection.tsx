"use client";
import { useState, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

const VideoSection = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartVideo = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <section className="bg-cream py-24 px-4 md:px-6 border-t border-ink/5">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-3 font-bold">
          See It in Action
        </p>
        <h2 className="text-5xl md:text-6xl font-serif italic text-ink mb-12">
          Watch the highlight disappear.
        </h2>

        {/* Removed aspect-video to let the video determine the height */}
        <div className="group relative w-full bg-ink rounded-2xl overflow-hidden border border-gold/20 shadow-2xl transition-all duration-700">
          {/* 1. THE VIDEO ELEMENT */}
          <video
            ref={videoRef}
            className={`block max-w-full h-auto mx-auto transition-opacity duration-700 ${hasStarted ? "opacity-100" : "opacity-50"}`}
            autoPlay
            muted
            loop
            playsInline
            controls={hasStarted}
          >
            <source src="/pen_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* 2. THE INTERACTIVE OVERLAY */}
          {!hasStarted && (
            <div
              onClick={handleStartVideo}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 cursor-pointer bg-black/10"
            >
              {/* Center Play UI */}
              <div className="relative">
                <div className="absolute inset-0 bg-gold/30 rounded-full blur-2xl group-hover:bg-gold/50 transition-all duration-500" />
                <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gold/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                  <Play className="text-white fill-white ml-1" size={32} />
                </div>
              </div>

              {/* Text Information */}
              <div className="space-y-2 px-4">
                <p className="text-sm tracking-[0.2em] text-white font-bold uppercase drop-shadow-md">
                  Click to Unmute & Play
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] md:text-[11px] text-white/90 uppercase tracking-widest font-bold">
                  <span>Full Demo</span>
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  <span>Precision Tech</span>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[9px] text-white/60 uppercase tracking-[0.4em] font-black">
                <RotateCcw size={12} className="animate-spin-slow" />
                Live Preview
              </div>
            </div>
          )}

          {/* Luxury Corner Borders - Hidden on very small screens to keep focus on video */}
          <div className="hidden sm:block absolute top-6 left-6 w-10 h-10 border-t border-l border-white/30 rounded-tl-lg pointer-events-none" />
          <div className="hidden sm:block absolute bottom-6 right-6 w-10 h-10 border-b border-r border-white/30 rounded-br-lg pointer-events-none" />
        </div>

        <p className="mt-8 text-xs text-ink/40 font-medium tracking-wide max-w-lg mx-auto">
          *Real-time demonstration on archival 80gsm paper. Results may vary by
          ink type.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;

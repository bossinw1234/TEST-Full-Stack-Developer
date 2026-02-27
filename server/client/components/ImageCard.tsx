import React, { useState } from "react";
import type { ImageResponse } from "../types/index";

interface ImageCardProps {
  image: ImageResponse;
  onTagClick: (tagName: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onTagClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative w-full rounded-[20px] overflow-hidden group isolate bg-bg-card translate-z-0`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
      }}
    >
      {/* Loading skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-bg-card-hover z-10 overflow-hidden isolate">
          <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-bg-card to-transparent z-20 animate-shimmer" />
        </div>
      )}

      {/* Image */}
      <img
        src={image.url}
        alt={`Gallery image ${image.id} — ${image.tags.map((t) => t.name).join(", ")}`}
        width={image.width}
        height={image.height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover origin-center transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          loaded ? "opacity-100" : "opacity-0 scale-[1.05]"
        } group-hover:scale-110`}
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 z-30 transition-all duration-500 ease-in-out bg-linear-to-t from-bg-primary/95 via-bg-primary/40 to-transparent flex flex-col justify-end p-6 pointer-events-none opacity-0 ${hovered ? "opacity-100! pointer-events-auto! shadow-[inset_0_-80px_60px_-40px_rgba(42,56,47,0.4)]" : ""}`}
      >
        <div
          className={`transform transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${hovered ? "translate-y-0 opacity-100 blur-none" : "translate-y-6 opacity-0 blur-xs"}`}
        >
          <div className="text-sm font-semibold text-text-primary tracking-widest mb-3 uppercase flex items-center gap-2 drop-shadow-sm font-sans relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            {`${image.width} × ${image.height}`}
          </div>
          <div className="flex flex-wrap gap-2 isolate relative pointer-events-auto">
            {image.tags.map((tag) => (
              <button
                key={tag.id}
                className="px-3 py-1.5 rounded-full bg-bg-card/90 border border-tag-border text-text-primary text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(211,228,205,0.5)] hover:border-tag-border-active hover:bg-bg-card active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag.name);
                }}
              >
                {`#${tag.name}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div
        className={`absolute -inset-1 z-40  transition-all duration-800 pointer-events-none rounded-[inherit] mix-blend-overlay ${hovered ? "bg-accent-glow opacity-100 blur-2xl block" : "opacity-0 hidden"}`}
      />
    </div>
  );
};

export default ImageCard;

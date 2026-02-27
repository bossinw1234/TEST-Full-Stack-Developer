import React, { useState, useEffect } from "react";
import { useGalleryState } from "../hooks/useGalleryState";
import TagList from "./TagList";
import ImageGrid from "./ImageGrid";

const GalleryPage: React.FC = () => {
  const state = useGalleryState();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="pt-16 min-h-screen flex flex-col items-center bg-bg-primary">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 bg-bg-primary/95 backdrop-blur-xl border-b border-border-subtle transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-2xl tracking-tight text-text-primary drop-shadow-sm">
              MusicGallery
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-text-primary font-semibold tracking-wide">
              {state.totalImages > 0 ? `${state.totalImages} images` : ""}
            </span>
            {state.hasActiveFilters && (
              <button
                className="text-text-primary bg-text-primary/5 hover:bg-text-primary/10 px-4 py-1.5 rounded-full transition-all duration-300 font-semibold border border-transparent hover:border-text-primary/20 active:scale-95"
                onClick={() => state.toggleTag("__all__")}
              >
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative w-full max-w-[1400px] px-6 py-16 md:py-24 text-center">
        <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center gap-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-secondary/30 rounded-full blur-[60px] animate-pulse-slow" />
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight -tracking-wider animate-fade-in">
            Discover Music Gallery
          </h1>
          <p className="text-lg md:text-xl text-text-secondary opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards] flex flex-col md:flex-row items-center gap-2">
            Browse curated images by genre — click a tag to filter
            {state.hasActiveFilters && (
              <span className="inline-block mt-2 md:mt-0 text-xs font-semibold px-2 py-1 rounded bg-accent-primary/10 text-accent-primary uppercase tracking-wider">
                {state.activeFilterCount} filter
                {state.activeFilterCount > 1 ? "s" : ""} active
              </span>
            )}
          </p>
        </div>
      </header>

      {/* Sticky Tag Filter */}
      <section className="w-full relative z-40 py-4" id="filter-section">
        <TagList
          tags={state.tags}
          activeTags={state.activeTags}
          onTagClick={(tagName) => state.toggleTag(tagName)}
          loading={state.initialLoading}
        />
      </section>

      {/* Gallery Grid */}
      <main
        className="flex-1 w-full max-w-[1400px] px-6 pb-24 min-h-[50vh]"
        id="gallery-main"
      >
        {state.initialLoading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-4 opacity-0 animate-fade-in">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-primary animate-[float_1.2s_ease-in-out_infinite]" />
              <div className="w-3 h-3 rounded-full bg-accent-primary animate-[float_1.2s_ease-in-out_0.2s_infinite]" />
              <div className="w-3 h-3 rounded-full bg-accent-primary animate-[float_1.2s_ease-in-out_0.4s_infinite]" />
            </div>
            <p className="text-text-muted text-sm font-medium tracking-wide">
              Loading gallery...
            </p>
          </div>
        ) : (
          <ImageGrid
            images={state.images}
            loading={state.loading}
            hasMore={state.hasMore}
            onLoadMore={() => state.loadMore()}
            onTagClick={(tagName) => state.toggleTag(tagName)}
          />
        )}
      </main>
    </div>
  );
};

export default GalleryPage;

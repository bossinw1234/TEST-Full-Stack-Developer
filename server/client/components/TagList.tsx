import React from 'react';
import type { TagResponse } from '../types/index';

interface TagListProps {
  tags: TagResponse[];
  activeTags: string[];
  onTagClick: (tagName: string) => void;
  loading?: boolean;
}

const TagList: React.FC<TagListProps> = ({ tags, activeTags, onTagClick, loading = false }) => {
  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-[1400px] mx-auto opacity-50 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-20 h-9 rounded-full bg-accent-glow animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full relative px-6">
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-[1400px] mx-auto py-2 px-4">
        <button
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 border ${
            activeTags.length === 0
              ? 'bg-tag-bg-active border-tag-border-active shadow-[0_2px_12px_var(--color-accent-glow)] text-text-primary'
              : 'bg-tag-bg/50 border-tag-border/50 text-text-secondary hover:bg-tag-bg-active hover:border-tag-border-active hover:text-text-primary hover:-translate-y-0.5'
          }`}
          onClick={() => onTagClick('__all__')}
        >
          <span className="text-accent-primary opacity-80 text-xs">✦</span>
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 border ${
              activeTags.includes(tag.name)
                ? 'bg-tag-bg-active border-tag-border-active shadow-[0_2px_12px_var(--color-accent-glow)] text-text-primary -translate-y-0.5'
                : 'bg-bg-card border-tag-border/50 text-text-secondary hover:bg-tag-bg-active hover:border-tag-border-active hover:text-text-primary hover:-translate-y-0.5'
            }`}
            onClick={() => onTagClick(tag.name)}
          >
            <span className="text-accent-primary opacity-60 text-xs font-mono">#</span>
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagList;

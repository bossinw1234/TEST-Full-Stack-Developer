import { useState, useEffect, useCallback } from 'react';
import type { ImageResponse, TagResponse } from '../types/index';
import { imageApiService } from '../services/ImageApiService';
import { tagApiService } from '../services/TagApiService';

export function useGalleryState() {
  const [images, setImages] = useState<ImageResponse[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [totalImages, setTotalImages] = useState<number>(0);

  const fetchTags = useCallback(async () => {
    try {
      const result = await tagApiService.getTags();
      setTags(result.data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  }, []);

  const fetchImages = useCallback(async (pageNum: number, reset: boolean = false, currentActiveTags: string[]) => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await imageApiService.getImages({
        page: pageNum,
        limit: 8,
        tags: currentActiveTags.length > 0 ? currentActiveTags : undefined,
      });

      const newImages = result.data;

      setImages((prev) => (reset ? newImages : [...prev, ...newImages]));
      setHasMore(result.pagination.hasMore);
      setTotalImages(result.pagination.total);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to fetch images:', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [loading]);

  const toggleTag = useCallback((tagName: string) => {
    let newActiveTags: string[];
    if (tagName === '__all__') {
      newActiveTags = [];
    } else if (activeTags.includes(tagName)) {
      newActiveTags = activeTags.filter((t) => t !== tagName);
    } else {
      newActiveTags = [...activeTags, tagName];
    }

    setActiveTags(newActiveTags);
    setImages([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);

    fetchImages(1, true, newActiveTags);
  }, [activeTags, fetchImages]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchImages(page + 1, false, activeTags);
    }
  }, [loading, hasMore, fetchImages, page, activeTags]);

  const reset = useCallback(() => {
    setImages([]);
    setTags([]);
    setActiveTags([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    setInitialLoading(true);
    setTotalImages(0);
  }, []);


  useEffect(() => {
    fetchTags();
    fetchImages(1, true, []);
  }, []);

  return {
    images,
    tags,
    activeTags,
    page,
    hasMore,
    loading,
    initialLoading,
    totalImages,
    activeFilterCount: activeTags.length,
    hasActiveFilters: activeTags.length > 0,
    toggleTag,
    loadMore,
    reset,
  };
}

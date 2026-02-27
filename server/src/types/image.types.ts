import type { TagEntity, TagResponse } from './tag.types';

export interface ImageEntity {
  id: number;
  url: string;
  width: number;
  height: number;
  createdAt: Date;
}

export interface ImageTagEntity {
  imageId: number;
  tagId: number;
}

export interface ImageWithTags extends ImageEntity {
  tags: TagEntity[];
}

export interface ImageResponse {
  id: number;
  url: string;
  width: number;
  height: number;
  createdAt: string;
  tags: TagResponse[];
}

export interface PaginatedImagesResponse {
  data: ImageResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

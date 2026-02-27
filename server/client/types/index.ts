export interface TagResponse {
  id: number;
  name: string;
}

export interface ImageResponse {
  id: number;
  url: string;
  width: number;
  height: number;
  createdAt: string;
  tags: TagResponse[];
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedImagesResponse {
  data: ImageResponse[];
  pagination: PaginationData;
}

export interface TagListResponse {
  data: TagResponse[];
  total: number;
}

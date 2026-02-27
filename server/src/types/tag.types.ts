export interface TagEntity {
  id: number;
  name: string;
}

export interface TagResponse {
  id: number;
  name: string;
}

export interface TagListResponse {
  data: TagResponse[];
  total: number;
}

import type { TagListResponse } from '../types/index';

class TagApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getTags(): Promise<TagListResponse> {
    const response = await fetch(`${this.baseUrl}/tags`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    return response.json();
  }
}

export const tagApiService = new TagApiService();
export default TagApiService;

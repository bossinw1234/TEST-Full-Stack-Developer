import { PrismaClient } from '@prisma/client';
import type { TagListResponse } from '../types/tag.types';

export class TagService {
  private db: PrismaClient;

  constructor(dbClient?: PrismaClient) {
    this.db = dbClient || new PrismaClient();
  }

  async getAllTags(): Promise<TagListResponse> {
    const tags = await this.db.tag.findMany({ orderBy: { name: 'asc' } });
    return {
      data: tags.map((t) => ({ id: t.id, name: t.name })),
      total: tags.length,
    };
  }
}

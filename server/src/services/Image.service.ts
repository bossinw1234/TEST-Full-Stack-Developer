import { PrismaClient } from '@prisma/client';
import type { PaginatedImagesResponse, ImageResponse, ImageWithTags } from '../types/image.types';

export class ImageService {
  private db: PrismaClient;

  constructor(dbClient?: PrismaClient) {
    this.db = dbClient || new PrismaClient();
  }

  async getImages(params: {
    page?: number;
    limit?: number;
    tags?: string[];
  }): Promise<PaginatedImagesResponse> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));
    const tags = params.tags?.filter((t) => t.trim().length > 0);
    const skip = (page - 1) * limit;

    const where = tags && tags.length > 0
      ? { tags: { some: { tag: { name: { in: tags } } } } }
      : {};

    const [total, rawImages] = await Promise.all([
      this.db.image.count({ where }),
      this.db.image.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { tags: { include: { tag: true } } },
      }),
    ]);

    const images: ImageWithTags[] = rawImages.map((img) => ({
      id: img.id,
      url: img.url,
      width: img.width,
      height: img.height,
      createdAt: img.createdAt,
      tags: img.tags.map((it) => ({ id: it.tag.id, name: it.tag.name })),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data: images.map(this.toDto),
      pagination: { page, limit, total, totalPages, hasMore: page < totalPages },
    };
  }

  async getImageById(id: number): Promise<ImageResponse | null> {
    const img = await this.db.image.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });

    if (!img) return null;

    return this.toDto({
      id: img.id,
      url: img.url,
      width: img.width,
      height: img.height,
      createdAt: img.createdAt,
      tags: img.tags.map((it) => ({ id: it.tag.id, name: it.tag.name })),
    });
  }

  private toDto(image: ImageWithTags): ImageResponse {
    return {
      id: image.id,
      url: image.url,
      width: image.width,
      height: image.height,
      createdAt: image.createdAt.toISOString(),
      tags: image.tags.map((t) => ({ id: t.id, name: t.name })),
    };
  }
}

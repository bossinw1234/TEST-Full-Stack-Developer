import { Request, Response } from 'express';
import { ImageService } from '../services/Image.service.js';

export class ImageController {
  private service: ImageService;

  constructor(service?: ImageService) {

    this.service = service || new ImageService();
  }

  public async getImages(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(String(req.query.page || '1'), 10) || 1;
      const limit = parseInt(String(req.query.limit || '12'), 10) || 12;
      const tagsParam = req.query.tags ? String(req.query.tags) : undefined;
      const tags = tagsParam
        ? tagsParam.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined;

      const result = await this.service.getImages({ page, limit, tags });
      res.json(result);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch images',
      });
    }
  }

  public async getImageById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(String(req.params.id), 10);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid image ID' });
        return;
      }

      const image = await this.service.getImageById(id);
      if (!image) {
        res.status(404).json({ error: 'Image not found' });
        return;
      }

      res.json({ data: image });
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch image',
      });
    }
  }


}

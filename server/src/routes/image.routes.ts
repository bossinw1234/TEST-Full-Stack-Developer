import { Router } from 'express';
import { ImageController } from '../controllers/Image.controller';

export function createImageRoutes(controller: ImageController): Router {
  const router = Router();

  router.get('/images', controller.getImages.bind(controller));
  router.get('/images/:id', controller.getImageById.bind(controller));

  return router;
}

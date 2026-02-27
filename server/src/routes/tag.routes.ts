import { Router } from 'express';
import { TagController } from '../controllers/tag.controller';

export function createTagRoutes(controller: TagController): Router {
  const router = Router();

  router.get('/tags', controller.getTags.bind(controller));

  return router;
}

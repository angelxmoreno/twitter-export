import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response } from 'express';

@Middleware({ type: 'after' })
export class NotFoundMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response): void {
    if (!res.headersSent) {
      res.status(404).json({ code: 404, error: 'Path not found', method: req.method, path: req.path });
    }
    res.end();
  }
}

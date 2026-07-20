import morgan from 'morgan';
import { Request, Response } from 'express';

const morganFormat =
  ':method :url :status :res[content-length] - :response-time ms';

const logger = morgan(morganFormat, {
  skip: (_req: Request, res: Response) => {
    return res.statusCode < 400;
  },
});

const devLogger = morgan('dev');

export { logger, devLogger };

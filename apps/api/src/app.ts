import cors from 'cors';
import express from 'express';
import { employeesRouter } from './features/employees/employees.routes.js';
import { errorHandler, notFoundHandler } from './shared/http/error-handler.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.set('etag', false);

  app.use('/employees', employeesRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
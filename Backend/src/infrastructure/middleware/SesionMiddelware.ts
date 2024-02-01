// sesionMiddleware.ts
import express from 'express';

const sesionMiddleware: express.RequestHandler = (req, res, next) => {
  // Puedes realizar alguna tarea común aquí si es necesario
  next();
};

export default sesionMiddleware;

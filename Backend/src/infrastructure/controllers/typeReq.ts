
import { Request } from 'express';
import { Sesion } from '../../domain/entities/Sesion';

interface CustomRequest extends Request {
  sesion?: Sesion;
}

export default CustomRequest;

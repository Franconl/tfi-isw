import express from 'express';
import { iniciarSesion} from '../controllers/AuthController';

const router = express.Router();

// Rutas de autenticación
router.post('/login', iniciarSesion);

export default router;

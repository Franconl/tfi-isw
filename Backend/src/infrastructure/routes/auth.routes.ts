import express from "express";
import { AuthService } from "../../aplication/AuthService";
import { AuthController } from "../controllers/AuthController";
import { UsuarioMongo } from "../../repositroy/usuario.mongo";
import { ArticuloMongo } from "../../repositroy/articulo.mongo";

const router = express.Router();



router.post('/', async (req, res) => {
  const userRepo = new UsuarioMongo();
  const artRepo = new ArticuloMongo();
  const authService = new AuthService(userRepo,artRepo);
  const authController = new AuthController(authService);
  try {
    const sesion = await authController.iniciarSesion(req, res);
    res.status(200).send(sesion);
  } catch (error) {
    console.error('Error en la ruta de inicio de sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

router.post('/cerrarSesion', async (req, res) => {
  const userRepo = new UsuarioMongo();
  const artRepo = new ArticuloMongo();
  const authService = new AuthService(userRepo,artRepo);
  const authController = new AuthController(authService);
  try {
    const sesion = await authController.cerrarSesion(req, res);
    res.status(200).send(sesion);
  } catch (error) {
    console.error('Error en la ruta de inicio de sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});




export default router;

  

  


  
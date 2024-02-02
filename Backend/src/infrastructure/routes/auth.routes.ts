import express from "express";
import { UsuarioMock } from "../../mock/UsuarioMock";
import { AuthService } from "../../aplication/AuthService";
import { SucursalMock } from "../../mock/SucursalMock";
import { AuthController } from "../controllers/AuthController";
import { Sesion } from "../../domain/entities/Sesion";

const router = express.Router();

const userRepo = new UsuarioMock();
const sucursalRepo = new SucursalMock();

const authService = new AuthService(userRepo,sucursalRepo);

const authController = new AuthController(authService);

var sesion: Sesion;

router.post('/', async (req, res) => {
  try {
    let ses = await authController.iniciarSesion(req, res);
    if(ses){
      sesion = ses;
    }
    res.status(200).send(sesion);
  } catch (error) {
    console.error('Error en la ruta de inicio de sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

export { sesion }


export default router;

  

  


  
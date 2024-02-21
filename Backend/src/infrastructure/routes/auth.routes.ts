import express from "express";
import { AuthService } from "../../aplication/AuthService";
import { AuthController } from "../controllers/AuthController";
import { Sesion } from "../../domain/entities/Sesion";
import { ConexionAfipService } from "../../aplication/ConexionAfipService";
import { AfipServiceController } from "../controllers/AfipServiceController";
import { UsuarioMongo } from "../../repositroy/usuario.mongo";
import { ArticuloMongo } from "../../repositroy/articulo.mongo";

const router = express.Router();

const userRepo = new UsuarioMongo();
const artRepo = new ArticuloMongo();

const authService = new AuthService(userRepo,artRepo);

const authController = new AuthController(authService);

var sesion: Sesion;
var afipServiceController : AfipServiceController;

router.post('/', async (req, res) => {
  try {
    let ses = await authController.iniciarSesion(req, res);
    if(ses){
      sesion = ses;
      const afipService = new ConexionAfipService(ses);
      afipServiceController = new AfipServiceController(afipService);

      await afipServiceController.solicitarToken();
      await afipServiceController.solicitarUltimoComprobante();
    }

    res.status(200).send(sesion);
  } catch (error) {
    console.error('Error en la ruta de inicio de sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

export { sesion , afipServiceController	}


export default router;

  

  


  
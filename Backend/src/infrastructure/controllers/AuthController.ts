// authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../../aplication/AuthService';
import { Sesion } from '../../domain/entities/Sesion';
import { Usuario } from '../../domain/entities/Usuario';
import { Sucursal } from '../../domain/entities/Sucursal';
import { PuntoDeVenta } from '../../domain/entities/PuntoDeVenta';
import { CondicionTributaria } from '../../domain/entities/CondicionTributaria';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async iniciarSesion(req: Request, res: Response): Promise<Sesion | null> {
    try {
        const { user, pass, puntoDeVenta } = req.body;

        // Verificar si los datos necesarios están presentes en el cuerpo de la solicitud
        if (!user || !pass  || !puntoDeVenta) {
            res.status(400).json({ mensaje: 'Faltan datos en el cuerpo de la solicitud' });
            return null;
        }
            const sesion = this.authService.crearSesion(user,pass, puntoDeVenta);
            
            if(sesion){
              return sesion;
            }else {
            // Devolver un error si los datos son inválidos o el punto de venta no está disponible
            res.status(401).json({ mensaje: 'Credenciales o sucursal inválidas o punto de venta no disponible' });
            return null;
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
        return null;
    }
}

  public async cerrarSesion(req: Request, res: Response){
    try{
      const sesionId = req.body.sesion as string;
      const response = this.authService.cerrarSesion(sesionId);
      return response;
    }catch (error) {
        console.error('Error al cerrar iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
        return null;
    }
  }


  public  obtenerCondicionTienda() : CondicionTributaria{

    const response = this.authService.obtenerCondicionTienda();
    return response;
  }
  
}

// authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../../aplication/AuthService';
import { Sesion } from '../../domain/entities/Sesion';
import { Usuario } from '../../domain/entities/Usuario';
import { Sucursal } from '../../domain/entities/Sucursal';
import { PuntoDeVenta } from '../../domain/entities/PuntoDeVenta';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async iniciarSesion(req: Request, res: Response): Promise<Sesion | null> {
    try {
        const { user, pass, sucursal, puntoDeVenta } = req.body;

        // Verificar si los datos necesarios están presentes en el cuerpo de la solicitud
        if (!user || !pass || !sucursal || !puntoDeVenta) {
            res.status(400).json({ mensaje: 'Faltan datos en el cuerpo de la solicitud' });
            return null;
        }

        // Obtener la información del usuario, sucursal y punto de venta
        const usuario = await this.authService.authUser(user, pass);
        const infoSucursal = await this.authService.getSucursal(sucursal);
        const infoPuntoDeVenta = await this.authService.getPuntoDeVenta(puntoDeVenta);

        // Verificar si se encontraron los datos necesarios y el punto de venta está disponible
        if (usuario && infoSucursal && infoPuntoDeVenta && infoPuntoDeVenta.getEstado() === "disponible") {
            // Crear y retornar la sesión
            const sesion = this.crearSesion(usuario, infoSucursal, infoPuntoDeVenta);
            infoPuntoDeVenta.setEstado("ocupado");
            return sesion;
        } else {
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


  // Método para crear la sesión (ajusta según tu implementación real)
  private crearSesion(usuario: Usuario, sucursal: Sucursal, puntoDeVenta : PuntoDeVenta) {

    return Sesion.obtenerInstancia(usuario, puntoDeVenta ,sucursal);

  }
}

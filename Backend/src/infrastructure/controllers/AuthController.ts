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

  public async iniciarSesion(req: Request, res: Response) : Promise<Sesion | null> {
    try {
      const userParam = req.query.user as string;
      const passwordParam = req.query.pass as string;
      const sucursalParam = req.query.sucursal as string;
      const puntoDeVentaParam =parseInt(req.query.puntoDeVenta as string);

      const user = await this.authService.authUser(userParam, passwordParam);
      const sucursal = await this.authService.getSucursal(sucursalParam);
      const puntoDeVenta = await this.authService.getPuntoDeVenta(puntoDeVentaParam);

      if (user && sucursal && puntoDeVenta && puntoDeVenta.getEstado() == "disponible") {

        const sesion = this.crearSesion(user, sucursal, puntoDeVenta);
        puntoDeVenta.setEstado("ocupado");
        return sesion;
      } else {

        res.status(401).json({ mensaje: 'Credenciales o sucursal inválidas' });
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

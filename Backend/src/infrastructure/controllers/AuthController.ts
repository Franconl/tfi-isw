// authController.ts
import { Sesion } from '../../domain/entities/Sesion';
import { Usuario } from '../../domain/entities/Usuario';
import { PuntoDeVenta } from '../../domain/entities/PuntoDeVenta';
import { Sucursal } from '../../domain/entities/Sucursal';
import { AuthService } from '../../aplication/AuthService';
import { Response } from 'express';
import CustomRequest from './typeReq'; // Asegúrate de importar el nuevo tipo
import { UsuarioMock } from '../../mock/UsuarioMock';
import { SucursalMock } from '../../mock/SucursalMock';

export const iniciarSesion = async (req: CustomRequest, res: Response) => {

    const usuarioDB = new UsuarioMock();
    const sucursalDB = new SucursalMock();

    const auth = new AuthService(usuarioDB, sucursalDB);
    const sucursal = await auth.getSucursal(req.body.sucursalId);

    if (await auth.authUser(req.body.user, req.body.password) && sucursal) {
        const usuario = new Usuario(req.body.user, req.body.password);
        const puntoDeVenta = new PuntoDeVenta(req.body.puntoDeVentaId, sucursal);
        const sesion: Sesion = Sesion.obtenerInstancia(usuario, puntoDeVenta, sucursal);

        req.sesion = sesion;
        res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });
    } else {
        res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }
};

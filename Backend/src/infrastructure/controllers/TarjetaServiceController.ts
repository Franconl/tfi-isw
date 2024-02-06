import { ConexionTarjetaService } from "../../aplication/ConexionSistTarjetaService";
import { TarjetaData } from "../../domain/entities/TarjetaData";
import { Request, Response } from "express";

export class TarjetaServiceController{
    private tarjetaService : ConexionTarjetaService;

    constructor(tarjetaService : ConexionTarjetaService){
        this.tarjetaService = tarjetaService;
    }

    public async solicitarToken(req: Request, res: Response) {
        try {
         
            const tarjeta: TarjetaData = req.body as TarjetaData;
            const response = await this.tarjetaService.solicitarToken(tarjeta);
            res.status(200).json({ token: response, mensaje: 'Token solicitado exitosamente'});
        } catch (error) {
          // Manejar los errores y enviar una respuesta de error al cliente
          console.error('Error al solicitar el token:', error);
          res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
      }

}
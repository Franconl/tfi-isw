import { ConexionTarjetaService } from "../../aplication/ConexionSistTarjetaService";
import { TarjetaData } from "../../domain/entities/TarjetaData";
import { Request, Response } from "express";

export class TarjetaServiceController{
    private tarjetaService : ConexionTarjetaService;
    private token! : string;

    constructor(tarjetaService : ConexionTarjetaService){
        this.tarjetaService = tarjetaService;
    }

    public async confirmarPago(req : Request, res: Response){
      try{
        console.log( 'monto ')
        const monto = parseInt(req.query.monto as string);
        console.log(monto, ' <----monto ')
        const response = await this.tarjetaService.confirmarPago(this.token,monto);
        res.status(200).json({ token: response, mensaje: 'Pago Confirmado'});
      } catch (error) {

        console.error('Error al Confirmar Pago:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
      }
    }


    public async solicitarToken(req: Request, res: Response) {
        try {
         
            const tarjeta: TarjetaData = req.body as TarjetaData;
            const response = await this.tarjetaService.solicitarToken(tarjeta);
            this.token = response;
            console.log(response,'token')
            res.status(200).json({ token: response, mensaje: 'Token solicitado exitosamente'});
        } catch (error) {
          
          console.error('Error al solicitar el token:', error);
          res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
      }

}
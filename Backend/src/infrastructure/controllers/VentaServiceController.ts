import { VentaService } from "../../aplication/VentaService";
import { Request, Response } from "express";
import { Venta } from "../../domain/entities/Venta";
import { LineaDeVenta } from "../../domain/entities/LineaDeVenta";
import { Cliente } from "../../domain/entities/Cliente";
import { TarjetaData } from "../../domain/entities/TarjetaData";

export class VentaServiceController{
    private ventaService : VentaService;

    constructor(ventaService : VentaService){
        this.ventaService = ventaService;
    }

    public async nuevaVenta(req: Request, res: Response) : Promise<Venta | null >{
        
        try{
            const dni: number = parseInt(req.query.dni as string, 10); 
            const sesionId : string = req.body.sesionId as string;

            const nuevaVenta = await this.ventaService.crearNuevaVenta(dni, sesionId);
            if(nuevaVenta){
                return nuevaVenta;
            }else {
                res.status(400).json({ mensaje: 'error al crear una nueva venta' });
                return null;
            }
        }catch(error){
            console.error('Error en nuevaVenta:', error);
            res.status(400).json({ mensaje: 'Error al acceder al servicio de Venta' });
            return null;
        }
    }



    public async seleccionarInventario(req: Request, res: Response) : Promise<LineaDeVenta[] | null>{
        try {

            const inventarioId = req.query.id as string;
            const sesionId = req.body.sesion as string;
            const ventaId = req.body.venta as string;

            const cantidad: number = parseInt(req.query.cantidad as string);

            const ldv = await this.ventaService.seleccionarInventario(inventarioId, cantidad, ventaId);
            if(!ldv){
                res.status(404).json({ mensaje: 'Error al seleccionar inventario' })
            }
            return ldv;
        } catch (error) {
            // Manejar el error y responder con un mensaje de error
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }
      
    public async finalizarVenta(req: Request , res : Response){
        try{
            const sesionId = req.body.sesion as string;
            const ventaId = req.body.venta as string;
            const response = await this.ventaService.finalizarVenta(ventaId);
            return response;
        }catch(error) {
            // Manejar el error y responder con un mensaje de error
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async setCliente(req: Request , res : Response){
        
        try{
            const sesionId = req.body.sesion as string;
            const ventaId = req.body.venta as string;
            const dni = parseInt(req.query.dni as string);
            const response = await this.ventaService.setCliente(sesionId, ventaId, dni)
            if(!response){
                res.status(404).json({ mensaje: 'Error al buscar Cliente' });
            }
            return response
        }catch (error) {
            // Manejar el error y responder con un mensaje de error
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async crearCliente(req: Request , res : Response){
        const cliente : Cliente = req.body as Cliente;
        try{
            const response = await this.ventaService.crearCliente(cliente)
            if(!response){
                res.status(404).json({ mensaje: 'Error al crear Cliente' });
            }
            return response
        }catch (error) {
            // Manejar el error y responder con un mensaje de error
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async setPago(req: Request , res : Response){
        try{
            const tipo = req.body.tipo as string;
            const sesionId = req.body.sesion as string;
            const ventaId = req.body.venta as string;
            const response = await this.ventaService.setPago(ventaId,tipo);
            if(!response){
                res.status(404).json({ mensaje: 'Error al asignar tipo de pago' });
            }
            return response
        }catch (error) {
            // Manejar el error y responder con un mensaje de error
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async confirmarPagoTarjeta(req : Request, res: Response){
        try{
          const ventaId = req.body.venta as string;
          const sesionId = req.body.sesion as string;
          const response = await this.ventaService.confirmarPagoTarjeta(sesionId, ventaId);
          res.status(200).json(response);
        } catch (error) {
  
          console.error('Error al Confirmar Pago:', error);
          res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
      }
  
  
      public async solicitarToken(req: Request, res: Response) {
          try {
              const ventaId = req.body.venta as string
              const sesionId = req.body.sesion as string
              const tarjeta: TarjetaData = req.body.tarjeta as TarjetaData;
              const response = await this.ventaService.solicitarTokenTarjeta(tarjeta,sesionId);
  
              res.status(200).json(response);
          } catch (error) {
            
            console.error('Error al solicitar el token:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
          }
        }

        public async finalizarSeleccion(req: Request, res: Response){
            try {
                const ventaId = req.body.venta as string
                const sesionId = req.body.sesion as string
                const response = await this.ventaService.finalizarSeleccion(ventaId,sesionId);
    
                res.status(200).json(response);
            } catch (error) {
              
              console.error('Error al solicitar el token:', error);
              res.status(500).json({ mensaje: 'Error interno del servidor' });
            }
        }
}
import { VentaService } from "../../aplication/VentaService";
import { Request, Response } from "express";
import { Inventario } from "../../domain/entities/Inventario";
import { Venta } from "../../domain/entities/Venta";
import { LineaDeVenta } from "../../domain/entities/LineaDeVenta";
import { responseEncoding } from "axios";
import { Cliente } from "../../domain/entities/Cliente";

export class VentaServiceController{
    private ventaService : VentaService;

    constructor(ventaService : VentaService){
        this.ventaService = ventaService;
    }

    public async nuevaVenta(req: Request, res: Response) : Promise<Venta | null >{
        const dni: number = parseInt(req.query.dni as string, 10);
        try{ 
            const nuevaVenta = await this.ventaService.crearNuevaVenta(dni);
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
            const cantidad: number = parseInt(req.query.cantidad as string);

            const ldv = await this.ventaService.seleccionarInventario(inventarioId, cantidad);
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
            const response = await this.ventaService.finalizarVenta();
            return response;
        }catch(error) {
            // Manejar el error y responder con un mensaje de error
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async setCliente(req: Request , res : Response){
        const dni = parseInt(req.query.dni as string);
        try{
            const response = await this.ventaService.setCliente(dni)
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

    public setPago(req: Request , res : Response){
        const tipo = req.body.tipo as string;
        try{
            const response = this.ventaService.setPago(tipo);
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
}
import { VentaService } from "../../aplication/VentaService";
import { Request, Response } from "express";
import { Inventario } from "../../domain/entities/Inventario";
import { Venta } from "../../domain/entities/Venta";

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

    public async buscarArticulo(req: Request, res: Response) : Promise<Inventario[] | null>{
        const codigo = req.query.codigo as string;
        try{
            const inventario = await this.ventaService.buscarArticulo(codigo);
            if(inventario){
                return inventario;
            }else{
                res.status(400).json({ mensaje: 'error al obtener inventario' });
                return null;  
            }
        }catch(error){
            console.error('Error en nuevaVenta:', error);
            res.status(400).json({ mensaje: 'Error al acceder al servicio de Venta' });
            return null;
        }
       
        
    }

    public seleccionarArticulo(req: Request, res: Response) {
        try {
            const inventarioId = req.query.inventario as string;
            const cantidad: number = parseInt(req.query.cantidad as string);

            this.ventaService.seleccionarArticulo(inventarioId, cantidad);
    
            // Responder con éxito
            res.status(200).json({ mensaje: 'Artículo seleccionado exitosamente' });
        } catch (error) {
            // Manejar el error y responder con un mensaje de error
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
      
}
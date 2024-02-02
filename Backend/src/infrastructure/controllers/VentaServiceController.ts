import { VentaService } from "../../aplication/VentaService";
import { Request, Response } from "express";
import { Inventario } from "../../domain/entities/Inventario";

export class VentaServiceController{
    private ventaService : VentaService;

    constructor(ventaService : VentaService){
        this.ventaService = ventaService;
    }

    public async nuevaVenta(req: Request, res: Response){
        const dni: number = parseInt(req.query.dni as string, 10);
        const nuevaVenta = await this.ventaService.crearNuevaVenta(dni);
    }

    public async buscarArticulo(req: Request, res: Response){
        const codigo = req.query.codigo as string;
        const inventario = await this.ventaService.buscarArticulo(codigo);
    }

    public async seleccionarArticulo(req: Request, res: Response){
        const inventario : Inventario= JSON.parse(req.query.inventario as string); 
        const cantidad : number = parseInt(req.query.cantidad as string);
        this.ventaService.seleccionarArticulo(inventario, cantidad);
    }

}
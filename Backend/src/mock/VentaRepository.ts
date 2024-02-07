import { Venta } from "../domain/entities/Venta";
import { IVentaRepository } from "../domain/repositories/IVentaRepository";

export class VentaRepository implements IVentaRepository{
    insertVenta(criterios: { venta: Venta; }): void {
        
    }
}
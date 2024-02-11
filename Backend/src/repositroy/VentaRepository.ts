import { Venta } from "../domain/entities/Venta";
import { IVentaRepository } from "../domain/interfaces/IVentaRepository";

export class VentaRepository implements IVentaRepository{
    insertVenta(criterios: { venta: Venta; }): void {
        
    }
}
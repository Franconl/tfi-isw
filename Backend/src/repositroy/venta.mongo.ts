import { Venta } from "../domain/entities/Venta";
import { IVentaRepository } from "../domain/interfaces/IVentaRepository";
import PagoModel from "../infrastructure/models/pago.schema";
import VentaModel from "../infrastructure/models/venta.shcema";

export class VentaMongo implements IVentaRepository{
    insertVenta(criterios: { venta: Venta; }): void {
        const venta = criterios.venta;
        try{
            const pago = new PagoModel(venta.getPago());
            const ventaMongo = new VentaModel(venta);
            pago.save()
            ventaMongo.save()
        }catch(error){
            console.error('error al guardar venta')
        }
    }
}
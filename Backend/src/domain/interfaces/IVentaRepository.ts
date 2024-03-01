import { Comprobante } from "../entities/Comprobante";
import { CondicionTributaria } from "../entities/CondicionTributaria";
import { Pago } from "../entities/Pago";
import { Venta } from "../entities/Venta";

export interface IVentaRepository{
    insertVenta(criterios:{ venta : Venta }) : Promise<any>;
    insertPago(pago : Pago) : Promise<any>;
    insertComprobante(comprobante: Comprobante) : Promise<any>;
    obtenerTipoComprobante(emitido : CondicionTributaria, recibido : CondicionTributaria) : Promise <any>;
}
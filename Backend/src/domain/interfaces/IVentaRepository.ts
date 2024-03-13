import { Cliente } from "../entities/Cliente";
import { Comprobante } from "../entities/Comprobante";
import { CondicionTributaria } from "../entities/CondicionTributaria";
import { LineaDeVenta } from "../entities/LineaDeVenta";
import { Pago } from "../entities/Pago";
import { TipoDeComprobante } from "../entities/TipoDeComprobante";
import { Venta } from "../entities/Venta";

export interface IVentaRepository{
    insertVenta(ventaId : string): Promise<any>;
    insertPago(ventaId : string, tipo : string) : Promise<any>;
    insertComprobante(comprobante: Comprobante,  ventaId : string) : Promise<any>;
    obtenerTipoComprobante(emitido : CondicionTributaria, recibido : CondicionTributaria) : Promise <any>;
    insertNuevaVenta(criterios: { venta: Venta }): Promise<any>;
    obtenerVenta(id : string) : Promise<Venta | null>
    insertLineaDeVenta(lineadeVenta : LineaDeVenta,ventaId : string) : Promise<any>;
    setCliente(ventaId : string,cliente : Cliente, tipoComprobante : TipoDeComprobante) : Promise<any>
}
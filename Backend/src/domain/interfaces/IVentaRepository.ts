import { Venta } from "../entities/Venta";

export interface IVentaRepository{
    insertVenta(criterios:{ venta : Venta }) : Promise<any>;
}
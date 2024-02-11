import { PuntoDeVenta } from "../entities/PuntoDeVenta";
import { Sucursal } from "../entities/Sucursal";

export interface ISucursalRepository{
    getSucursal(criterios : {id : string } ) : Promise <Sucursal | null>;
    getPuntoDeVenta(criterios : {numero : number } ) : Promise <PuntoDeVenta | null>;
}
import { Sucursal } from "../entities/Sucursal";

export interface ISucursalRepository{
    getSucursal(criterios : {id : string } ) : Promise <Sucursal | null>;
}
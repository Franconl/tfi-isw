import { Articulo } from "../entities/Articulo";
import { Inventario } from "../entities/Inventario";
import { Sucursal } from "../entities/Sucursal";

export interface IArticuloRepository {
    buscarArticulo(criterios: { codigo?: string , sucursalId : string}): Promise<Articulo | null>;
    buscarInventario(criterios : { articulo : Articulo }) : Promise <Inventario[] | null>;
    busarInventarioId(criterios : { id : string}) : Promise <Inventario | null >;
}
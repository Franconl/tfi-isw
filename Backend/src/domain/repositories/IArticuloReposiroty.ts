import { Articulo } from "../entities/Articulo";
import { Inventario } from "../entities/Inventario";

export interface IArticuloRepository {
    buscarArticulo(criterios: { codigo?: string }): Promise<Articulo | null>;
    buscarInventario(criterios : { articulo : Articulo }) : Promise <Inventario[] | null>;
    busarInventarioId(criterios : { id : string}) : Promise <Inventario | null >;
}
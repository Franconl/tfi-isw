import { Articulo } from "../entities/Articulo";
import { Inventario } from "../entities/Inventario";

export interface IArticuloRepository {
    buscarArticulo(criterios: { codigo?: string }): Promise<Articulo>;
    buscarInventario(criterios : { articulo : Articulo }) : Promise <Inventario[]>;
}
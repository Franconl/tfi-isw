import { Articulo } from "../entities/Articulo";

export interface IArticuloRepository {
    buscarArticulo(criterios: { codigo?: string }): Promise<Articulo[]>;
}
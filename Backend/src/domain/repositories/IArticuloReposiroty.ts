import { Articulo } from "../entities/Articulo";

export interface IArticuloRepository {
  findArticuloByCodigo(codigo: string): Promise<Articulo | null>;
  registerArticulo(articulo: Articulo): Promise<Articulo | null>;
  listArticulos(): Promise<Articulo[]>;
}

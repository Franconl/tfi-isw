import { ArticuloEntity } from "../entities/ArticuloEntity";

export interface IArticuloRepository {
  findArticuloByCodigo(codigo: string): Promise<ArticuloEntity | null>;
  registerArticulo(articulo: ArticuloEntity): Promise<ArticuloEntity | null>;
  listArticulos(): Promise<ArticuloEntity[]>;
}

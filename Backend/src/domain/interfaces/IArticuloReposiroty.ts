import { Articulo } from "../entities/Articulo";
import { Inventario } from "../entities/Inventario";
import { Sucursal } from "../entities/Sucursal";
import { Categoria } from "../entities/Categoria";
import { Marca } from "../entities/Marca";
import { TipoDeTalle } from "../entities/TipoDeTalle";

export interface IArticuloRepository {
    buscarArticulo(criterios: { id: string}): Promise<Articulo | null>
    buscarInventario(criterios : { articulo : Articulo , sucursalId : string}) : Promise <Inventario[] | null>;
    busarInventarioId(criterios : { id : string}) : Promise <Inventario | null >;
    crear(criterios : { articulo : Articulo }) : Promise<any>;
    crearCategoria(criterios : { categoria : Categoria }) : Promise<any>;
    crearMarca(criterios : { marca : Marca }) : Promise<any>;
    crearTipoDeTalle(criterios : { tipo : TipoDeTalle }) : Promise<any>;
}

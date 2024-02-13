import { Articulo } from "../entities/Articulo";
import { Inventario } from "../entities/Inventario";
import { Sucursal } from "../entities/Sucursal";
import { Categoria } from "../entities/Categoria";
import { Marca } from "../entities/Marca";
import { TipoDeTalle } from "../entities/TipoDeTalle";
import { Color } from "../entities/Color";
import { Talle } from "../entities/Talle";


export interface IArticuloRepository {
    busarInventarioId(criterios: { id: string }): Promise<any>;
    buscarArticulo(criterios: { id: string }): Promise<Articulo | null>;
    buscarInventario(criterios: { articulo: Articulo; sucursalId: string }): Promise<any>;
    crear(criterios: { articulo: Articulo }): Promise<any>;
    crearTipoDeTalle(criterios: { tipo: TipoDeTalle }): Promise<void>;
    buscarTipoDeTalle(criterios: { id: string }): Promise<any>;
    buscarTiposDeTalle(): Promise<any>;
    crearMarca(criterios: { marca: Marca }): Promise<void>;
    buscarMarca(criterios: { id: string }): Promise<any>;
    buscarMarcas(): Promise<any>;
    crearCategoria(criterios: { categoria: Categoria }): Promise<void>;
    buscarCategoria(criterios: { id: string }): Promise<any>;
    buscarCategorias(): Promise<any>;
    buscarColor(criterios: { id: string }): Promise<any>;
    buscarSucursal(criterios: { id: string }): Promise<any>;
    buscarSucursales(): Promise<any>;
    buscarTalle(criterios: { id: string }): Promise<any>;
    buscarTalles(): Promise<any>;
    buscarPuntoDeVenta(criterios: { id: string }): Promise<any>;
    buscarPuntosDeVentas(): Promise<any>;
    setPdvOcupado(id : string) : void
}

import { Articulo } from "../domain/entities/Articulo";
import { Categoria } from "../domain/entities/Categoria";
import { Color } from "../domain/entities/Color";
import { Inventario } from "../domain/entities/Inventario";
import { Marca } from "../domain/entities/Marca";
import { Sucursal } from "../domain/entities/Sucursal";
import { Talle } from "../domain/entities/Talle";
import { TipoDeTalle } from "../domain/entities/TipoDeTalle";
import { IArticuloRepository } from "../domain/repositories/IArticuloReposiroty";

export class ArticuloMock implements IArticuloRepository{

    buscarArticulo(criterios: { codigo?: string }): Promise<Articulo | null> {
        const tipoDeTalle = new TipoDeTalle('1234', 'EU');
        const categoria = new Categoria('1234', 'Remera');
        const marca = new Marca('123', 'nike');
        const articulo = new Articulo('1234', 'remera azul', 200, 23, tipoDeTalle, categoria, marca);
    
        if (criterios.codigo === articulo.getCodigo()) {
            // Si hay un código en los criterios y coincide con el código del artículo
            return Promise.resolve(articulo);
        } else {
            return Promise.resolve(null);
        }
    }
    
    buscarInventario(criterios: { articulo: Articulo }): Promise<Inventario[] | null> {
        const tipoDeTalle: TipoDeTalle = new TipoDeTalle('1234', 'EU');
        const talle = new Talle('23', tipoDeTalle);
        const color = new Color('1234', 'rojo');
        const sucursal = new Sucursal('1234', 'centro', 'concepcion', 1234);
     
        const inventario: Inventario[] = [new Inventario(2, criterios.articulo, talle, color, sucursal)];
    
        return Promise.resolve(inventario);
    }
    

}
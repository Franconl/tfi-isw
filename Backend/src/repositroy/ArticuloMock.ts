/*import { Articulo } from "../domain/entities/Articulo";
import { Categoria } from "../domain/entities/Categoria";
import { Color } from "../domain/entities/Color";
import { Inventario } from "../domain/entities/Inventario";
import { Marca } from "../domain/entities/Marca";
import { Sucursal } from "../domain/entities/Sucursal";
import { Talle } from "../domain/entities/Talle";
import { TipoDeTalle } from "../domain/entities/TipoDeTalle";
import { IArticuloRepository } from "../domain/interfaces/IArticuloReposiroty";

export class ArticuloMock implements IArticuloRepository{
    private articulo : Articulo[];
    private inventario : Inventario[];

    constructor(){
        const tipoDeTalle = new TipoDeTalle('1234', 'EU');
        const categoria = new Categoria('1234', 'Remera');
        const marca = new Marca('123', 'nike');
        const articulo1 = new Articulo('1234', 'remera azul', 400, 20, tipoDeTalle, categoria, marca);

        this.articulo = [articulo1]

        const talle = new Talle('23', tipoDeTalle);
        const color = new Color('1234', 'rojo');
        const sucursal = new Sucursal('1234', 'centro', 'concepcion', 1234);
     
        this.inventario = [new Inventario(2, articulo1 , talle, color, sucursal)];
    }

    buscarArticulo(criterios: { codigo?: string }): Promise<Articulo | null> {
        
    
        if (criterios.codigo = this.articulo[0].getCodigo()) {
            return Promise.resolve(this.articulo[0]);
        } else {
            return Promise.resolve(null);
        }
    }
    
    buscarInventario(criterios: { articulo: Articulo }): Promise<Inventario[] | null> {
        
    
        return Promise.resolve(this.inventario);
    }
    
    busarInventarioId(criterios: { id: string; }): Promise<Inventario | null> {
        if(criterios.id = this.inventario[0].getId()){
            return Promise.resolve(this.inventario[0]);
        }else return Promise.resolve(null);
    }

    crear(criterios: { articulo: Articulo; }): void {
        Promise.resolve(null)
    }
}*/
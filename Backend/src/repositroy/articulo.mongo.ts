import { Articulo } from "../domain/entities/Articulo";
import ArticuloModel from "../infrastructure/models/articulo.schema";
import { IArticuloRepository } from "../domain/interfaces/IArticuloReposiroty";
import { Inventario } from "../domain/entities/Inventario";
import { Document, Types } from 'mongoose';
import TipoDeTalleModel from "../infrastructure/models/tipoDeTalle.schema";
import CategoriaModel from "../infrastructure/models/categoria.schema";
import MarcaModel from "../infrastructure/models/marca.schema";
import { Categoria } from "../domain/entities/Categoria";
import { Marca } from "../domain//entities/Marca";
import { TipoDeTalle } from "../domain/entities/TipoDeTalle";

interface ArticuloDocument extends Document {
    estado: string;
    descripcion: string;
    costo: number;
    margenDeGanancia: number;
    tipoDetalle: Types.ObjectId;
    categoria: Types.ObjectId;
    marca: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export class ArticuloMongo implements IArticuloRepository {

    busarInventarioId(criterios: { id: string; }): Promise<Inventario | null> {
        return Promise.resolve(null);
    }
    
    

    public async buscarArticulo(criterios: { id: string }): Promise<Articulo | null> {
        try {
            const articulo = await ArticuloModel.findById(criterios.id).lean().exec();
            
            if (!articulo) {
                return null; 
            }
            
            const tipo_id = articulo.tipoDetalle?.toString();
            const categoria_id = articulo.categoria?.toString();
            const marca_id = articulo.marca?.toString();
            
            // Buscar el tipo de talle asociado al artículo
            let tipo: TipoDeTalle | undefined;
            if (tipo_id) {
                tipo = await this.buscarTipoDeTalle({ id: tipo_id });
                if (!tipo) {
                    console.error('Tipo de talle no encontrado para el artículo:', criterios.id);
                    return null;
                }
            } else {
                console.error('No hay tipo de talle asociado al artículo:', criterios.id);
                return null;
            }
    
            // Buscar la categoría asociada al artículo
            let categoria: Categoria | undefined;
            if (categoria_id) {
                categoria = await this.buscarCategoria({ id: categoria_id });
                if (!categoria) {
                    console.error('Categoría no encontrada para el artículo:', criterios.id);
                    return null;
                }
            } else {
                console.error('No hay categoría asociada al artículo:', criterios.id);
                return null;
            }
    
            // Buscar la marca asociada al artículo
            let marca: Marca | undefined;
            if (marca_id) {
                marca = await this.buscarMarca({ id: marca_id });
                if (!marca) {
                    console.error('Marca no encontrada para el artículo:', criterios.id);
                    return null;
                }
            } else {
                console.error('No hay marca asociada al artículo:', criterios.id);
                return null;
            }
    
            // Crear un nuevo objeto Articulo con los datos obtenidos
            const response = new Articulo(
                articulo._id.toString(),
                articulo.descripcion || '',
                articulo.costo || 0,
                articulo.margenDeGanancia || 0,
                tipo,
                categoria,
                marca,
                articulo.estado || ''
            );
            return response;
        } catch (error) {
            console.error('Error al buscar el artículo:', error);
            return null;
        }
    }
    
    
    
    

    buscarInventario(criterios: { articulo: Articulo; }): Promise<Inventario[] | null> {
        return Promise.resolve([]);
    }

    async crear(criterios: { articulo: Articulo; }): Promise<any> {
        try {
            const articuloDocument = await ArticuloModel.create(criterios.articulo);
            const nuevoArticulo = articuloDocument.toObject();
            console.log(nuevoArticulo)
            return nuevoArticulo;

        } catch (error) {
            console.error('Error al crear el artículo:', error);
            throw error; 
        }
    }
    
        async crearTipoDeTalle(criterios: { tipo : TipoDeTalle; }): Promise<void> {
            try {
                await TipoDeTalleModel.create(criterios.tipo);
            } catch (error) {
                console.error('Error al crear el Tipo de Talle:', error);
                throw error; 
            }
        }

        async buscarTipoDeTalle(criterios : { id : string }){
            try{
                const tipo = await TipoDeTalleModel.findById(criterios.id).exec();
                if(tipo){
                    const response : TipoDeTalle = tipo.toObject();
                    return response;
                }
            }catch(error){
                console.error('Error al buscar el Tipo de Talle:', error);
                throw error; 
            }
        }

        async crearMarca(criterios: { marca: Marca; }): Promise<void> {
            try {
                await MarcaModel.create(criterios.marca);
            } catch (error) {
                console.error('Error al crear Marca:', error);
                throw error; 
            }
        }

        async buscarMarca(criterios : { id : string }){
            try{
                const tipo = await MarcaModel.findById(criterios.id).exec();
                if(tipo){
                    const response : Marca = tipo.toObject();
                    return response;
                }
            }catch(error){
                console.error('Error al buscar Marca:', error);
                throw error; 
            }
        }

        async crearCategoria(criterios: { categoria : Categoria; }): Promise<void> {
            try {
                await CategoriaModel.create(criterios.categoria);
            } catch (error) {
                console.error('Error al crear Categoria:', error);
                throw error; 
            }
        }

        async buscarCategoria(criterios : { id : string }){
            try{
                const tipo = await CategoriaModel.findById(criterios.id).exec();
                if(tipo){
                    const response : Categoria = tipo.toObject();
                    return response;
                }
            }catch(error){
                console.error('Error al buscar Categoria:', error);
                throw error; 
            }
        }
}
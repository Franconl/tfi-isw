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
import InventarioModel from "../infrastructure/models/inventario.schema";
import TalleModel from "../infrastructure/models/talle.shcema";
import { Talle } from "../domain/entities/Talle";
import ColorModel from "../infrastructure/models/color.schemas";
import { Color } from "../domain/entities/Color";
import SucursalModel from "../infrastructure/models/sucursal.schema";
import { Sucursal } from "../domain/entities/Sucursal";
import PuntoDeVentaModel from "../infrastructure/models/puntoDeVenta.schema";
import { PuntoDeVenta } from "../domain/entities/PuntoDeVenta";


export class ArticuloMongo implements IArticuloRepository {

   async busarInventarioId(criterios: { id: string; }): Promise<any> {
        try {

            const inventarioMongo = await InventarioModel.findById(criterios.id).lean().exec();
            console.log(inventarioMongo,'ssssssssssssssssssssss')
            if (!inventarioMongo) {
                console.error('inventario no encontrado')
                return null;
            }

                if (!inventarioMongo.talle || !inventarioMongo.color) {
                    console.error('El inventario no tiene talle o color:', inventarioMongo._id);
                    return null;
                }

                // Buscar el talle asociado al inventario
                const talle = await this.buscarTalle({ id: inventarioMongo.talle.toString() });
                if (!talle) {
                    console.error('El talle no fue encontrado para el inventario:', inventarioMongo._id);
                    return null;
                }
    
                // Buscar el color asociado al inventario
                const color = await this.buscarColor({ id: inventarioMongo.color.toString() });
                if (!color) {
                    console.error('El color no fue encontrado para el inventario:', inventarioMongo._id);
                    return null;
                }
                
                const sucursal_id =  inventarioMongo.sucursal?.toString();
                if(!sucursal_id){
                    console.error('Inventario sin sucursal');
                    return null;
                }
                // Buscar la sucursal asociada al inventario
                const sucursal = await this.buscarSucursal({ id : sucursal_id });
                if (!sucursal) {
                    console.error('La sucursal no fue encontrada:', sucursal_id);
                    return null;
                }
                
                if(!inventarioMongo.cantidad){
                    console.error('El inventario no tiene cantidad');
                    return null;
                }
                
                const articulo_id = inventarioMongo.articulo?.toString();
                if(!articulo_id){
                    console.error('inventario sin articulo',articulo_id);
                    return null;
                }

                const articulo = await this.buscarArticulo({id : articulo_id})
                if(!articulo){
                    console.error('el articulo no fue encontrado:',articulo_id);
                    return null;
                }

                // Crear el objeto Inventario 
                 const inventario = new Inventario(
                    inventarioMongo._id.toString(),
                    inventarioMongo.cantidad,
                    articulo,
                    talle,
                    color,
                    sucursal
                );
            

            return inventario;
        } catch (error) {
            console.error('Error al buscar inventarios:', error);
            return null;
        }
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
    
    

    async buscarInventario(criterios : { articulo : Articulo , sucursalId : string}) : Promise <any> {
        try {

            const articuloId = criterios.articulo.getCodigo();
            // Encuentra todos los inventarios que tengan el ID del artículo y de la sucursal proporcionados
            const inventariosMongo = await InventarioModel.find({
                articulo: articuloId
            }).lean().exec();
            // Si no se encuentran inventarios, devuelve null
            if (!inventariosMongo || inventariosMongo.length === 0) {
                return null;
            }
    
            // Mapea la respuesta de MongoDB a objetos de tipo Inventario
            const inventarios: Inventario[] = [];
    
            for (const inventarioMongo of inventariosMongo) {
                // Verificar si el inventario tiene talle y color
                if (!inventarioMongo.talle || !inventarioMongo.color) {
                    console.error('El inventario no tiene talle o color:', inventarioMongo._id);
                    continue;
                }

                // Buscar el talle asociado al inventario
                const talle = await this.buscarTalle({ id: inventarioMongo.talle.toString() });
                if (!talle) {
                    console.error('El talle no fue encontrado para el inventario:', inventarioMongo._id);
                    continue;
                }
    
                // Buscar el color asociado al inventario
                const color = await this.buscarColor({ id: inventarioMongo.color.toString() });
                if (!color) {
                    console.error('El color no fue encontrado para el inventario:', inventarioMongo._id);
                    continue;
                }
    
                // Buscar la sucursal asociada al inventario
                const sucursal = await this.buscarSucursal({ id: criterios.sucursalId });
                if (!sucursal) {
                    console.error('La sucursal no fue encontrada:', criterios.sucursalId);
                    continue;
                }
                
                if(!inventarioMongo.cantidad){
                    console.error('El inventario no tiene cantidad');
                    continue;
                }
    
                // Crear el objeto Inventario y agregarlo al arreglo
                inventarios.push(new Inventario(
                    inventarioMongo._id.toString(),
                    inventarioMongo.cantidad,
                    criterios.articulo,
                    talle,
                    color,
                    sucursal
                ));
            }
    
            // Retorna la lista de inventarios encontrados
            return inventarios;
        } catch (error) {
            console.error('Error al buscar inventarios:', error);
            return null;
        }
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

        async buscarTiposDeTalle() {
            try {
                const tipos = await TipoDeTalleModel.find().exec();
                return tipos.map(tipo => tipo.toObject());
            } catch (error) {
                console.error('Error al buscar los Tipos de Talle:', error);
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

        async buscarMarcas() {
            try {
                const marcas = await MarcaModel.find().exec();
                return marcas.map(marca => marca.toObject());
            } catch (error) {
                console.error('Error al buscar las marcas:', error);
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

        async buscarCategorias() {
            try {
                const categorias = await CategoriaModel.find().exec();
                return categorias.map(categoria => categoria.toObject());
            } catch (error) {
                console.error('Error al buscar las categorías:', error);
                throw error;
            }
        }

        async buscarColor(criterios: { id: string }) {
            try {
                const color = await ColorModel.findById(criterios.id).exec();
                if (color) {
                    const response: Color = color.toObject();
                    return response;
                }
            } catch (error) {
                console.error('Error al buscar el color:', error);
                throw error;
            }
        }
        
        async buscarSucursal(criterios: { id: string }) {
            try {
                const sucursal = await SucursalModel.findById(criterios.id).exec();
                console.log(sucursal)
                if (!sucursal || !sucursal._id || !sucursal.nombre || !sucursal.ciudad || !sucursal.telefono) {
                    return null
                }

                const sucursalResponse = new Sucursal(sucursal._id.toString() ,sucursal.nombre,sucursal.ciudad,sucursal.telefono)

                return sucursalResponse;
            } catch (error) {
                console.error('Error al buscar la sucursal:', error);
                throw error;
            }
        }
        
        async buscarSucursales() {
            try {
                const sucursales = await SucursalModel.find().exec();
                return sucursales.map(sucursal => sucursal.toObject());
            } catch (error) {
                console.error('Error al buscar las sucursales:', error);
                throw error;
            }
        }



        async buscarTalle(criterios: { id: string }) {
            try {
                const talle = await TalleModel.findById(criterios.id).exec();
                if (talle) {
                    const response: Talle = talle.toObject();
                    return response;
                }
            } catch (error) {
                console.error('Error al buscar el talle:', error);
                throw error;
            }
        }

        async buscarTalles() {
            try {
                const talles = await TalleModel.find().exec();
                return talles.map(talle => talle.toObject());
            } catch (error) {
                console.error('Error al buscar los talles:', error);
                throw error;
            }
        }

        async buscarPuntoDeVenta(criterios: { id: string }) {
            try {
                const pdvMongo = await PuntoDeVentaModel.findById(criterios.id).exec();
                if(!pdvMongo || !pdvMongo._id || !pdvMongo.numero || !pdvMongo.sucursal || !pdvMongo.estado){
                    console.error('error al obtener punto de venta')
                    return null;
                }
                const id_suc = pdvMongo.sucursal.toString();
                const sucursal = await this.buscarSucursal({id : id_suc});
                console.log(sucursal,'')
                if(!sucursal){
                    console.error('error al obtener sucursal de pdv')
                    return null;
                }
                const pdv : PuntoDeVenta = new PuntoDeVenta(pdvMongo._id.toString(),pdvMongo.numero,sucursal,pdvMongo.estado);
                console.log(pdv,'art.mongo')
                return pdv;
            } catch (error) {
                console.error('Error al buscar el punto de venta:', error);
                throw error;
            }
        }

        async buscarPuntosDeVentas() {
            try {
                const puntosDeVentas = await PuntoDeVentaModel.find({ estado: { $ne: "ocupado" } }).exec();
                return puntosDeVentas.map(pdv => pdv.toObject());
            } catch (error) {
                console.error('Error al buscar los puntos de venta:', error);
                throw error;
            }
        }

        async setPdvOcupado(id : string) {
            try{
                await PuntoDeVentaModel.findByIdAndUpdate(id, { estado: "ocupado" });
            }catch (error) {
                console.error('Error al modificar pdv', error);
                throw error;
            }
        }

        async setInventarioCantidad(id : string,cantidad : number) : Promise<void>{
            try{
                await InventarioModel.findByIdAndUpdate(id ,{cantidad : cantidad});
            }catch (error) {
                console.error('Error al modificar inventario', error);
                throw error;
            }
        }

        async modificarArticulo(articulo : Articulo){
            try{
                const response = await ArticuloModel.findOneAndReplace({_id : articulo.getCodigo()},{articulo})
                return response;
            }catch (error) {
                console.error('Error al modificar articulo', error);
                throw error;
            }
        }
}
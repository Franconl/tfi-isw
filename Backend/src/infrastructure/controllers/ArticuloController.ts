import { ArticuloService } from "../../aplication/ArticuloService";
import { Request, Response } from 'express';
import { Articulo } from "../../domain/entities/Articulo";
import { Categoria } from "../../domain/entities/Categoria";
import { TipoDeTalle } from "../../domain/entities/TipoDeTalle";
import { Marca } from "../../domain/entities/Marca";


export class ArticuloController {
    private articuloService : ArticuloService;
    
    constructor(artServ : ArticuloService){
        this.articuloService = artServ;
    }


    public async crearArticulo(req : Request , res : Response) : Promise<any>{
        const articulo : Articulo = req.body as Articulo;
        try{
            const response = await this.articuloService.crearArticulo(articulo);
            return response;
        }catch (error) {
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async crearCategoria(req : Request , res : Response){
        const categoria = req.body as Categoria;
        try{
            const response = await this.articuloService.crearCategoria(categoria);
            return response;
        }catch (error) {
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async crearTipoDeTalle(req : Request , res : Response){
        const tipo : TipoDeTalle = req.body as TipoDeTalle;
        try{
            const response = await this.articuloService.crearTipoDeTalle(tipo);
            return response;
        }catch (error) {
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async CrearMarca(req : Request , res : Response){
        const marca : Marca = req.body as Marca;
        try{
            const response = await this.articuloService.crearMarca(marca);
            return response;
        }catch (error) {
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async buscarArticulo(req : Request , res : Response){
        const id = req.query.id as string;
        try{
            const response = await this.articuloService.buscarArticulo(id);
            console.log(response,'articuloctrl')
            return response
        }catch (error) {
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }
    
}
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

    public async eliminarArticulo(req : Request , res : Response){
        try{
            const id = req.query.id as string;
            const response = await this.articuloService.eliminarArticulo(id);
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
            return response
        }catch (error) {
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async buscarArticuloeInventario(req : Request , res : Response){

        const id = req.query.id as string;
        const sucursalId = "65c923f5229d4ff6cd26c860"
        
        try{
            const response = await this.articuloService.buscarArticuloeInvantario(id,sucursalId);
            return response
        }catch (error) {
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async modificarArticulo(req : Request , res : Response){
        const articulo = req.body as Articulo;
        try{
            const response = await this.articuloService.modificarArticulo(articulo);
            if(!response){
                res.status(500).json({ mensaje: 'Error al modificar articulo' });
                return null;
            }
            return response;
        }catch (error) {
            console.error('Error al seleccionar el artículo:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
            return null;
        }
    }

    public async buscarMarcas(req : Request , res : Response){
        try{
            const response = await this.articuloService.buscarMarcas();
            return response;
        }catch(error) {
        console.error('Error al buscar marca:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
        return null;
        }   
    }

    public async buscarTiposTalle(req : Request , res : Response){
        try{
            const response = await this.articuloService.buscarTiposTalle();
            return response;
        }catch(error) {
        console.error('Error al buscar marca:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
        return null;
        }   
    }


    public async buscarCategorias(req : Request , res : Response){
        try{
            const response = await this.articuloService.buscarCategorias();
            return response;
        }catch(error) {
        console.error('Error al buscar marca:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
        return null;
        }   
    }
}
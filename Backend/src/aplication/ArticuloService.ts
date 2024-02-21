import { Articulo } from "../domain/entities/Articulo";
import { IArticuloRepository } from "../domain/interfaces/IArticuloReposiroty";
import { Sucursal } from "../domain/entities/Sucursal";
import { Inventario } from "../domain/entities/Inventario";
import { ISucursalRepository } from "../domain/interfaces/ISucursalRepository";
import { Marca } from "../domain/entities/Marca";
import { Categoria } from "../domain/entities/Categoria";
import { TipoDeTalle } from "../domain/entities/TipoDeTalle";

export class ArticuloService{
    private articuloRepository : IArticuloRepository;

    //private sucursalRepository : ISucursalRepository;

    constructor(artRepo : IArticuloRepository){
        this.articuloRepository = artRepo;
        //this.sucursalRepository = sucuRepo;
    }

    public async crearArticulo(articulo: Articulo): Promise<any> {
        try {
            const response = await this.articuloRepository.crear({ articulo });
            console.log('Artículo creado exitosamente.');
            return response;
        } catch (error) {
            console.error('Error al crear el artículo:', error);
            throw error;
        }
    }

    public async crearTipoDeTalle(tipo: TipoDeTalle): Promise<any> {
        try {
            await this.articuloRepository.crearTipoDeTalle({ tipo });
            console.log('Tipo de Talle creado exitosamente.');
        } catch (error) {
            console.error('Error al crear el artículo:', error);
            throw error;
        }
    }

    public async crearCategoria(categoria: Categoria): Promise<any> {
        try {
            await this.articuloRepository.crearCategoria({ categoria });
            console.log('Categoria creada exitosamente.');
        } catch (error) {
            console.error('Error al crear el artículo:', error);
            throw error;
        }
    }

    public async crearMarca(marca: Marca): Promise<any> {
        try {
            await this.articuloRepository.crearMarca({ marca });
            console.log('Marca creada exitosamente.');
        } catch (error) {
            console.error('Error al crear el artículo:', error);
            throw error;
        }
    }


    public async buscarArticulo(id : string): Promise<any>{

        try{
            const response = await this.articuloRepository.buscarArticulo({id});
            console.log(response,'articulosv')
            return response
        }catch (error) {
            console.error('Error al buscar artículo:', error);
            throw error;
        }
        
    }

    public async buscarArticuloeInvantario(id : string, sucursalId : string){
        try{
            const articulo  = await this.articuloRepository.buscarArticulo({id});

            if(!articulo){
                console.error('articulo no entoncerado');
                return null;
            }
            if(articulo.getEstado() == "no disponible"){
                console.error('articulo no disponible');
                return null;
            }
            const inventario = await this.articuloRepository.buscarInventario({articulo, sucursalId})
            
            return {articulo , inventario};
        }catch (error) {
            console.error('Error al buscar artículo:', error);
            throw error;
        }
    }

    async modificarArticulo(articulo : Articulo){
        try{
            const response = await this.articuloRepository.modificarArticulo(articulo);
            return response;
        }catch (error) {
            console.error('Error al modificar artículo:', error);
            throw error;
        }
    }

    async buscarMarcas(){
        try{
            const response = await this.articuloRepository.buscarMarcas();
            return response;
        }catch (error) {
            console.error('Error al buscar marca:', error);
            throw error;
        }
    }

    async buscarCategorias(){
        try{
            const response = await this.articuloRepository.buscarCategorias();
            return response;
        }catch (error) {
            console.error('Error al buscar marca:', error);
            throw error;
        }
    }

    async buscarTiposTalle(){
        try{
            const response = await this.articuloRepository.buscarTiposDeTalle();
            return response;
        }catch (error) {
            console.error('Error al buscar marca:', error);
            throw error;
        }
    }
}

import mongoose from "mongoose";
import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { PuntoDeVenta } from "../domain/entities/PuntoDeVenta";
import { Sesion } from "../domain/entities/Sesion";
import { Sucursal } from "../domain/entities/Sucursal";
import { Usuario } from "../domain/entities/Usuario";
import { IUsuarioRepository } from "../domain/interfaces/IUsuarioRepository";
import PuntoDeVentaModel from "../infrastructure/models/puntoDeVenta.schema";
import SesionModel from "../infrastructure/models/sesion.schema";
import SucursalModel from "../infrastructure/models/sucursal.schema";
import UsuarioModel from "../infrastructure/models/usuario.schema";

export class UsuarioMongo implements IUsuarioRepository {
    async crearUsuario(usuario: Usuario): Promise<any> {
        try {

            const nuevoUsuario = new UsuarioModel({
                usuario : usuario.getUsername(),
                contraseña : usuario.getPassword(),
                permisos : "user"
            });

            await nuevoUsuario.save();
            return true;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            return false; 
        }
    }

    async obtenerUsuarioPorUsuario(usuario: string): Promise<any> {
        try {
            const usuarioEncontrado = await UsuarioModel.findOne({ usuario }).exec();
            if(!usuarioEncontrado?.usuario || !usuarioEncontrado.contraseña || !usuarioEncontrado.permisos){
                return null;
            }
            const usuarioResponse : Usuario = new Usuario(usuarioEncontrado._id.toString(),usuarioEncontrado.usuario,usuarioEncontrado.contraseña, usuarioEncontrado.permisos);

            return usuarioResponse;
             
        } catch (error) {
            console.error('Error al obtener el usuario por su nombre de usuario:', error);
            return null; // Hubo un error
        }
    }


    async eliminarUsuario(usuario: string): Promise<any> {
        try {
            // Buscar el usuario por su nombre de usuario y eliminarlo
            await UsuarioModel.deleteOne({ usuario }).exec();
            return true; // Se eliminó exitosamente
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            return false; // Hubo un error
        }
    }

    obtenerCondicionTienda(): CondicionTributaria {
        const condicionTienda = CondicionTributaria.RESPONSABLE_INSCRIPTO;
        return condicionTienda;
    }

    async crearNuevaSesion(ses: Sesion) : Promise<any>  {

        try {
            // Crear una nueva instancia del modelo de sesión
            const sesion = new SesionModel({
              usuario: ses.getUsuario().getId(), // Utiliza el identificador ObjectId del usuario
              puntoDeVenta: ses.getPuntoDeVenta().getId(), // Utiliza el identificador ObjectId del punto de venta
              numeroComprobanteA: ses.getNumeroComprobanteA(),
              numeroComprobanteB: ses.getNumeroComprobanteB(),
              tokenAfip: ses.getTokenAfip(),
              condicionTienda: ses.getCondicionTienda()
            });
        
            // Guardar la sesión en la base de datos
            const sesionGuardada = await sesion.save();
        
            // Devolver la sesión guardada
            return sesionGuardada;
          } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso de guardado
            console.error('Error al guardar la sesión:', error);
            throw error; // O manejar de acuerdo a la lógica de tu aplicación
          }
    }

    async obtenerUsuarioPorId( id : string){
        try {
            const usuarioEncontrado = await UsuarioModel.findById(id).exec();
            if(!usuarioEncontrado?._id || !usuarioEncontrado?.usuario || !usuarioEncontrado.contraseña || !usuarioEncontrado.permisos){
                return null;
            }
            const usuarioResponse : Usuario = new Usuario(usuarioEncontrado._id.toString(),usuarioEncontrado.usuario,usuarioEncontrado.contraseña, usuarioEncontrado.permisos);

            return usuarioResponse;
             
        } catch (error) {
            console.error('Error al obtener el usuario por su nombre de usuario:', error);
            return null; // Hubo un error
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
            if(!sucursal){
                console.error('error al obtener sucursal de pdv')
                return null;
            }
            const pdv : PuntoDeVenta = new PuntoDeVenta(pdvMongo._id.toString(),pdvMongo.numero,sucursal,pdvMongo.estado);
            return pdv;
        } catch (error) {
            console.error('Error al buscar el punto de venta:', error);
            throw error;
        }
    }

    public async cerrarSesion(sesion: Sesion): Promise<any> {
        const sesionMongo = await SesionModel.findById(sesion.getId());

        if(!sesionMongo || !sesionMongo.puntoDeVenta) return null;

        const pdv = await PuntoDeVentaModel.findById(sesionMongo.puntoDeVenta._id.toString());

        if(!pdv) return null;

        pdv.estado = 'disponible';
        await pdv.save();

        const pdvDisponible = await this.buscarPuntoDeVenta({id : sesionMongo.puntoDeVenta._id.toString()})
        return pdvDisponible;
    }

    async setPuntoDeVentaOcupado(id : string) : Promise<void>{
        try{
            const pdvMongo = await PuntoDeVentaModel.findById(id);
            if(pdvMongo){
                pdvMongo.estado = 'ocupado'

                pdvMongo.save()
            }
        }catch (error) {
            console.error('Error al buscar el punto de venta:', error);
            throw error;
        }
    }

    async buscarSucursal(criterios: { id: string }) {
        try {
            const sucursal = await SucursalModel.findById(criterios.id).exec();
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

    async obtenerSesion(id : string) : Promise<Sesion | null>{
        const sesionMongo = await SesionModel.findById(id);
        if(!sesionMongo || !sesionMongo.usuario || !sesionMongo.puntoDeVenta){
            return null;
        }
        const usuario = await this.obtenerUsuarioPorId(sesionMongo.usuario._id.toString());
        if(!usuario){
            return null;
        }

        const puntoDeVenta = await this.buscarPuntoDeVenta({id : sesionMongo.puntoDeVenta._id.toString()})
        if(!puntoDeVenta){
            return null;
        }

        const sesion = new Sesion(usuario, puntoDeVenta);

        if(sesionMongo.tokenAfip){
            sesion.setTokenAfip(sesionMongo.tokenAfip);
        }

        if(sesionMongo.numeroComprobanteA && sesionMongo.numeroComprobanteB){
            sesion.setNumeroComprobanteA(sesionMongo.numeroComprobanteA);
            sesion.setNumeroComprobanteB(sesionMongo.numeroComprobanteB);
        }

        sesion.setCondicionTienda(this.obtenerCondicionTienda());

        sesion.setId(id);

        if(sesionMongo.tokenTarjeta) sesion.setTokenTarjeta(sesionMongo.tokenTarjeta)

        return sesion;
    }

    async guardarSesion(ses : Sesion): Promise<any> {
        try {
            // Buscar la sesión por su ID en la base de datos
            const sesion = await SesionModel.findById(ses.getId());
        
            // Verificar si la sesión existe
            if (!sesion) {
              throw new Error('Sesión no encontrada');
            }
            
            
                sesion.usuario = new mongoose.Types.ObjectId(ses.getUsuario().getId()), // Utiliza el identificador ObjectId del usuario
                sesion.puntoDeVenta = new mongoose.Types.ObjectId(ses.getPuntoDeVenta().getId()), // Utiliza el identificador ObjectId del punto de venta
                sesion.numeroComprobanteA = ses.getNumeroComprobanteA(),
                sesion.numeroComprobanteB = ses.getNumeroComprobanteB(),
                sesion.tokenAfip = ses.getTokenAfip(),
                sesion.condicionTienda = ses.getCondicionTienda()
                sesion.tokenTarjeta = ses.getTokenTarjeta()

                const sesionGuardada = await sesion.save();

                return sesionGuardada;

          } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso de modificación
            console.error('Error al modificar la sesión:', error);
            throw error; // O manejar de acuerdo a la lógica de tu aplicación
          }
    }

}


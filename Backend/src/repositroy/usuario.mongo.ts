import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { Usuario } from "../domain/entities/Usuario";
import { IUsuarioRepository } from "../domain/interfaces/IUsuarioRepository";
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
            const usuarioResponse : Usuario = new Usuario(usuarioEncontrado.usuario,usuarioEncontrado.contraseña, usuarioEncontrado.permisos);

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
}

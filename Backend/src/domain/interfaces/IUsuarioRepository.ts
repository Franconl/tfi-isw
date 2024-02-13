import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository{
    crearUsuario(usuario: Usuario): Promise<boolean>;
    obtenerUsuarioPorUsuario(usuario: string): Promise<any>;
    eliminarUsuario(usuario: string): Promise<any>;
}
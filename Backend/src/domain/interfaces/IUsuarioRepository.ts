import { CondicionTributaria } from "../entities/CondicionTributaria";
import { Sesion } from "../entities/Sesion";
import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository{
    crearUsuario(usuario: Usuario): Promise<boolean>;
    obtenerUsuarioPorUsuario(usuario: string): Promise<any>;
    eliminarUsuario(usuario: string): Promise<any>;
    obtenerCondicionTienda() : CondicionTributaria;
    guardarSesion(sesion : Sesion) : Promise<any>;
    crearNuevaSesion(ses: Sesion) : Promise<any>;
    obtenerSesion(id : string) : Promise<Sesion | null>
    setPuntoDeVentaOcupado(id : string) : Promise<void>
    cerrarSesion(sesion : Sesion) : Promise<any>;
}
import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository{
    authUsuario(criterios : {us : string , pass : string} ) : Promise <Usuario | null>;
}
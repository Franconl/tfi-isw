import { Sucursal } from "../domain/entities/Sucursal";
import { Usuario } from "../domain/entities/Usuario";
import { IClienteRepository } from "../domain/repositories/IClienteRepository";
import { ISucursalRepository } from "../domain/repositories/ISucursalRepository";
import { IUsuarioRepository } from "../domain/repositories/IUsuarioRepository";


export class AuthService{
    private repositoryUsuario : IUsuarioRepository;
    private repositorySucursal : ISucursalRepository;

    constructor(repoUsuario : IUsuarioRepository, repoSucursal : ISucursalRepository){
        this.repositoryUsuario = repoUsuario;
        this.repositorySucursal = repoSucursal
    }

    public async authUser(us : string , pass : string) : Promise<boolean>{
        try{
            const usuario = await this.repositoryUsuario.authUsuario({us , pass});
            if(usuario) return true;
            else return false;
        }catch(error){
            console.error('error al autentificar usuario', error);
            return false;
        }
    }

    public async getSucursal(id : string) : Promise<Sucursal | null>{
        try{
            const sucursal = await this.repositorySucursal.getSucursal({id});
            return sucursal;
        }catch(error){
            console.error('error al obtener sucursal', error);
            return null;
        }
    }
}
import { PuntoDeVenta } from "../domain/entities/PuntoDeVenta";
import { Sucursal } from "../domain/entities/Sucursal";
import { Usuario } from "../domain/entities/Usuario";
import { IClienteRepository } from "../domain/interfaces/IClienteRepository";
import { ISucursalRepository } from "../domain/interfaces/ISucursalRepository";
import { IUsuarioRepository } from "../domain/interfaces/IUsuarioRepository";


export class AuthService{
    private repositoryUsuario : IUsuarioRepository;
    private repositorySucursal : ISucursalRepository;

    constructor(repoUsuario : IUsuarioRepository, repoSucursal : ISucursalRepository){
        this.repositoryUsuario = repoUsuario;
        this.repositorySucursal = repoSucursal;
    }

    public async authUser(us : string , pass : string) : Promise<any>{
        try{
            const usuario : Usuario= await this.repositoryUsuario.obtenerUsuarioPorUsuario(us);
            if(!usuario){
                console.error('Usuario no Registrado');
                return null;
            }

            if(usuario.getPassword() == pass){
                return usuario;
            }else{
                console.error('contraseña incorrecta');
                return null;
            }

        }catch(error){
            console.error('error al autentificar usuario', error);
            return null;
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

    public async getPuntoDeVenta(numero : number) : Promise<PuntoDeVenta | null>{
        try{
            const puntoDeVenta = await this.repositorySucursal.getPuntoDeVenta({numero});

            if(puntoDeVenta && puntoDeVenta.getEstado() == "disponible"){

                puntoDeVenta.setEstado("ocupado");
                return puntoDeVenta;
            }else{
                console.error("punto de venta ocupado");
                return null;
            }

        }catch(error){
            console.error('error al obtener puntoDeVenta', error);
            return null;
        }
    }
}
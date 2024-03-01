import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { PuntoDeVenta } from "../domain/entities/PuntoDeVenta";
import { Sucursal } from "../domain/entities/Sucursal";
import { Usuario } from "../domain/entities/Usuario";
import { IArticuloRepository } from "../domain/interfaces/IArticuloReposiroty";
import { IClienteRepository } from "../domain/interfaces/IClienteRepository";
import { ISucursalRepository } from "../domain/interfaces/ISucursalRepository";
import { IUsuarioRepository } from "../domain/interfaces/IUsuarioRepository";


export class AuthService{
    private repositoryUsuario : IUsuarioRepository;
    private artRepo : IArticuloRepository;

    constructor(repoUsuario : IUsuarioRepository, artRepo : IArticuloRepository){
        this.artRepo = artRepo;
        this.repositoryUsuario = repoUsuario;
    }

    public async authUser(us : string , pass : string) : Promise<any>{
        try{
            const usuario : Usuario = await this.repositoryUsuario.obtenerUsuarioPorUsuario(us);
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
            const sucursal : Sucursal = await this.artRepo.buscarSucursal({id});
            console.log(sucursal,'getsucursal authsv')
            return sucursal;
        }catch(error){
            console.error('error al obtener sucursal', error);
            return null;
        }
    }

    public async getPuntoDeVenta(id : string) : Promise<PuntoDeVenta | null>{
        try{
            const puntoDeVenta : PuntoDeVenta = await this.artRepo.buscarPuntoDeVenta({id});
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

    public async setPuntoDeVentaOcupado(pdv : PuntoDeVenta) {
        
        const id = pdv.getId();
        this.artRepo.setPdvOcupado(id);

    }     

    public obtenerCondicionTienda() : CondicionTributaria{
        const response = this.repositoryUsuario.obtenerCondicionTienda();
        return response;
    }

}
import { PuntoDeVenta } from "./PuntoDeVenta";
import { Sucursal } from "./Sucursal";
import { Usuario } from "./Usuario";

export class Sesion{

        private static instancia: Sesion | null = null;
        private usuario: Usuario;
        private puntoDeVenta: PuntoDeVenta;
        private sucursal : Sucursal;
      
        private constructor(usuario: Usuario, puntoDeVenta: PuntoDeVenta, sucursal : Sucursal) {
          this.usuario = usuario;
          this.puntoDeVenta = puntoDeVenta;
          this.sucursal = sucursal;
        }
      
        static obtenerInstancia(usuario: Usuario, puntoDeVenta: PuntoDeVenta, sucursal : Sucursal): Sesion {
          if (!Sesion.instancia) {
            Sesion.instancia = new Sesion(usuario, puntoDeVenta, sucursal);
            puntoDeVenta.setEstado("ocupado");
          }
          return Sesion.instancia;
        }
      
        getUsuario(): Usuario {
          return this.usuario;
        }
      
        getPuntoDeVenta(): PuntoDeVenta {
          return this.puntoDeVenta;
        }

        setUsuario(usuario : Usuario) : void {
          this.usuario = usuario
        }

        setPuntoDeVenta(puntoDeVenta : PuntoDeVenta) : void {
          this.puntoDeVenta = puntoDeVenta;
        }
}
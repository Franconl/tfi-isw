import { PuntoDeVenta } from "./PuntoDeVenta";
import { Usuario } from "./Usuario";

export class Sesion{

        private static instancia: Sesion | null = null;
        private usuario: Usuario;
        private puntoDeVenta: PuntoDeVenta;
      
        private constructor(usuario: Usuario, puntoDeVenta: PuntoDeVenta) {
          this.usuario = usuario;
          this.puntoDeVenta = puntoDeVenta;
        }
      
        static obtenerInstancia(usuario: Usuario, puntoDeVenta: PuntoDeVenta): Sesion {
          if (!Sesion.instancia) {
            Sesion.instancia = new Sesion(usuario, puntoDeVenta);
            puntoDeVenta.setEstado("ocupado");
          }
          return Sesion.instancia;
        }
      
        obtenerUsuario(): Usuario {
          return this.usuario;
        }
      
        obtenerPuntoDeVenta(): PuntoDeVenta {
          return this.puntoDeVenta;
        }

}
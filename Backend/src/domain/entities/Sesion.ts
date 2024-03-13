import { CondicionTributaria } from "./CondicionTributaria";
import { PuntoDeVenta } from "./PuntoDeVenta";
import { Sucursal } from "./Sucursal";
import { Usuario } from "./Usuario";
//import { ConexionAfipService } from "../../aplication/ConexionAfipService";

export class Sesion{

        private id! : string;
        private usuario: Usuario;
        private puntoDeVenta: PuntoDeVenta;
        private numeroComprobanteA! : number;
        private numeroComprobanteB! : number;
        private tokenAfip! : string;
        private condicionTienda! : CondicionTributaria;
        private tokenTarjeta! : string

      
        constructor(usuario: Usuario, puntoDeVenta: PuntoDeVenta) {
          this.usuario = usuario;
          this.puntoDeVenta = puntoDeVenta;
        }

        getTokenTarjeta(){
          return this.tokenTarjeta
        }

        setTokenTarjeta(token : string){
          this.tokenTarjeta = token
        }

        getId(){
          return this.id;
        }

        setId(id : string){
          this.id = id;
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

        setNumeroComprobanteA(numeroComprobanteA : number) : void{
          this.numeroComprobanteA = numeroComprobanteA;
        }

        getNumeroComprobanteA() : number {
          return this.numeroComprobanteA;
        }

        setNumeroComprobanteB(numeroComprobanteB : number) : void{
          this.numeroComprobanteB = numeroComprobanteB;
        }

        getNumeroComprobanteB() : number {
          return this.numeroComprobanteB;
        }

        setTokenAfip(token : string) : void {
          this.tokenAfip = token;
        }

        getTokenAfip() : string {
          return this.tokenAfip;
        }

        setCondicionTienda(condicion : CondicionTributaria) : void {
          this.condicionTienda = condicion;
        }

        getCondicionTienda() : CondicionTributaria {
          return this.condicionTienda;
        }
}
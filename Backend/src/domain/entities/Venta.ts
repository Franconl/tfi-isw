import { TipoDeComprobante } from "../entities/TipoDeComprobante";
import { Usuario } from "../entities/Usuario";
import { PuntoDeVenta } from "../entities/PuntoDeVenta";
import { LineaDeVenta } from "../entities/LineaDeVenta";
import { Pago } from "../entities/Pago";
import { Cliente } from "../entities/Cliente";
import { v4 as uuid } from "uuid";
import { Comprobante } from "./Comprobante";
import { format } from 'date-fns';

export class Venta {
  private id!: string;
  private fecha: string;
  private monto!: number;
  private estado: string;
  private tipoDeComprobante!: TipoDeComprobante;
  private usuario: Usuario;
  private puntoDeVenta: PuntoDeVenta;
  private lineasDeVenta: LineaDeVenta[];
  private pago!: Pago;
  private cliente: Cliente;
  private comprobante! : Comprobante;

  constructor(usuario: Usuario, cliente: Cliente, puntoDeVenta : PuntoDeVenta, id? : string) {
    this.puntoDeVenta = puntoDeVenta;
    const fecha = new Date();
    const fechaFormateada = format(fecha, "yyyy-MM-dd'T'HH:mm:ss.SS");
    this.fecha = fechaFormateada;
    this.usuario = usuario;
    this.cliente = cliente;
    this.lineasDeVenta = [];
    this.estado = "Pendiente";
    if(id)
    this.id = id; 
  }

  setFecha(fecha : string){
    this.fecha = format(fecha, "yyyy-MM-dd'T'HH:mm:ss.SS");
  }

  getId() : string{
    return this.id;
  }

  getFecha() : string {
    return this.fecha;
  }

  // Getter y setter para monto
  getMonto(): number {
    return this.monto;
  }

  setMonto(monto: number): void {
    this.monto = monto;
  }

  // Getter y setter para estado
  getEstado(): string {
    return this.estado;
  }

  setEstado(estado: string): void {
    // Validamos que el estado sea "Pendiente" o "Aprobado"
    if (estado === "Pendiente" || estado === "Aprobado") {
      this.estado = estado;
    } else {
      console.error("Error: Estado no válido. El estado debe ser 'Pendiente' o 'Aprobado'.");
    }
  }

  // Getter para tipo de comprobante
  getTipoDeComprobante(): TipoDeComprobante {
    return this.tipoDeComprobante;
  }

  // Setter para tipo de comprobante
  setTipoDeComprobante(tipoDeComprobante: TipoDeComprobante): void {
    this.tipoDeComprobante = tipoDeComprobante;
  }

  // Método para agregar una línea de venta
  agregarLineaDeVenta(lineaDeVenta: LineaDeVenta): void {
    this.lineasDeVenta.push(lineaDeVenta);
  }

  getLineaDeVenta() : LineaDeVenta[]{
    return this.lineasDeVenta;
  }

  //getter cliente
  getCliente(): Cliente {
    return this.cliente;
  }
  //setter cliente
  setCliente(cliente: Cliente): void {
    this.cliente = cliente;
  }


  getImporteIva() : number {
    return (this.getMonto() - this.getImporteNeto())
  }

  getImporteNeto() : number{
    return this.getMonto() / 1.21

  }


  setComprobante(comprobante : Comprobante){
    this.comprobante = comprobante;
  }

  setPago(pago : Pago){
    this.pago = pago;
  }

  getPago(){
    return this.pago;
  }

  getComprobante(){
    return this.comprobante;
  }

  getPuntoDeVenta(){
    return this.puntoDeVenta;
  }

  getUsuario(){
    return this.usuario;
  }

  setLineaDeVenta(ldv : LineaDeVenta[]){
    this.lineasDeVenta = ldv;
  }

}

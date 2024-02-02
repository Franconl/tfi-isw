import { TipoDeComprobante } from "../entities/TipoDeComprobante";
import { Usuario } from "../entities/Usuario";
import { PuntoDeVenta } from "../entities/PuntoDeVenta";
import { LineaDeVenta } from "../entities/LineaDeVenta";
//import { Pago } from "../entities/Pago";
import { Cliente } from "../entities/Cliente";
import { v4 as uuid } from "uuid";
import { Comprobante } from "./Comprobante";

export class Venta {
  private id: string;
  private fecha: Date;
  private monto!: number;
  private estado: string;
  private tipoDeComprobante!: TipoDeComprobante;
  private usuario: Usuario;
  private puntoDeVenta: PuntoDeVenta;
  private lineasDeVenta: LineaDeVenta[];
  //private pago: Pago;
  private cliente: Cliente;
  private comprobante! : Comprobante;

  constructor(usuario: Usuario, cliente: Cliente, puntoDeVenta : PuntoDeVenta) {
    this.puntoDeVenta = puntoDeVenta;
    this.id = uuid();
    this.fecha = new Date();
    this.usuario = usuario;
    this.cliente = cliente;
    this.lineasDeVenta = [];
    this.estado = "Pendiente";

  }

  getFecha() : Date {
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
  //getter cliente
  getCliente(): Cliente {
    return this.cliente;
  }
  //setter cliente
  setCliente(cliente: Cliente): void {
    this.cliente = cliente;
  }


  getImporteIva() : number {
    let sum = 0;
    this.lineasDeVenta.forEach(lineaDeVenta => {
      sum =+ (lineaDeVenta.getInventario().getArticulo().obtenerMontoIVA()) * lineaDeVenta.getCantidad();
    });

    return sum;
  }

  getImporteNeto() : number{
    let sum = 0;
    this.lineasDeVenta.forEach(lineaDeVenta => {
      sum =+ (lineaDeVenta.getInventario().getArticulo().obtenerMontoNeto()) * lineaDeVenta.getCantidad();
    });

    return sum;
  }

  getImporteTotal() : number {
    let sum = this.getImporteIva() + this.getImporteNeto();

    return sum;
  }

  setComprobante(comprobante : Comprobante){
    this.comprobante = comprobante;
  }
}

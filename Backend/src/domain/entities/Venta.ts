import { TipoDeComprobante } from "../entities/TipoDeComprobante";
import { Usuario } from "../entities/Usuario";
import { PuntoDeVenta } from "../entities/PuntoDeVenta";
import { LineaDeVenta } from "../entities/LineaDeVenta";
//import { Pago } from "../entities/Pago";
import { Cliente } from "../entities/Cliente";

export class Venta {
  private fecha: Date;
  private monto!: number;
  private estado: string;
  private tipoDeComprobante!: TipoDeComprobante;
  private usuario: Usuario;
  //private puntoDeVenta: PuntoDeVenta;
  private lineasDeVenta: LineaDeVenta[];
  //private pago: Pago;
  private cliente: Cliente;

  constructor(usuario: Usuario, cliente: Cliente) {
    this.fecha = new Date();
    this.usuario = usuario;
    this.cliente = cliente;
    this.lineasDeVenta = [];
    this.estado = "Pendiente";
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
}

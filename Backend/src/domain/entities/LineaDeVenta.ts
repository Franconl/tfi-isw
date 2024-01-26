import { Inventario } from "./Inventario";

export class LineaDeVenta {
  private inventario : Inventario;
  private cantidad: number;
  private precioUnitario: number;

  constructor(inventario: Inventario, cantidad: number, precioUnitario: number) {
    this.inventario = inventario;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  // Getter para artículo
  getInventario(): Inventario {
    return this.inventario;
  }

  // Setter para artículo
  setArticulo(inventario: Inventario): void {
    this.inventario = inventario;
  }

  // Getter para cantidad
  getCantidad(): number {
    return this.cantidad;
  }

  // Setter para cantidad
  setCantidad(cantidad: number): void {
    this.cantidad = cantidad;
  }

  // Getter para precio unitario
  getPrecioUnitario(): number {
    return this.precioUnitario;
  }

  // Setter para precio unitario
  setPrecioUnitario(precioUnitario: number): void {
    this.precioUnitario = precioUnitario;
  }

  // Método para calcular el subtotal de la línea de venta
  calcularSubtotal(): number {
    return this.cantidad * this.precioUnitario;
  }
}

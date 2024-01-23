import { Articulo } from "./Articulo";

export class LineaDeVenta {
  private articulo: Articulo;
  private cantidad: number;
  private precioUnitario: number;

  constructor(articulo: Articulo, cantidad: number, precioUnitario: number) {
    this.articulo = articulo;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  // Getter para artículo
  getArticulo(): Articulo {
    return this.articulo;
  }

  // Setter para artículo
  setArticulo(articulo: Articulo): void {
    this.articulo = articulo;
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

export class ArticuloEntity {
    private codigo: string;
    private descripcion: string;
    private costo: number;
    private margenDeGanancia: number;
  
    constructor(codigo: string, descripcion: string, costo: number, margenDeGanancia: number) {
      this.codigo = codigo;
      this.descripcion = descripcion;
      this.costo = costo;
      this.margenDeGanancia = margenDeGanancia;
    }
  
    obtenerMontoNeto(): number {
      const montoNeto = this.costo + (this.costo * (this.margenDeGanancia / 100));
      return montoNeto;
    }
  
    obtenerMontoIVA(): number {
      const montoNeto = this.obtenerMontoNeto();
      const montoIVA = montoNeto * 0.12; // Suponiendo un 12% de IVA, ajustar según sea necesario
      return montoIVA;
    }
  
    obtenerPrecioVenta(): number {
      const montoNeto = this.obtenerMontoNeto();
      const montoIVA = this.obtenerMontoIVA();
      const precioVenta = montoNeto + montoIVA;
      return precioVenta;
    }
  }
  
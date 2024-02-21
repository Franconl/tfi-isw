import { Categoria } from "./Categoria";
import { Marca } from "./Marca";
import { TipoDeTalle } from "./TipoDeTalle";

export class Articulo {
    private codigo: string;
    private descripcion: string;
    private costo: number;
    private margenDeGanancia: number;
    private tipoDetalle : TipoDeTalle;
    private categoria : Categoria
    private marca : Marca;
    private estado : string;
  
    constructor(codigo: string, descripcion: string, costo: number, margenDeGanancia: number, tipoDeTalle : TipoDeTalle, categoria : Categoria, marca : Marca, estado : string) {
      this.codigo = codigo;
      this.descripcion = descripcion;
      this.costo = costo;
      this.margenDeGanancia = margenDeGanancia;
      this.tipoDetalle = tipoDeTalle;
      this.categoria = categoria;
      this.marca = marca;
      this.estado = estado;
    }

    // Getter para 'codigo'
    getCodigo(): string {
      return this.codigo;
    }

    // Setter para 'codigo'
    setCodigo(codigo: string): void {
      this.codigo = codigo;
    }

    // Getter para 'descripcion'
    getDescripcion(): string {
      return this.descripcion;
    }

    // Setter para 'descripcion'
    setDescripcion(descripcion: string): void {
      this.descripcion = descripcion;
    }

    // Getter para 'costo'
    getCosto(): number {
      return this.costo;
    }

    // Setter para 'costo'
    setCosto(costo: number): void {
      this.costo = costo;
    }

    // Getter para 'margenDeGanancia'
    getMargenDeGanancia(): number {
      return this.margenDeGanancia;
    }

    // Setter para 'margenDeGanancia'
    setMargenDeGanancia(margenDeGanancia: number): void {
      this.margenDeGanancia = margenDeGanancia;
    }

    // Getter para 'tipoDetalle'
    getTipoDetalle(): TipoDeTalle {
      return this.tipoDetalle;
    }

    // Setter para 'tipoDetalle'
    setTipoDetalle(tipoDeTalle: TipoDeTalle): void {
      this.tipoDetalle = tipoDeTalle;
    }

    // Getter para 'categoria'
    getCategoria(): Categoria {
      return this.categoria;
    }

    // Setter para 'categoria'
    setCategoria(categoria: Categoria): void {
      this.categoria = categoria;
    }

    // Getter para 'marca'
    getMarca(): Marca {
      return this.marca;
    }

    getEstado(){
      return this.estado;
    }

    // Setter para 'marca'
    setMarca(marca: Marca): void {
      this.marca = marca;
    }
    
      obtenerMontoNeto(): number {
        const montoNeto = this.costo + (this.costo * (this.margenDeGanancia / 100));
        return montoNeto;
      }
    
      obtenerMontoIVA(): number {
        const montoNeto = this.obtenerMontoNeto();
        const montoIVA = montoNeto * 0.21; 
        return montoIVA;
      }
    
      obtenerMontoTotal(): number {
        const montoNeto = this.obtenerMontoNeto();
        const montoIVA = this.obtenerMontoIVA();
        const montoTotal = montoNeto + montoIVA;
        return montoTotal;
      }
    }
    
import { Sucursal } from "./Sucursal";

export class PuntoDeVenta {
    private id : string
    private numero: number;
    private estado: string;
    private sucursal : Sucursal;
  
    constructor(id : string, numero: number,sucursal : Sucursal, estado : string) {
      this.id = id;
      this.numero = numero;
      this.estado = estado;
      this.sucursal = sucursal;
    }
  
    // Getter para número
    getNumero(): number {
      return this.numero;
    }
  
    // Setter para número
    setNumero(numero: number): void {
      this.numero = numero;
    }
  
    // Getter para estado
    getEstado(): string {
      return this.estado;
    }
  
    // Setter para estado
    setEstado(estado: string): void {
      if(estado = "disponible" || "ocupado"){
        this.estado = estado;
      }else console.error("estado incorrecto");

    }
    getId(){
      return this.id;
    }
    
  }
  
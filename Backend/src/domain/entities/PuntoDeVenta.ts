import { Sucursal } from "./Sucursal";

export class PuntoDeVenta {
    private numero: number;
    private estado: string;
    private sucursal : Sucursal;
  
    constructor(numero: number,sucursal : Sucursal) {
      this.numero = numero;
      this.estado = "disponible";
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
  }
  
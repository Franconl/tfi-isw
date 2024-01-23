export class PuntoDeVenta {
    private numero: number;
    private estado: string;
  
    constructor(numero: number) {
      this.numero = numero;
      this.estado = "disponible";
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
  
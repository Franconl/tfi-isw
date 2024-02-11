export class TipoDeTalle {
    private id : string;
    private nombre: string;
  
    constructor(id : string, nombre: string) {
      this.id = id;
      this.nombre = nombre;
    }
  
    // Getter para 'nombre'
    getNombre(): string {
      return this.nombre;
    }
  
    // Setter para 'nombre'
    setNombre(nombre: string): void {
      this.nombre = nombre;
    }
  }
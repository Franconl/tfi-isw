export class Categoria {
    private id: string;
    private nombre: string;
  
    constructor(id: string, nombre: string) {
      this.id = id;
      this.nombre = nombre;
    }
  
    // Getter para 'id'
    getId(): string {
      return this.id;
    }
  
    // Setter para 'id'
    setId(id: string): void {
      this.id = id;
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
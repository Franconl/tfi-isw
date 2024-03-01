export class Sucursal {
    private id : string;
    private nombre : string;
    private ciudad : string;
    private telefono : number;
    
    constructor(id: string, nombre : string, ciudad : string, telefono : number){
        this.id = id;
        this.ciudad = ciudad;
        this.nombre = nombre;
        this.telefono = telefono;
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
  
    // Getter para 'ciudad'
    getCiudad(): string {
      return this.ciudad;
    }
  
    // Setter para 'ciudad'
    setCiudad(ciudad: string): void {
      this.ciudad = ciudad;
    }
  
    // Getter para 'telefono'
    getTelefono(): number {
      return this.telefono;
    }
  
    // Setter para 'telefono'
    setTelefono(telefono: number): void {
      this.telefono = telefono;
    }

}
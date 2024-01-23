import { CondicionTributaria } from "./CondicionTributaria";

export class Cliente {
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private email: string;
  private domicilio: string;
  private dni: string;
  private condicion!: CondicionTributaria;

  constructor(nombre: string, apellido: string, telefono: string, email: string, domicilio: string, dni: string) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
    this.domicilio = domicilio;
    this.dni = dni;
  }

  // Getter para nombre
  getNombre(): string {
    return this.nombre;
  }

  // Setter para nombre
  setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  // Getter para apellido
  getApellido(): string {
    return this.apellido;
  }

  // Setter para apellido
  setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  // Getter para telefono
  getTelefono(): string {
    return this.telefono;
  }

  // Setter para telefono
  setTelefono(telefono: string): void {
    this.telefono = telefono;
  }

  // Getter para email
  getEmail(): string {
    return this.email;
  }

  // Setter para email
  setEmail(email: string): void {
    this.email = email;
  }

  // Getter para domicilio
  getDomicilio(): string {
    return this.domicilio;
  }

  // Setter para domicilio
  setDomicilio(domicilio: string): void {
    this.domicilio = domicilio;
  }

  // Getter para dni
  getDni(): string {
    return this.dni;
  }

  // Setter para dni
  setDni(dni: string): void {
    this.dni = dni;
  }
  //Setter Condicion
  setCondicionTributaria(condicionTributaria: CondicionTributaria): void{
    this.condicion = condicionTributaria;
  }
  //getter condicion
  getCondicionTributaria(): CondicionTributaria {
    return this.condicion;
  }
}

import { CondicionTributaria } from "./CondicionTributaria";
import { v4 as uuid } from "uuid";

export class Cliente {
  private id : string;
  private nombre: string;
  private apellido: string;
  private telefono: string;
  private email: string;
  private domicilio: string;
  private dni?: number;
  private condicion!: CondicionTributaria;
  private cuil? : number;
  private cuit? : number;

  constructor(nombre: string, apellido: string, telefono: string, email: string, domicilio: string, options: { dni?: number; cuil?: number; cuit?: number }) {
    this.id = uuid();
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
    this.domicilio = domicilio;
    this.dni = options.dni; 
    this.cuil = options.cuil;  
    this.cuit = options.cuit;
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
  getDni(): any {
    return this.dni;
  }

  // Setter para dni
  setDni(dni: number): void {
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

  setCuit(cuit : number) : void {
    this.cuil = cuit;
  }

  getCuit() : any {
    return this.cuit;
  }

  setCuil(cuil : number) : void {
    this.cuil = cuil;
  }

  getCuil() : any {
    return this.cuit;
  }


}

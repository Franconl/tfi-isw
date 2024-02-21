import { Cliente } from "../entities/Cliente";

export interface IClienteRepository {
  crearCliente(nuevoCliente: Cliente): Promise<any>;
  obtenerClientePorDni(Dni : number): Promise<any>;
  actualizarCliente(id: string, nuevosDatos: any): Promise<boolean>;
  eliminarCliente(id: string): Promise<boolean>;
}
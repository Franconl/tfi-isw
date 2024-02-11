import { Cliente } from "../entities/Cliente";

export interface IClienteRepository {
  buscarCliente(criterios: { dni?: number }): Promise<Cliente | null>;
}
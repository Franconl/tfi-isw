import { Cliente } from "../entities/Cliente";

export interface IClienteRepository {
  buscarCliente(criterios: { dni?: string }): Promise<Cliente | null>;
}
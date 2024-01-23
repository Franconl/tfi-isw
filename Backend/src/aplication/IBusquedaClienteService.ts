import { Cliente } from "../domain/entities/Cliente";

export interface IBusquedaClienteService {
  buscarCliente(criterios: { dni?: string }): Promise<Cliente | null>;
}

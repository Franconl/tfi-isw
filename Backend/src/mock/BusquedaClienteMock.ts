/*import { Cliente } from "../domain/entities/Cliente";
import { IClienteRepository } from "../domain/repositories/IClienteRepository";

class ServicioBusquedaClientesMock implements IClienteRepository {
  private clientes: Cliente[];

  constructor() {
    this.clientes = [
      new Cliente("Generico", "-", "-", "-", "-", {"11111111"}),
      new Cliente("Jane", "Smith", "987654321", "jane.smith@example.com", "456 Oak St", "98765432"),
      // Agrega más instancias de Cliente según sea necesario
    ];
  }

  async buscarCliente(criterios: { dni?: string }): Promise<Cliente | null> {
    // Implementación de búsqueda según los criterios
    const clientesEncontrados = this.clientes.filter((cliente) =>
      cliente.getDni().includes(criterios.dni ?? '')
    );
  
    // Devolver el primer cliente encontrado o null si no hay resultados
    return clientesEncontrados.length > 0 ? clientesEncontrados[0] : null;
  }

}

export default ServicioBusquedaClientesMock; */

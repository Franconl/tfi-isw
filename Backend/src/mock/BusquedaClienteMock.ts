import { Cliente } from "../domain/entities/Cliente";
import { IClienteRepository } from "../domain/repositories/IClienteRepository";

export class ServicioBusquedaClientesMock implements IClienteRepository {
  

  buscarCliente(criterios: { dni?: number }): Promise<Cliente | null> {
     const cliente = new Cliente("Generico", "-", "-", "-", "-", {dni : 1234, cuit :1234, cuil : 12})

    if(criterios.dni == cliente.getDni()){
      return Promise.resolve(cliente);
    }else return Promise.resolve(null);

  }
}

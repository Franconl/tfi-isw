import { Venta } from "../domain/entities/Venta";
import { Cliente } from "../domain/entities/Cliente";
import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { Usuario } from "../domain/entities/Usuario"
import { IBusquedaClienteService } from "./IBusquedaClienteService";

export class VentaService {
  private servicioBusquedaClientes: IBusquedaClienteService;

  constructor(servicioBusquedaClientes: IBusquedaClienteService) {
    this.servicioBusquedaClientes = servicioBusquedaClientes;
  }
  // Otros métodos del servicio

  public crearNuevaVenta(usuario: Usuario, cliente : Cliente, condicionTributariaEmpresa: CondicionTributaria): Venta {
    // Crear una nueva venta

    const nuevaVenta = new Venta(usuario, cliente);

    // Determinar el tipo de comprobante según la condición tributaria del cliente y la empresa
    const tipoDeComprobante = this.determinarTipoDeComprobante(cliente.getCondicionTributaria(), condicionTributariaEmpresa);

    // Asignar el tipo de comprobante a la venta
    nuevaVenta.setTipoDeComprobante(tipoDeComprobante);

    return nuevaVenta;
  }

  //Método para determinar el tipo de comprobante
  private determinarTipoDeComprobante(condicionTributariaCliente: CondicionTributaria, condicionTributariaEmpresa: CondicionTributaria): TipoDeComprobante {

    var tipo : TipoDeComprobante = TipoDeComprobante.FACTURA_B;

    if(condicionTributariaEmpresa === CondicionTributaria.RESPONSABLE_INSCRIPTO){

      switch(condicionTributariaCliente){
        case CondicionTributaria.CONSUMIDOR_FINAL:
          tipo = TipoDeComprobante.FACTURA_B;
          break;
        case CondicionTributaria.MONOTRIBUTO:
          tipo = TipoDeComprobante.FACTURA_A;
          break;
      }
    }
    return tipo;
  }
}

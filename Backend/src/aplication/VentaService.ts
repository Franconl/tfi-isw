import { Venta } from "../domain/entities/Venta";
import { Cliente } from "../domain/entities/Cliente";
import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { Usuario } from "../domain/entities/Usuario";
import { IClienteRepository } from "../domain/repositories/IClienteRepository";
import { Articulo } from "../domain/entities/Articulo";
import { IArticuloRepository } from "../domain/repositories/IArticuloReposiroty";
import { Sesion } from "../domain/entities/Sesion";

export class VentaService {
  private clienteRepository: IClienteRepository;
  private articuloRepository: IArticuloRepository;
  private sesion : Sesion;

  constructor(clienteRepository: IClienteRepository, articuloRepository : IArticuloRepository, sesion : Sesion) {
    this.clienteRepository = clienteRepository;
    this.articuloRepository = articuloRepository;
    this.sesion = sesion;
  }

  public crearNuevaVenta( cliente : Cliente, condicionTributariaEmpresa: CondicionTributaria): Venta {
    // Crear una nueva venta
    
    const usuario = this.sesion.getUsuario();
    const puntoDeVenta = this.sesion.getPuntoDeVenta();

    const nuevaVenta = new Venta(usuario, cliente,puntoDeVenta);

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
        case CondicionTributaria.EXENTO:
          tipo = TipoDeComprobante.FACTURA_B;
          break;
        case CondicionTributaria.NO_RESPONSABLE:
          tipo = TipoDeComprobante.FACTURA_B;
          break;
        case CondicionTributaria.RESPONSABLE_INSCRIPTO:
          tipo = TipoDeComprobante.FACTURA_A;
          break;
      }
    } else {console.error('error al obtener la condicion tributaria de la tienda')}
    return tipo;
  }

}

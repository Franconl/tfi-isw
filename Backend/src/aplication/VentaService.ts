import { Venta } from "../domain/entities/Venta";
import { Cliente } from "../domain/entities/Cliente";
import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { Usuario } from "../domain/entities/Usuario";
import { IClienteRepository } from "../domain/repositories/IClienteRepository";
import { Articulo } from "../domain/entities/Articulo";
import { IArticuloRepository } from "../domain/repositories/IArticuloReposiroty";
import { Sesion } from "../domain/entities/Sesion";
import { Inventario } from "../domain/entities/Inventario";
import { LineaDeVenta } from "../domain/entities/LineaDeVenta";

export class VentaService {
  private clienteRepository: IClienteRepository;
  private articuloRepository: IArticuloRepository;
  private sesion : Sesion;
  private venta! : Venta;

  constructor(clienteRepository: IClienteRepository, articuloRepository : IArticuloRepository, sesion : Sesion) {
    this.clienteRepository = clienteRepository;
    this.articuloRepository = articuloRepository;
    this.sesion = sesion;
  }

  public setSesion(sesion : Sesion){
    this.sesion = sesion;
  }

  public async crearNuevaVenta( dni : number): Promise<Venta | void>{
    // Crear una nueva venta
    try{
      console.log("sesion: ", this.sesion);
      const cliente = await this.clienteRepository.buscarCliente({dni});

      if(cliente){
        const usuario = this.sesion.getUsuario();
        const puntoDeVenta = this.sesion.getPuntoDeVenta();

        const nuevaVenta = new Venta(usuario, cliente,puntoDeVenta);
        this.venta = nuevaVenta;

        // Determinar el tipo de comprobante según la condición tributaria del cliente y la empresa
        const condicionTributariaEmpresa : CondicionTributaria = CondicionTributaria.RESPONSABLE_INSCRIPTO; 
        const tipoDeComprobante = this.determinarTipoDeComprobante(cliente.getCondicionTributaria(), condicionTributariaEmpresa);

        // Asignar el tipo de comprobante a la venta
        nuevaVenta.setTipoDeComprobante(tipoDeComprobante);

        return nuevaVenta;
      }
    }catch(error){
      console.error('DNI de cliente no registrado');
    }
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
  
  public seleccionarArticulo(inventario : Inventario, cantidad : number) : void{
    const precio = inventario.getArticulo().obtenerMontoTotal();
    const lineadeVenta = new LineaDeVenta(inventario, cantidad, precio);
    this.venta.agregarLineaDeVenta(lineadeVenta);
  }

  public async buscarArticulo(codigo : string) : Promise<Inventario[] | null>{
    try{
      console.log('llega hasta aca')
      const articulo = await this.articuloRepository.buscarArticulo({codigo});

      if(articulo){
        try{
          const inventario : Inventario[] | null = await this.articuloRepository.buscarInventario({articulo});
          if (inventario){
            return inventario;
          }else return null;

        }catch(error){
          console.error('error al buscar inventario',error);
          return null;
        }
      } else{
        console.warn('No se encontro articulo con ese codigo');
        return null;
      }
    }catch(error){
      console.error('error al buscar el articulo', error);
      return null;
    }
  }
  
}

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
import { ConexionAfipService } from "./ConexionAfipService";
import { Sucursal } from "../domain/entities/Sucursal";

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

  public getSesion() : Sesion{
    return this.sesion;
  }

  public getVenta() : Venta{
    return this.venta;
  }

  public async crearNuevaVenta( dni : number): Promise<Venta | null>{
    // Crear una nueva venta
    try{
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
      }else{
        console.error('Cliente no encontrado');
        return null;
      }
    }catch(error){
      console.error('error al buscar cliente');
      return null;
    }
  }

  //Método para determinar el tipo de comprobante
  private determinarTipoDeComprobante(condicionTributariaCliente: CondicionTributaria, condicionTributariaEmpresa: CondicionTributaria): TipoDeComprobante {

    var tipo : TipoDeComprobante = TipoDeComprobante.FACTURA_B;

    if(condicionTributariaEmpresa == CondicionTributaria.RESPONSABLE_INSCRIPTO){

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
  
  public async seleccionarArticulo(id : string, cantidad : number) : Promise<LineaDeVenta[] | null>{
    try{
       
      const inventario = await this.articuloRepository.busarInventarioId({id});

      if(inventario && inventario.getCantidad() > 0){
        
        const precio = inventario.getArticulo().obtenerMontoTotal();
        const lineadeVenta = new LineaDeVenta(inventario, cantidad, precio);

        this.venta.agregarLineaDeVenta(lineadeVenta);

        inventario.setCantidad(inventario.getCantidad() - 1);

        return this.venta.getLineaDeVenta();
      }else{
        console.error('error: inventario invalido o sin stock');
        return null;
      }
    }catch(error){
      throw error;
    }
  }

  public async buscarArticulo(codigo : string) : Promise<Inventario[] | null>{
    try{
      const sucursalId = this.sesion.getSucursal().getId()
      const articulo = await this.articuloRepository.buscarArticulo({codigo,sucursalId});

      if(articulo){
        try{
          const inventario : Inventario[] | null = await this.articuloRepository.buscarInventario({articulo});
          if (inventario){
            return inventario;
          }else{
            console.error('No se encontro inventario');
            return null;
          } 

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

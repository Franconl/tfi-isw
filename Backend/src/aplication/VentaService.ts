import { Venta } from "../domain/entities/Venta";
import { Cliente } from "../domain/entities/Cliente";
import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { Usuario } from "../domain/entities/Usuario";
import { IClienteRepository } from "../domain/interfaces/IClienteRepository";
import { Articulo } from "../domain/entities/Articulo";
import { IArticuloRepository } from "../domain/interfaces/IArticuloReposiroty";
import { Sesion } from "../domain/entities/Sesion";
import { Inventario } from "../domain/entities/Inventario";
import { LineaDeVenta } from "../domain/entities/LineaDeVenta";
//import { ConexionAfipService } from "./ConexionAfipService";
import { Sucursal } from "../domain/entities/Sucursal";
import { IVentaRepository } from "../domain/interfaces/IVentaRepository";
import { Comprobante } from "../domain/entities/Comprobante";
import { Pago } from "../domain/entities/Pago";

export class VentaService {
  private clienteRepository: IClienteRepository;
  private articuloRepository: IArticuloRepository;
  private ventaRepository : IVentaRepository;
  private sesion : Sesion;
  private venta! : Venta | undefined;

  constructor(clienteRepository: IClienteRepository, articuloRepository : IArticuloRepository, sesion : Sesion, ventaRepo : IVentaRepository) {
    this.clienteRepository = clienteRepository;
    this.articuloRepository = articuloRepository;
    this.ventaRepository = ventaRepo;
    this.sesion = sesion;
  }

  public setSesion(sesion : Sesion){
    this.sesion = sesion;
  }

  public getSesion() : Sesion{
    return this.sesion;
  }

  public getVenta(){
    if(this.venta){
      return this.venta;
    }
    console.error('Venta no creada');
  }

  public resetVenta() : void{
    this.venta = undefined;
  }

  public async crearNuevaVenta( dni : number): Promise<Venta | null>{
    // Crear una nueva venta
    try{
      const cliente = await this.clienteRepository.obtenerClientePorDni(dni);
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
  
  public async seleccionarInventario(id : string, cantidad : number) : Promise<LineaDeVenta[] | null>{
    try{
       
      const inventario = await this.articuloRepository.busarInventarioId({id});

      if(inventario && inventario.getCantidad() > 0){


        if(this.venta){

          inventario.setCantidad(inventario.getCantidad() - cantidad);

          await this.articuloRepository.setInventarioCantidad(id,inventario.getCantidad());

          const precio = inventario.getArticulo().obtenerMontoTotal();
          const lineadeVenta = new LineaDeVenta(inventario, cantidad, precio);

          this.venta.agregarLineaDeVenta(lineadeVenta);

          return this.venta.getLineaDeVenta();

        }else{
          console.error('Venta no creada');
          return null;
        }
      }else{
        console.error('error: inventario invalido o sin stock');
        return null;
      }
    }catch(error){
      throw error;
    }
  }

  
  public async finalizarVenta(){
    if(this.venta){
      const venta = this.venta
      venta.setEstado("Aprobado");
      const response = await this.ventaRepository.insertVenta({ venta });
      this.resetVenta();
      return response;
    }
  }


  public crearComprobante(cae : string){
      if(this.venta){
        const comprobante = new Comprobante(this.venta.getTipoDeComprobante(),
        this.venta.getLineaDeVenta(),this.venta.getCliente(), cae)

        this.venta.setComprobante(comprobante);

        console.log('Comprobante creado');
      }
    }

    public async setCliente(dni : number){
      try{
        const cliente = await this.clienteRepository.obtenerClientePorDni(dni);

        this.venta?.setCliente(cliente);

        const condicionTributariaEmpresa : CondicionTributaria = CondicionTributaria.RESPONSABLE_INSCRIPTO; 
        const tipoDeComprobante = this.determinarTipoDeComprobante(cliente.getCondicionTributaria(), condicionTributariaEmpresa);

        // Asignar el tipo de comprobante a la venta
        this.venta?.setTipoDeComprobante(tipoDeComprobante);
        console.log('Cliente asignado Correctamente');
        return cliente;
      }catch(error){
        console.error('error al buscar cliente');
        return null;
      }
    }

    public async crearCliente(cliente : Cliente){
      try{
        const response = await this.clienteRepository.crearCliente(cliente);
        if(!cliente){
          return null;
        }
        return response;
      }catch(error){
        console.error('error al buscar cliente');
        return null;
      }
    }

    public setPago(tipo : string){
      const cliente = this.venta?.getCliente();
      const monto = this.venta?.getImporteTotal();
      if(!cliente || !monto){
        return null;
      }
      const pago = new Pago(cliente,monto,tipo);

      this.venta?.setPago(pago);

      return pago;
    }
    
}

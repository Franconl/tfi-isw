import { Venta } from "../domain/entities/Venta";
import { Cliente } from "../domain/entities/Cliente";
import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { IClienteRepository } from "../domain/interfaces/IClienteRepository";
import { IArticuloRepository } from "../domain/interfaces/IArticuloReposiroty";
import { Sesion } from "../domain/entities/Sesion";
import { LineaDeVenta } from "../domain/entities/LineaDeVenta";
import { IVentaRepository } from "../domain/interfaces/IVentaRepository";
import { Comprobante } from "../domain/entities/Comprobante";
import { Pago } from "../domain/entities/Pago";
import { sesion } from "../infrastructure/routes/auth.routes";

export class VentaService {
  private clienteRepository: IClienteRepository;
  private articuloRepository: IArticuloRepository;
  private ventaRepository : IVentaRepository;
  private venta! : Venta | undefined;

  constructor(clienteRepository: IClienteRepository, articuloRepository : IArticuloRepository, sesion : Sesion, ventaRepo : IVentaRepository) {
    this.clienteRepository = clienteRepository;
    this.articuloRepository = articuloRepository;
    this.ventaRepository = ventaRepo;
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
        const usuario = sesion.getUsuario()
        const puntoDeVenta = sesion.getPuntoDeVenta();

        const nuevaVenta = new Venta(usuario, cliente,puntoDeVenta);
        this.venta = nuevaVenta;

        // Determinar el tipo de comprobante según la condición tributaria del cliente y la empresa
        const condicionTributariaEmpresa : CondicionTributaria = CondicionTributaria.RESPONSABLE_INSCRIPTO; 
        const tipoDeComprobante = await this.determinarTipoDeComprobante(cliente.getCondicionTributaria());

        if(!tipoDeComprobante){
          console.error('error al determinar tipo de comprobante')
          return null;
        }

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
  private async determinarTipoDeComprobante(condicionTributariaCliente: CondicionTributaria): Promise<TipoDeComprobante | null> {

    try{
      const condicionTienda = sesion.getCondicionTienda();
      const response : TipoDeComprobante = await this.ventaRepository.obtenerTipoComprobante(condicionTienda,condicionTributariaCliente);
      if(!response){
        console.error('error al obtener tipo de comprobante');
        return null;
      }
      return response;
    }catch{
      console.error('error al obtener tipo de comprobante');
      return null;
    }
    
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
        const cliente : Cliente = await this.clienteRepository.obtenerClientePorDni(dni);

        this.venta?.setCliente(cliente);

        const tipoDeComprobante = await this.determinarTipoDeComprobante(cliente.getCondicionTributaria());

        if(!tipoDeComprobante){
          console.error('error al determinar tipo de comprobante')
          return null;
        }

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

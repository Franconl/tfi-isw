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
import { IUsuarioRepository } from "../domain/interfaces/IUsuarioRepository";
import { ConexionAfipService } from "./ConexionAfipService";
import { TarjetaData } from "../domain/entities/TarjetaData";
import { ConexionTarjetaService } from "./ConexionSistTarjetaService";
import { IConexionAfipService } from "../domain/interfaces/IConexionAfipService";

export class VentaService {
  private clienteRepository: IClienteRepository;
  private articuloRepository: IArticuloRepository;
  private ventaRepository : IVentaRepository;
  private conexionAfipService : IConexionAfipService;
  private usuarioRepository : IUsuarioRepository;

  constructor(usuarioRepo : IUsuarioRepository, clienteRepository: IClienteRepository, articuloRepository : IArticuloRepository, ventaRepo : IVentaRepository, conexionAfip : IConexionAfipService) {
    this.clienteRepository = clienteRepository;
    this.articuloRepository = articuloRepository;
    this.ventaRepository = ventaRepo;
    this.usuarioRepository = usuarioRepo;
    this.conexionAfipService = conexionAfip;
  }


  public async crearNuevaVenta( dni : number , sesionId : string): Promise<any>{
    // Crear una nueva venta
    try{
      const cliente = await this.clienteRepository.obtenerClientePorDni(dni);
      const sesion = await this.usuarioRepository.obtenerSesion(sesionId);

      if(cliente && sesion){

        const token = await this.conexionAfipService.solicitarToken();
        const numeros = await this.conexionAfipService.solicitarUltimoComprobante(token);

        if(!token || !numeros){
          return null;
        }

        sesion.setTokenAfip(token);
        sesion.setNumeroComprobanteA(numeros.A);
        sesion.setNumeroComprobanteB(numeros.B);

        const usuario = sesion.getUsuario()
        const puntoDeVenta = sesion.getPuntoDeVenta();

        const nuevaVenta = new Venta(usuario, cliente,puntoDeVenta);

        const condicionTienda = sesion.getCondicionTienda();
        
        const tipoDeComprobante = await this.determinarTipoDeComprobante(cliente.getCondicionTributaria(), condicionTienda);

        if(!tipoDeComprobante){
          console.error('error al determinar tipo de comprobante')
          return null;
        }

        // Asignar el tipo de comprobante a la venta
        nuevaVenta.setTipoDeComprobante(tipoDeComprobante);
        nuevaVenta.setEstado('Pendiente');

        const venta = await this.ventaRepository.insertNuevaVenta({ venta : nuevaVenta})
        await this.usuarioRepository.guardarSesion(sesion);
        return {venta, sesion} ;
      }else{
        console.error('Cliente o Sesion no encontrada');
        return null;
      }
    }catch(error){
      console.error('error al buscar cliente y sesion');
      return null;
    }
  }

  //Método para determinar el tipo de comprobante
  private async determinarTipoDeComprobante(condicionTributariaCliente: CondicionTributaria,condicionTienda : CondicionTributaria): Promise<TipoDeComprobante | null> {

    try{
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
  
  public async seleccionarInventario(id : string, cantidad : number, ventaId : string) : Promise<LineaDeVenta[] | null>{
    try{
       
      const inventario = await this.articuloRepository.busarInventarioId({id});
      
      if(inventario && inventario.getCantidad() > 0 && inventario.getCantidad() >= cantidad){


          inventario.setCantidad(inventario.getCantidad() - cantidad);

          await this.articuloRepository.setInventarioCantidad(id,inventario.getCantidad());

          const precio = inventario.getArticulo().obtenerMontoTotal();

          const lineadeVenta = new LineaDeVenta(inventario, cantidad, precio);
          
          const ldv = await this.ventaRepository.insertLineaDeVenta(lineadeVenta,ventaId);
        
          return ldv;

      }else{
        console.error('error: inventario invalido o sin stock');
        return null;
      }
    }catch(error){
      throw error;
    }
  }

  
  public async finalizarVenta(ventaId : string){
      try{
        const venta = await this.ventaRepository.insertVenta(ventaId);
        return venta;
      }catch(error){
        throw error;
      }
    }
  
  public async finalizarSeleccion(ventaId : string, sesionId : string){
    try{
      const venta = await this.ventaRepository.obtenerVenta(ventaId);
      const sesion = await this.usuarioRepository.obtenerSesion(sesionId);

      if(!venta || !sesion){
        console.error('venta o sesion no encontrada', ventaId , sesionId, venta ,sesion)
        return null;
      }

      const response = await this.conexionAfipService.solicitarCae(venta, sesion);

      if(!response.cae || !response){
        return null;
      }
      
      const nuevaVenta = await this.crearComprobante(response.cae, venta);

      return {response, nuevaVenta};

    }catch(error){
      console.error('error al solicitar cae y crear comprobante')
      return null;
    }
  }

  private async crearComprobante(cae : string, venta : Venta){

    const ldv = venta.getLineaDeVenta();
    const cliente = venta.getCliente();
    const tipo = venta.getTipoDeComprobante()
    

    const comprobante = new Comprobante(tipo,ldv,cliente,cae);
    venta.setComprobante(comprobante);

    await this.ventaRepository.insertComprobante(comprobante,venta.getId());

    return venta;
  }

    public async setCliente(sesionId : string, ventaId : string,dni : number){
      try{
        
        const cliente : Cliente = await this.clienteRepository.obtenerClientePorDni(dni);
        const sesion = await this.usuarioRepository.obtenerSesion(sesionId);
        if(!sesion || !cliente){
          console.error('error al buscar cliente y sesion para settear cliente')
          return null
        }
        const tipoDeComprobante = await this.determinarTipoDeComprobante(cliente.getCondicionTributaria(),sesion?.getCondicionTienda());

        if(!tipoDeComprobante){
          console.error('error al determinar tipo de comprobante')
          return null;
        }

        await this.ventaRepository.setCliente(ventaId,cliente,tipoDeComprobante);
        const ventaCliente = await this.ventaRepository.obtenerVenta(ventaId);
        console.log('Cliente asignado Correctamente');
        return ventaCliente;
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

    public async setPago(ventaId : string, tipo : string){
      try{
        const pago =  await this.ventaRepository.insertPago(ventaId,tipo)

        return pago;
      }catch(error){
        console.error('error al crear pago');
        return null;
      }
    } 

    public async solicitarTokenTarjeta(tarjetaData : TarjetaData , sesionId : string){
      try{
        const sistemaTarjeta = new ConexionTarjetaService();

        const token = await sistemaTarjeta.solicitarToken(tarjetaData);
        const sesion = await this.usuarioRepository.obtenerSesion(sesionId);

        if(!sesion || !token){
          console.error('error al obtener sesion para alamcenar token');
          return null;
        }

        sesion.setTokenTarjeta(token);

        const sesionGuardada = await this.usuarioRepository.guardarSesion(sesion);

        return sesionGuardada;

      }catch(error){
        console.error('error al solicitar token de pago con tarjeta');
        return null;
      }
      
      
    }

    public async confirmarPagoTarjeta(sesionId : string, ventaId : string){
      
      try{
        const venta = await this.ventaRepository.obtenerVenta(ventaId);
        const sesion = await this.usuarioRepository.obtenerSesion(sesionId);

        if(!venta || !sesion){
          console.error('error al buscar venta y sesion para confirmar pago con tarjeta',ventaId, venta)
          return null;
        }

        const sistemaTarjeta = new ConexionTarjetaService()
        const response = await sistemaTarjeta.confirmarPago(sesion.getTokenTarjeta(),venta.getMonto(),venta.getId())

        console.log('Pago con tarjeta confirmado')
        return response;
      }catch(error){
        console.error('error al confirmar pago con tarjeta');
      }
    }
    
}

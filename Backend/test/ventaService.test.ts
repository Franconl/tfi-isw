import { VentaService } from "../src/aplication/VentaService";
import { Cliente } from "../src/domain/entities/Cliente";
import { CondicionTributaria } from "../src/domain/entities/CondicionTributaria";
import { TipoDeComprobante } from "../src/domain/entities/TipoDeComprobante";
import { IClienteRepository } from "../src/domain/interfaces/IClienteRepository";
import { IArticuloRepository } from "../src/domain/interfaces/IArticuloReposiroty";
import { IVentaRepository } from "../src/domain/interfaces/IVentaRepository";
import { IUsuarioRepository } from "../src/domain/interfaces/IUsuarioRepository";
import { Sesion } from "../src/domain/entities/Sesion";
import { Usuario } from "../src/domain/entities/Usuario";
import { PuntoDeVenta } from "../src/domain/entities/PuntoDeVenta";
import { Sucursal } from "../src/domain/entities/Sucursal";
import { IConexionAfipService } from "../src/domain/interfaces/IConexionAfipService";
import { Venta } from "../src/domain/entities/Venta";
import { Comprobante } from "../src/domain/entities/Comprobante";
import { Inventario } from "../src/domain/entities/Inventario";
import { Talle } from "../src/domain/entities/Talle";
import { TipoDeTalle } from "../src/domain/entities/TipoDeTalle";
import { Color } from "../src/domain/entities/Color";
import { Articulo } from "../src/domain/entities/Articulo";
import { Categoria } from "../src/domain/entities/Categoria";
import { Marca } from "../src/domain/entities/Marca";
import { LineaDeVenta } from "../src/domain/entities/LineaDeVenta";

const clienteMock: Cliente = new Cliente('Lionel','Messi','453134','messileo@gmail.com','calle 123',CondicionTributaria.CONSUMIDOR_FINAL, {dni : 34232312});
const usuarioMock = new Usuario('123124','Jose','Jose','user');
const sucursalMock = new Sucursal('1234', 'Centro', 'San miguel de Tucuman', 423452);
const puntoDeVentaMock = new PuntoDeVenta('1234', 1 , sucursalMock, 'diponible');
const sesionMock = new Sesion(usuarioMock,puntoDeVentaMock);
const tipoDeComprobanteMock = new TipoDeComprobante('1234','FacturaB',CondicionTributaria.RESPONSABLE_INSCRIPTO,[CondicionTributaria.MONOTRIBUTO,CondicionTributaria.CONSUMIDOR_FINAL])
const mockVenta = new Venta(usuarioMock,clienteMock,puntoDeVentaMock);
const tipoTalleMock = new TipoDeTalle('1234','EU');
const talleMock = new Talle('45',tipoTalleMock);
const colorMock = new Color('1234','rojo');
const categoriaMock = new Categoria('1234','remera');
const marcaMock = new Marca('1234','nike');
const articuloMock = new Articulo('1234','remera algodon',2000,20,tipoTalleMock,categoriaMock,marcaMock,'disponible');
const inventarioMock = new Inventario('1234',45,articuloMock,talleMock,colorMock,sucursalMock);

mockVenta.setTipoDeComprobante(tipoDeComprobanteMock);
// Mocks de los repositorios y servicio
const mockClienteRepository: IClienteRepository = {
  crearCliente: jest.fn(),
  obtenerClientePorDni: jest.fn().mockResolvedValue(clienteMock),
  actualizarCliente: jest.fn(),
  eliminarCliente: jest.fn(),
};

const mockArticuloRepository: IArticuloRepository = {
    busarInventarioId: jest.fn().mockResolvedValue(inventarioMock),
    buscarArticulo: jest.fn(),
    buscarInventario: jest.fn(),
    crear: jest.fn(),
    crearTipoDeTalle: jest.fn(),
    buscarTipoDeTalle: jest.fn(),
    buscarTiposDeTalle: jest.fn(),
    crearMarca: jest.fn(),
    buscarMarca: jest.fn(),
    buscarMarcas: jest.fn(),
    crearCategoria: jest.fn(),
    buscarCategoria: jest.fn(),
    buscarCategorias: jest.fn(),
    buscarColor: jest.fn(),
    buscarSucursal: jest.fn(),
    buscarSucursales: jest.fn(),
    buscarTalle: jest.fn(),
    buscarTalles: jest.fn(),
    buscarPuntoDeVenta: jest.fn(),
    buscarPuntosDeVentas: jest.fn(),
    setPdvOcupado: jest.fn(),
    setInventarioCantidad: jest.fn(),
    modificarArticulo: jest.fn(),
    eliminarArticulo: jest.fn(),
};

const mockVentaRepository: IVentaRepository = {
    insertVenta: jest.fn(),
    insertPago: jest.fn(),
    insertComprobante: jest.fn((comprobante : Comprobante) => Promise.resolve(comprobante)),
    obtenerTipoComprobante: jest.fn().mockResolvedValue(tipoDeComprobanteMock),
    insertNuevaVenta: jest.fn((criterios:{venta : Venta}) => Promise.resolve(criterios.venta)),
    obtenerVenta: jest.fn().mockResolvedValue(mockVenta),
    insertLineaDeVenta: jest.fn((ldv,ventaid) => Promise.resolve([ldv])),
    setCliente: jest.fn(),
};

const mockUsuarioRepository: IUsuarioRepository = {
  crearUsuario: jest.fn(),
  obtenerUsuarioPorUsuario: jest.fn(),
  eliminarUsuario: jest.fn(),
  obtenerCondicionTienda: jest.fn().mockResolvedValue(CondicionTributaria.RESPONSABLE_INSCRIPTO),
  guardarSesion: jest.fn(),
  crearNuevaSesion: jest.fn(),
  obtenerSesion: jest.fn().mockResolvedValue(sesionMock),
  setPuntoDeVentaOcupado: jest.fn(),
  cerrarSesion: jest.fn(),
};

const mockConexionAfipService: IConexionAfipService = {
  solicitarToken: jest.fn().mockResolvedValue('token AFIP'),
  solicitarUltimoComprobante: jest.fn().mockResolvedValue({ A : 1 , B : 2}),
  solicitarCae: jest.fn().mockResolvedValue({cae : '1223234'})
};


describe('VentaService', () => {
  let ventaService: VentaService;

  beforeEach(() => {
    ventaService = new VentaService(
      mockUsuarioRepository,
      mockClienteRepository,
      mockArticuloRepository,
      mockVentaRepository,
      mockConexionAfipService
    );
  });


  describe('crearNuevaVenta', () => {

    test('deberia crearse una nueva venta y solicitar token y ultimos comprobantes correctamente', async () => {

      const result = await ventaService.crearNuevaVenta(1234,'1234');

      // Verificar resultados
      expect(result).toBeDefined();
      expect(result.venta).toBeDefined();
      expect(result.sesion).toBeDefined();
      expect(mockVentaRepository.obtenerTipoComprobante).toBeCalled();
      expect(result.venta.getCliente()).toBe(clienteMock),
      expect(result.venta.getTipoDeComprobante().getDescripcion()).toBe('FacturaB');
      expect(mockConexionAfipService.solicitarToken).toBeCalled();
      expect(result.sesion.getTokenAfip()).toBe('token AFIP');
      expect(result.sesion.getNumeroComprobanteA()).toBe(1);
      expect(result.sesion.getNumeroComprobanteB()).toBe(2);
      
    });
    
  });

  describe('finalizarSeleccion', () =>{

    test('No deberia crearse el comprobante al no recibir CAE', async () => {
      mockConexionAfipService.solicitarCae = jest.fn().mockResolvedValue(null);

      const result = await ventaService.finalizarSeleccion('','');

      expect(result).toBeNull();
      expect(result?.nuevaVenta.getComprobante()).toBeUndefined();
      expect(mockVentaRepository.insertComprobante).toBeCalledTimes(0);
    });

    test('deberia finalizar la seleccion de articulos correctamente y crear comprobante', async () => {
      mockConexionAfipService.solicitarCae = jest.fn().mockResolvedValue({cae : '1223234'});

      const result = await ventaService.finalizarSeleccion('asdas','asdasd');

      expect(result).toBeDefined();
      expect(result?.nuevaVenta).toBeDefined();
      expect(result?.response).toBeDefined();
      expect(result?.response.cae).toBe('1223234');
      expect(result?.nuevaVenta.getComprobante().getTipo().getDescripcion()).toBe('FacturaB');
      expect(result?.nuevaVenta.getComprobante().getCae()).toBe('1223234');
      expect(result?.nuevaVenta.getComprobante().getCliente()).toBe(clienteMock);
      expect(mockVentaRepository.insertComprobante).toBeCalled();

    });

  });

  describe('seleccionarInventario', () =>{

    test('No deberia seleccionarse inventario al obtener un inventario con cantidad menor a la requerida' , async () =>{

      const result = await ventaService.seleccionarInventario('1234', 50, '1234');
      expect(result).toBeNull();
      expect(mockVentaRepository.insertLineaDeVenta).toBeCalledTimes(0);

    })

    test('Deberia seleccionarse el inventario correctamente y devolver la linea de venta', async () => {

      const result = await ventaService.seleccionarInventario('1234',2,'1234');

      if(!result){
        throw console.error('error al obtener ldv');
      }

      expect(result).toBeDefined();

      result.forEach(ldv => {
        expect(ldv.getCantidad()).toBe(2);
        expect(ldv.getPrecioUnitario()).toBe(articuloMock.obtenerMontoTotal());
        expect(ldv.getInventario()).toBe(inventarioMock);
      });

      expect(mockVentaRepository.insertLineaDeVenta).toBeCalled();
    });

  });

});

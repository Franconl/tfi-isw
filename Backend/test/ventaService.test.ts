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

const clienteMock: Cliente = new Cliente('Lionel','Messi','453134','messileo@gmail.com','calle 123',CondicionTributaria.CONSUMIDOR_FINAL, {dni : 34232312});
const usuarioMock = new Usuario('123124','Jose','Jose','user');
const sucursalMock = new Sucursal('1234', 'Centro', 'San miguel de Tucuman', 423452);
const puntoDeVentaMock = new PuntoDeVenta('1234', 1 , sucursalMock, 'diponible');
const sesionMock = new Sesion(usuarioMock,puntoDeVentaMock);

const tipoDeComprobanteMock = new TipoDeComprobante('1234','FacturaB',CondicionTributaria.RESPONSABLE_INSCRIPTO,[CondicionTributaria.MONOTRIBUTO,CondicionTributaria.CONSUMIDOR_FINAL])
const mockVenta = new Venta(usuarioMock,clienteMock,puntoDeVentaMock);

mockVenta.setTipoDeComprobante(tipoDeComprobanteMock);
// Mocks de los repositorios
const mockClienteRepository: IClienteRepository = {
  crearCliente: jest.fn(),
  obtenerClientePorDni: jest.fn().mockResolvedValue(clienteMock),
  actualizarCliente: jest.fn(),
  eliminarCliente: jest.fn(),
};

const mockArticuloRepository: IArticuloRepository = {
    busarInventarioId: jest.fn(),
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
    insertLineaDeVenta: jest.fn(),
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
    test('debería crear una nueva venta correctamente', async () => {

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
    test('finalizar la seleccion de articulos correctamente', async () => {

      const result = await ventaService.finalizarSeleccion('asdas','asdasd');

      expect(result).toBeDefined();
      expect(result?.nuevaVenta).toBeDefined();
      expect(result?.response).toBeDefined();
      expect(result?.response.cae).toBe('1223234');
      expect(result?.nuevaVenta.getComprobante().getTipo().getDescripcion()).toBe('FacturaB');
      expect(result?.nuevaVenta.getComprobante().getCae()).toBe('1223234');
      expect(result?.nuevaVenta.getComprobante().getCliente()).toBe(clienteMock);
      expect(mockVentaRepository.insertComprobante).toBeCalled()

    });
  });

});

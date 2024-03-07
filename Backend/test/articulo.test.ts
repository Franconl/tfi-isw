const { Articulo } = require("../src/domain/entities/Articulo");
const { TipoDeTalle } = require("../src/domain/entities/TipoDeTalle");
const { Categoria } = require("../src/domain/entities/Categoria");
const { Marca } = require("../src/domain/entities/Marca");

describe('Articulo', () => {
  // Prueba para el constructor
  describe('constructor', () => {
    it('debería crear un nuevo artículo con los valores proporcionados', () => {
      const articulo = new Articulo('123', 'Descripción', 10, 0.1, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'disponible');
      expect(articulo.getCodigo()).toEqual('123');
      expect(articulo.getDescripcion()).toEqual('Descripción');
      expect(articulo.getCosto()).toEqual(10);
      expect(articulo.getMargenDeGanancia()).toEqual(0.1);
      expect(articulo.getTipoDetalle().getNombre()).toEqual('Talle');
      expect(articulo.getCategoria().getNombre()).toEqual('Categoría');
      expect(articulo.getMarca().getNombre()).toEqual('Marca');
      expect(articulo.getEstado()).toEqual('disponible');
    });
  });

  // Prueba para el método setCodigo
  describe('setCodigo', () => {
    it('debería establecer el código del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      articulo.setCodigo('456');
      expect(articulo.getCodigo()).toEqual('456');
    });
  });

  // Prueba para el método setDescripcion
  describe('setDescripcion', () => {
    it('debería establecer la descripción del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      articulo.setDescripcion('Nueva descripción');
      expect(articulo.getDescripcion()).toEqual('Nueva descripción');
    });
  });

  // Prueba para el método setCosto
  describe('setCosto', () => {
    it('debería establecer el costo del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      articulo.setCosto(20);
      expect(articulo.getCosto()).toEqual(20);
    });
  });

  // Prueba para el método setMargenDeGanancia
  describe('setMargenDeGanancia', () => {
    it('debería establecer el margen de ganancia del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      articulo.setMargenDeGanancia(0.2);
      expect(articulo.getMargenDeGanancia()).toEqual(0.2);
    });
  });

  // Prueba para el método setTipoDetalle
  describe('setTipoDetalle', () => {
    it('debería establecer el tipo de detalle del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      articulo.setTipoDetalle(new TipoDeTalle('2', 'Nuevo talle'));
      expect(articulo.getTipoDetalle().getNombre()).toEqual('Nuevo talle');
    });
  });

  // Prueba para el método setCategoria
  describe('setCategoria', () => {
    it('debería establecer la categoría del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      articulo.setCategoria(new Categoria('2', 'Nueva categoría'));
      expect(articulo.getCategoria().getNombre()).toEqual('Nueva categoría');
    });
  });

  // Prueba para el método setMarca
  describe('setMarca', () => {
    it('debería establecer la marca del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      articulo.setMarca(new Marca('2', 'Nueva marca'));
      expect(articulo.getMarca().getNombre()).toEqual('Nueva marca');
    });
  });

  // Prueba para el método obtenerMontoNeto
  describe('obtenerMontoNeto', () => {
    it('debería devolver el monto neto del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      expect(articulo.obtenerMontoNeto()).toEqual(12000.00);
    });
  });

  // Prueba para el método obtenerMontoIVA
  describe('obtenerMontoIVA', () => {
    it('debería devolver el monto del IVA del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      expect(articulo.obtenerMontoIVA()).toEqual(2520.00);
    });
  });

  // Prueba para el método obtenerMontoTotal
  describe('obtenerMontoTotal', () => {
    it('debería devolver el monto total del artículo', () => {
      const articulo = new Articulo('123', 'Descripción', 10000, 20, new TipoDeTalle('1', 'Talle'), new Categoria('1', 'Categoría'), new Marca('1', 'Marca'), 'Activo');
      expect(articulo.obtenerMontoTotal()).toEqual(14520.00);
    });
  });
});

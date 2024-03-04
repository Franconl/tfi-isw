const { Articulo } = require("../src/domain/entities/Articulo");
const { TipoDeTalle } = require("../src/domain/entities/TipoDeTalle");
const { Categoria } = require("../src/domain/entities/Categoria");
const { Marca } = require("../src/domain/entities/Marca");

describe("Articulo", () => {
  test("Creación de un artículo", () => {
    // Crear un objeto TipoDeTalle
    const tipoTalle = new TipoDeTalle("1", "Talle L");

    // Crear un objeto Categoria
    const categoria = new Categoria("1", "Ropa");

    // Crear un objeto Marca
    const marca = new Marca("1", "Nike");

    // Crear un objeto Articulo
    const articulo = new Articulo(
      "1",
      "Camiseta",
      20.0,
      30.0,
      tipoTalle,
      categoria,
      marca,
      "Nuevo"
    );

    // Probar si el objeto Articulo se crea correctamente
    expect(articulo.getCodigo()).toBe("1");
    expect(articulo.getDescripcion()).toBe("Camiseta");
    expect(articulo.getCosto()).toBe(20.0);
    expect(articulo.getMargenDeGanancia()).toBe(30.0);
    expect(articulo.getTipoDetalle()).toBe(tipoTalle);
    expect(articulo.getCategoria()).toBe(categoria);
    expect(articulo.getMarca()).toBe(marca);
    expect(articulo.getEstado()).toBe("Nuevo");
  });
});

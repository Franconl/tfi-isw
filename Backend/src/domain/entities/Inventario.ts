import { Articulo } from "./Articulo";
import { Color } from "./Color";
import { Sucursal } from "./Sucursal";
import { Talle } from "./Talle";

export class Inventario {
    private cantidad : number;
    private articulo : Articulo;
    private talle : Talle;
    private color : Color;
    private sucursal : Sucursal;


    constructor( cantidad : number, articulo : Articulo, talle : Talle, color : Color, sucursal : Sucursal){
        this.cantidad = cantidad;
        this.articulo = articulo;
        this.talle = talle;
        this.color = color;
        this.sucursal = sucursal;
    }

    // Getter para 'cantidad'
    getCantidad(): number {
        return this.cantidad;
    }

    // Setter para 'cantidad'
    setCantidad(cantidad: number): void {
        this.cantidad = cantidad;
    }

    // Getter para 'articulo'
    getArticulo(): Articulo {
        return this.articulo;
    }

    // Setter para 'articulo'
    setArticulo(articulo: Articulo): void {
        this.articulo = articulo;
    }

    // Getter para 'talle'
    getTalle(): Talle {
        return this.talle;
    }

    // Setter para 'talle'
    setTalle(talle: Talle): void {
        this.talle = talle;
    }

    // Getter para 'color'
    getColor(): Color {
        return this.color;
    }

    // Setter para 'color'
    setColor(color: Color): void {
        this.color = color;
    }

    // Getter para 'sucursal'
    getSucursal(): Sucursal {
        return this.sucursal;
    }

    // Setter para 'sucursal'
    setSucursal(sucursal: Sucursal): void {
        this.sucursal = sucursal;
    }
}
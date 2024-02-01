import { Cliente } from "./Cliente";
import { LineaDeVenta } from "./LineaDeVenta";
import { TipoDeComprobante } from "./TipoDeComprobante";
import { Venta } from "./Venta";

export class Comprobante {
    private tipo : TipoDeComprobante;
    private numero : number;
    private venta : Venta;
    private items : LineaDeVenta[];
    private cliente : Cliente;

    constructor(tipo : TipoDeComprobante, numero : number, venta : Venta, items : LineaDeVenta[], cliente : Cliente){
        this.tipo = tipo;
        this.numero = numero;
        this.venta = venta;
        this.items = items;
        this.cliente = cliente;
    }


}
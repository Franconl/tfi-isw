import { Cliente } from "./Cliente";
import { LineaDeVenta } from "./LineaDeVenta";
import { TipoDeComprobante } from "./TipoDeComprobante";

export class Comprobante {
    private tipo : TipoDeComprobante;
    private id! : string;
    private items : LineaDeVenta[];
    private cliente : Cliente;
    private cae! : string;

    constructor(tipo : TipoDeComprobante, items : LineaDeVenta[], cliente : Cliente, cae : string){
        this.tipo = tipo;
        this.items = items;
        this.cae = cae;
        this.cliente = cliente;
    }

    getTipo(){
        return this.tipo;
    }
    getId(){
        return this.id;
    }
    getItems(){
        return this.items;
    }
    getCliente(){
        return this.cliente;
    }
    getCae(){
        return this.cae;
    }
}
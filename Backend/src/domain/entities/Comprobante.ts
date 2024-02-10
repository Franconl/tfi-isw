import { Cliente } from "./Cliente";
import { LineaDeVenta } from "./LineaDeVenta";
import { TipoDeComprobante } from "./TipoDeComprobante";
import { v4  as uuid} from "uuid";

export class Comprobante {
    private tipo : TipoDeComprobante;
    private id : string;
    private items : LineaDeVenta[];
    private cliente : Cliente;
    private cae! : string;

    constructor(tipo : TipoDeComprobante, items : LineaDeVenta[], cliente : Cliente, cae : string){
        this.tipo = tipo;
        this.id = uuid();
        this.items = items;
        this.cae = cae;
        this.cliente = cliente;
    }


}
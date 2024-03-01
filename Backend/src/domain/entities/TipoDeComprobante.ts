import { CondicionTributaria } from "./CondicionTributaria";

export class TipoDeComprobante{

    private descripcion : string;
    private emitidoPor : CondicionTributaria;
    private recibidoPor : CondicionTributaria[];

    constructor(desc : string, emitido : CondicionTributaria, recibido : CondicionTributaria[]){
        this.descripcion = desc;
        this.emitidoPor = emitido;
        this.recibidoPor = recibido;
    }

    getDescripcion(){
        return this.descripcion;
    }
}
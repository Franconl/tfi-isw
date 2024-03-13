import { CondicionTributaria } from "./CondicionTributaria";

export class TipoDeComprobante{

    private id : string;
    private descripcion : string;
    private emitidoPor : CondicionTributaria;
    private recibidoPor : CondicionTributaria[];

    constructor(id :string,desc : string, emitido : CondicionTributaria, recibido : CondicionTributaria[]){
        this.id = id;
        this.descripcion = desc;
        this.emitidoPor = emitido;
        this.recibidoPor = recibido;
    }

    getDescripcion(){
        return this.descripcion;
    }

    getId(){
        return this.id;
    }
}
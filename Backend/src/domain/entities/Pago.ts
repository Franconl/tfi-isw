import { Cliente } from "./Cliente";

export class Pago {
    id?: string ;
    cliente: Cliente;
    monto: number;
    tipo: string;

    constructor( cliente: Cliente, monto: number, tipo: string,id?: string,) {
        this.id = id;
        this.cliente = cliente;
        this.monto = monto;
        this.tipo = tipo;
    }
}

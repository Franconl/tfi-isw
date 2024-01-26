import { TipoDeTalle } from "./TipoDeTalle";

export class Talle {
    private descripcion : string;
    private tipoDeTalle : TipoDeTalle;

    constructor(descripcion : string, tipoDeTalle : TipoDeTalle){
        this.descripcion = descripcion;
        this.tipoDeTalle = tipoDeTalle;
    }

    // Getter para 'descripcion'
    getDescripcion(): string {
        return this.descripcion;
    }

    // Setter para 'descripcion'
    setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    // Getter para 'tipoDeTalle'
    getTipoDeTalle(): TipoDeTalle {
        return this.tipoDeTalle;
    }

    // Setter para 'tipoDeTalle'
    setTipoDeTalle(tipoDeTalle: TipoDeTalle): void {
        this.tipoDeTalle = tipoDeTalle;
    }

}
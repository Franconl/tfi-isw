export class Color {
    private codigo : string;
    private nombre : string;

    constructor(codigo : string, nombre : string){
        this.codigo = codigo;
        this.nombre = nombre;
    }

    setCodigo(codigo : string) : void {
        this.codigo = codigo;
    }

    getCodigo() : string {
        return this.codigo;
    }

    setNombre(nombre : string) : void {
        this.nombre = nombre;
    }

    getNombre() : string {
        return this.nombre;
    }
}

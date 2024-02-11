import { Schema, model } from "mongoose";
const ArticuloSchema = new Schema(
    {
        descripcion: String,
        costo: Number,
        margenDeGanancia: Number,
        estado: {
            type: String,
            default: 'disponible' // Valor por defecto para el atributo 'estado'
        },
        tipoDetalle: { type: Schema.Types.ObjectId, ref: 'TipoDeTalle' },
        categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' }, 
        marca: { type: Schema.Types.ObjectId, ref: 'Marca' } 
    },
    {
        timestamps : true,
    }

)    

    const ArticuloModel = model("articulos", ArticuloSchema)

    export default ArticuloModel



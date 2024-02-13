import { Schema, model } from "mongoose";


const PuntoDeVentaSchema = new Schema(
    {
        numero : Number,
        estado : String,
        sucursal :  { type : Schema.Types.ObjectId , ref : 'Sucursal'}
    }
)

const PuntoDeVentaModel = model("puntosDeVentas", PuntoDeVentaSchema)

export default PuntoDeVentaModel;
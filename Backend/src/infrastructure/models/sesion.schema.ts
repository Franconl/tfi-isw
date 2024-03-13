import { Schema, model } from "mongoose";
import { CondicionTributaria } from "../../domain/entities/CondicionTributaria";

const CondicionTributariaValues = Object.values(CondicionTributaria) as string[];

const SesionSchema = new Schema(
    {
        usuario : { type : Schema.Types.ObjectId , ref : 'Usuario'},
        puntoDeVenta: { type : Schema.Types.ObjectId , ref : 'Usuario'},
        numeroComprobanteA : Number,
        numeroComprobanteB : Number,
        tokenAfip : String,
        tokenTarjeta : String,
        condicionTienda : { type: String, enum: CondicionTributariaValues }
    }
)

const SesionModel = model("sesiones", SesionSchema)

export default SesionModel;
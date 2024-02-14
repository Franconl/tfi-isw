import { Schema, model } from "mongoose";
import { TipoDeComprobante } from "../../domain/entities/TipoDeComprobante";
import { LineaDeVenta } from "../../domain/entities/LineaDeVenta";


const ComprobanteSchema = new Schema(
    {
        tipoDeComprobante: {
            type: String,
            enum: Object.values(TipoDeComprobante),
            required: true
            },
        items :  [{
            inventario: { type: Schema.Types.ObjectId, ref: 'Inventario' },
            cantidad: Number,
            precioUnitario: Number
            }],
        cliente :  { type: Schema.Types.ObjectId, ref: 'Cliente' },
        cae : String
    }
)

const ComprobanteModel = model("comprobantes", ComprobanteSchema);

export default ComprobanteModel;
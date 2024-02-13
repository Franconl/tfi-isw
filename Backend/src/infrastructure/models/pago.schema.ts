import { Schema, model } from "mongoose";


const PagoSchema = new Schema(
    {
        id: String,
        cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' }, // Suponiendo que el nombre de la colección para Cliente es 'Cliente'
        monto: Number,
        tipo: String
    }
)

const PagoModel = model("pagos", PagoSchema)

export default PagoModel;
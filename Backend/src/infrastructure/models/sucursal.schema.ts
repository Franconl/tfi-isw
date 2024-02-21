import { Schema, model } from "mongoose";

const SucursalSchema = new Schema(
    {
        ciudad : String,
        nombre : String,
        telefono : Number
    }
)

const SucursalModel = model("sucursales", SucursalSchema)

export default SucursalModel;
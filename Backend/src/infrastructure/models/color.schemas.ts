import { Schema, model } from "mongoose";

const ColorSchema = new Schema(
    {
        nombre : String
    }
)

const ColorModel = model("colores", ColorSchema)

export default ColorModel
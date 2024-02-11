import { Schema, model } from "mongoose";

const CategoriaSchema = new Schema(
    {
        nombre : String
    }
)

const CategoriaModel = model("categorias", CategoriaSchema)

export default CategoriaModel
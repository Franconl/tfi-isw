import { Schema, model } from "mongoose";
const TipoDeTalleSchema = new Schema(
    {
        nombre : String
    }
)

const TipoDeTalleModel = model("tipoDeTalles", TipoDeTalleSchema);

export default TipoDeTalleModel;
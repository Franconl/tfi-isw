import { Schema, model } from "mongoose";
const TalleSchema = new Schema(
    {
        descripcion : String,
        tipoDeTalle : { type : Schema.Types.ObjectId , ref : 'TipoDeTalle'}
    }
)

const TalleModel = model("talles", TalleSchema);

export default TalleModel;
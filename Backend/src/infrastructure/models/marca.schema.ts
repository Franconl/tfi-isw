import { Schema, model } from "mongoose";
import { v4 as uuidv4} from "uuid";

const MarcaSchema = new Schema(
    {
        nombre : String
    }
)

const MarcaModel = model("marcas", MarcaSchema);

export default MarcaModel;
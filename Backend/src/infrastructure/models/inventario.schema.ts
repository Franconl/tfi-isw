import { Schema, model } from "mongoose";

const InventarioSchema = new Schema(
    {
        cantidad : Number,
        articulo : { type : Schema.Types.ObjectId, ref : 'Articulo'},
        talle : { type : Schema.Types.ObjectId, ref : 'Talle'},
        color : { type : Schema.Types.ObjectId, ref : 'Color'},
        sucursal : { type : Schema.Types.ObjectId, ref : 'Sucursal'}
    },
    {
        timestamps : true,
    }

)    

    const InventarioModel = model("inventarios", InventarioSchema)

    export default InventarioModel;



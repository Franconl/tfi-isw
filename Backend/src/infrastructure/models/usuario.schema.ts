import { Schema, model } from "mongoose";

const UsuarioSchema = new Schema(
    {
        usuario : String,
        contraseña : String,
        permisos : String
    }
)

const UsuarioModel = model("usuarios", UsuarioSchema)

export default UsuarioModel;
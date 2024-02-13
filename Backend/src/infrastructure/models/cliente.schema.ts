import mongoose, { Schema, Document } from 'mongoose';

// Enumeración para las condiciones tributarias
enum CondicionTributaria {
    RESPONSABLE_INSCRIPTO = "RI ",
    MONOTRIBUTO = "M",
    EXENTO = "E",
    CONSUMIDOR_FINAL = "CF",
    NO_RESPONSABLE = "NR",
}

// Definición de la interfaz para el documento Cliente en MongoDB
interface ICliente extends Document {
    id: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    domicilio: string;
    dni: number;
    condicion: CondicionTributaria; 
    cuil?: number;
    cuit?: number;
}

// Definición del esquema para el Cliente
const ClienteSchema: Schema = new Schema({
    id: { type: String, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
    email: { type: String, required: true },
    domicilio: { type: String, required: true },
    dni: { type: Number, required: true },
    condicion: { type: String, enum: Object.values(CondicionTributaria), required: true }, 
    cuil: { type: Number },
    cuit: { type: Number }
});

// Define y exporta el modelo de Cliente
export const ClienteModel = mongoose.model<ICliente>('Cliente', ClienteSchema);

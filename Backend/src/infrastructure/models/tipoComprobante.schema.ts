import mongoose, { Schema, Document } from 'mongoose';

enum CondicionTributaria {
    RESPONSABLE_INSCRIPTO = "RI ",
    MONOTRIBUTO = "M",
    EXENTO = "E",
    CONSUMIDOR_FINAL = "CF",
    NO_RESPONSABLE = "NR",
}

interface ITipoComprobante extends Document {
    descripcion: string;
    emitidoPor: CondicionTributaria;
    recibidoPor : CondicionTributaria[];
}

const CondicionTributariaValues = Object.values(CondicionTributaria) as string[];

const TipoDeComprobanteSchema = new Schema(
    {
        descripcion : String,
        emitidoPor : { type: String, enum: CondicionTributariaValues },
        recibidoPor : [{ type: String, enum: CondicionTributariaValues }]
    }
)

export const TipoDeComprobanteModel = mongoose.model<ITipoComprobante>('tiposcomprobantes', TipoDeComprobanteSchema);

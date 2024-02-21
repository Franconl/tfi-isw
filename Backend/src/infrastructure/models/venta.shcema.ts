import { Schema, model, Types } from "mongoose";
import { TipoDeComprobante } from "../../domain/entities/TipoDeComprobante";

interface LineaDeVenta {
    inventario: Types.ObjectId;
    cantidad: number;
    precioUnitario: number;
}

interface VentaDocument {
    id: string;
    fecha: string;
    monto: number;
    tipoDeComprobante: TipoDeComprobante;
    usuario: Types.ObjectId;
    puntoDeVenta: Types.ObjectId;
    lineasDeVenta: LineaDeVenta[]; // Array de objetos de tipo LineaDeVenta
    pago: Types.ObjectId;
    cliente: Types.ObjectId;
    comprobante: Types.ObjectId;
}

const VentaSchema = new Schema<VentaDocument>({
    id: String,
    fecha: String,
    monto: Number,
    tipoDeComprobante: {
        type: String,
        enum: Object.values(TipoDeComprobante),
        required: true
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    puntoDeVenta: { type: Schema.Types.ObjectId, ref: 'PuntoDeVenta' },
    lineasDeVenta: [{
        inventario: { type: Schema.Types.ObjectId, ref: 'Inventario' },
        cantidad: Number,
        precioUnitario: Number
    }],
    pago: { type: Schema.Types.ObjectId, ref: 'Pago' },
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    comprobante: { type: Schema.Types.ObjectId, ref: 'Comprobante' }
});

const VentaModel = model<VentaDocument>("Venta", VentaSchema);

export default VentaModel;

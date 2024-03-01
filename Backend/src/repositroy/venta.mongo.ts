import { Venta } from "../domain/entities/Venta";
import { IVentaRepository } from "../domain/interfaces/IVentaRepository";
import PagoModel from "../infrastructure/models/pago.schema";
import VentaModel from "../infrastructure/models/venta.shcema";
import { Pago } from "../domain/entities/Pago";
import { Comprobante } from "../domain/entities/Comprobante";
import ComprobanteModel from "../infrastructure/models/comprobante.schema";
import { LineaDeVenta } from "../domain/entities/LineaDeVenta";
import { CondicionTributaria } from "../domain/entities/CondicionTributaria";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { TipoDeComprobanteModel } from "../infrastructure/models/tipoComprobante.schema";

export class VentaMongo implements IVentaRepository{


    async insertVenta(criterios: { venta: Venta }): Promise<any> {
        const venta = criterios.venta;
        try {
            const pagoId = await this.insertPago(venta.getPago());
            const clienteId = venta.getCliente().getId();
            const comprobanteId = await this.insertComprobante(venta.getComprobante());
            const pdvId = venta.getPuntoDeVenta().getId();
            const usuarioId = venta.getUsuario().getId();

            // Obtener solo los IDs de los inventarios en lineasDeVenta
            const ldvDetails = venta.getLineaDeVenta().map(ldv => ({
                inventario: ldv.getInventario().getId(),
                cantidad: ldv.getCantidad(),
                precioUnitario: ldv.getPrecioUnitario()
            }));

            const nuevaVenta = new VentaModel({
                id: venta.getId(),
                fecha: venta.getFecha(),
                tipoDeComprobante: venta.getTipoDeComprobante(),
                usuario: usuarioId,
                puntoDeVenta: pdvId,
                lineasDeVenta: ldvDetails, // Usar solo los IDs
                pago: pagoId,
                cliente: clienteId,
                comprobante: comprobanteId
            });

            const ventaGuardada = await nuevaVenta.save();
            console.log('venta registrada');
            return ventaGuardada;
        } catch (error) {
            console.error('Error al guardar venta:', error);
            return false;
        }
    }
    

    async insertPago(pago : Pago){
        try{
            const nuevoPago = new PagoModel({
                cliente : pago.cliente.getId(),
                monto : pago.monto,
                tipo : pago.tipo
            });
            const pagoGuardado = await nuevoPago.save();
            console.log('pago guardado');
            return pagoGuardado._id;
        }catch(error){
            console.error('error al guardar pago')
            return false;
        }
    }

    async insertComprobante(comprobante: Comprobante) {
        try {
            // Obtener los detalles de los items
            const itemsDetails = comprobante.getItems().map(ldv => ({
                inventario: ldv.getInventario().getId(),
                cantidad: ldv.getCantidad(),
                precioUnitario: ldv.getPrecioUnitario()
            }));
    
            const nuevoComprobante = new ComprobanteModel({
                tipoDeComprobante: comprobante.getTipo(),
                // Almacenar los detalles de los items
                items: itemsDetails,
                cliente: comprobante.getCliente().getId(),
                cae: comprobante.getCae()
            });
    
            const comprobanteGuardado = await nuevoComprobante.save();
            console.log('Comprobante registrado');
            return comprobanteGuardado._id;
        } catch (error) {
            console.error('Error al guardar comprobante:', error);
            return false;
        }
    }

    async obtenerTipoComprobante(emitidoPor : CondicionTributaria, recibidoPor : CondicionTributaria) {
        try {

            const tipoComprobanteMongo = await TipoDeComprobanteModel.findOne({ emitidoPor, recibidoPor }).exec();

            console.log(tipoComprobanteMongo, emitidoPor, recibidoPor);

            if (!tipoComprobanteMongo) {
                console.error('No se encontró un Tipo de Comprobante para las condiciones especificadas.');
                return null;
            }
    
            // Si alguna de las propiedades está faltante, se lanza un error
            if (!tipoComprobanteMongo.emitidoPor || !tipoComprobanteMongo.recibidoPor || !tipoComprobanteMongo.descripcion) {
                throw new Error('El Tipo de Comprobante recuperado tiene propiedades faltantes.');
            }

            const tipoComprobante = new TipoDeComprobante(tipoComprobanteMongo.descripcion, tipoComprobanteMongo.emitidoPor, tipoComprobanteMongo.recibidoPor);

            return tipoComprobante;

        } catch (error) {
            console.error('Error al buscar Tipo de Comprobante:', error);
            return null;
        }
    }
}
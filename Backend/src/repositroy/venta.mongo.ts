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
import PuntoDeVentaModel from "../infrastructure/models/puntoDeVenta.schema";
import { PuntoDeVenta } from "../domain/entities/PuntoDeVenta";
import SucursalModel from "../infrastructure/models/sucursal.schema";
import { Sucursal } from "../domain/entities/Sucursal";
import UsuarioModel from "../infrastructure/models/usuario.schema";
import { Usuario } from "../domain/entities/Usuario";
import { ClienteModel } from "../infrastructure/models/cliente.schema";
import { Cliente } from "../domain/entities/Cliente";
import mongoose from "mongoose";
import { Inventario } from "../domain/entities/Inventario";

export class VentaMongo implements IVentaRepository{


    async insertVenta(ventaId : string): Promise<any> {
        try {
            const venta = await VentaModel.findById(ventaId);
            if(!venta){
                return null;
            }
            venta.estado = 'Aprobado'
            console.log('venta registrada');
            const ventaFinalizada = venta.save();
            return ventaFinalizada
        } catch (error) {
            console.error('Error al guardar venta:', error);
            return null;
        }
    }
    
    // Método para insertar una venta incompleta
    async insertNuevaVenta(criterios: { venta: Venta }): Promise<any> {
        const venta = criterios.venta;
        try {
            const clienteId = venta.getCliente().getId();
            const pdvId = venta.getPuntoDeVenta().getId();
            const usuarioId = venta.getUsuario().getId();

            // Obtener solo los IDs de los inventarios en lineasDeVenta
            const ldvDetails = venta.getLineaDeVenta().map(ldv => ({
                inventario: ldv.getInventario().getId(),
                cantidad: ldv.getCantidad(),
                precioUnitario: ldv.getPrecioUnitario()
            }));

            const nuevaVenta = new VentaModel({
                fecha: venta.getFecha(),
                estado : 'Pendiente',
                monto : 0,
                tipoDeComprobante: venta.getTipoDeComprobante().getId(),
                usuario: usuarioId,
                puntoDeVenta: pdvId,
                lineasDeVenta: ldvDetails, 
                cliente: clienteId
            });

            const ventaGuardada = await nuevaVenta.save();
            console.log('venta registrada');
            return ventaGuardada;

        } catch (error) {
            console.error('Error al guardar venta:', error);
            return null;
        }
    }
  
    
    async obtenerVenta(id: string): Promise<Venta | null> {
        try {
            // Buscar la venta por su ID en la base de datos
            const ventaMongo = await VentaModel.findById(id);
            if (!ventaMongo || !ventaMongo.usuario || !ventaMongo.puntoDeVenta || !ventaMongo.cliente) {
                console.error('error al obtener ventaa')
                throw new Error('Venta no encontrada');
            }
    
            const usuario = await this.obtenerUsuarioPorId(ventaMongo.usuario._id.toString());
            const pdv = await this.buscarPuntoDeVenta({ id: ventaMongo.puntoDeVenta._id.toString() });
            const cliente = await this.obtenerCliente(ventaMongo.cliente._id.toString());
    
            if (!usuario || !pdv || !cliente) {
                console.error('error al buscar cliente usuario o pdv')
                return null;
            }
    
            const venta: Venta = new Venta(usuario, cliente, pdv, id);

            if(ventaMongo.estado)venta.setEstado(ventaMongo.estado.toString())

            if (ventaMongo.fecha) {
                venta.setFecha(ventaMongo.fecha);
            }
    
            if (ventaMongo.monto) {
                venta.setMonto(ventaMongo.monto);
            }
    

            if(ventaMongo.tipoDeComprobante){
                const tipo = await this.obtenerTipoComprobanteId(ventaMongo.tipoDeComprobante._id.toString());
                if(tipo) venta.setTipoDeComprobante(tipo);
            }
            return venta;
        } catch (error) {
            console.error('Error al buscar venta por ID:', error);
            return null;
        }
    }
    
    async setCliente(ventaId: string, cliente: Cliente, tipoComprobante : TipoDeComprobante): Promise<any> {
        try{
            const venta = await VentaModel.findById(ventaId);
            if (!venta) {
                throw new Error(`No se encontró la venta con ID: ${ventaId}`);
            }
            venta.cliente = new mongoose.Types.ObjectId(cliente.getId());
            venta.tipoDeComprobante = new mongoose.Types.ObjectId(tipoComprobante.getId())

            await venta.save();
            return venta;

        }catch (error) {
            console.error('Error al settear Cliente', error);
            return null;
          }

    }

    async insertPago(ventaId : string, tipo : string){
        try{
            const venta = await this.obtenerVenta(ventaId);
            const ventaMongo = await VentaModel.findById(ventaId);

            if(!ventaMongo || !venta){
                return null;
            }

            const nuevoPago = new PagoModel({
                cliente : venta.getCliente().getId(),
                monto : venta.getMonto(),
                tipo : tipo
            });
            const pagoGuardado = await nuevoPago.save();
            console.log('pago guardado');
            ventaMongo.pago = new mongoose.Types.ObjectId(pagoGuardado._id);
            await ventaMongo.save();
            return pagoGuardado;
        }catch(error){
            console.error('error al guardar pago')
            return false;
        }
    }

    async insertComprobante(comprobante: Comprobante, ventaId : string) {
        try {
            const venta = await VentaModel.findById(ventaId);
            if(!venta){
                console.log('venta no encontrada al crear comprobante')
                return null;
            }
        
            console.log(comprobante.getTipo().getId())
            const nuevoComprobante = new ComprobanteModel({
                tipoDeComprobante: comprobante.getTipo().getId(),
                // Almacenar los detalles de los items
                items: [],
                cliente: comprobante.getCliente().getId(),
                cae: comprobante.getCae()
            });
    
            const comprobanteGuardado = await nuevoComprobante.save();
            console.log('Comprobante registrado');
            venta.comprobante = new mongoose.Types.ObjectId(comprobanteGuardado._id)
            return comprobanteGuardado._id;
        } catch (error) {
            console.error('Error al guardar comprobante:', error);
            return false;
        }
    }

    async obtenerTipoComprobanteId(id : string){
        try {

            const tipoComprobanteMongo = await TipoDeComprobanteModel.findById(id).exec();

            if (!tipoComprobanteMongo) {
                console.error('No se encontró un Tipo de Comprobante para las condiciones especificadas.');
                return null;
            }
    
            // Si alguna de las propiedades está faltante, se lanza un error
            if (!tipoComprobanteMongo.emitidoPor || !tipoComprobanteMongo.recibidoPor || !tipoComprobanteMongo.descripcion) {
                throw new Error('El Tipo de Comprobante recuperado tiene propiedades faltantes.');
            }

            const tipoComprobante = new TipoDeComprobante(tipoComprobanteMongo._id.toString(),tipoComprobanteMongo.descripcion, tipoComprobanteMongo.emitidoPor, tipoComprobanteMongo.recibidoPor);

            return tipoComprobante;

        } catch (error) {
            console.error('Error al buscar Tipo de Comprobante:', error);
            return null;
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

            const tipoComprobante = new TipoDeComprobante(tipoComprobanteMongo._id.toString(),tipoComprobanteMongo.descripcion, tipoComprobanteMongo.emitidoPor, tipoComprobanteMongo.recibidoPor);

            return tipoComprobante;

        } catch (error) {
            console.error('Error al buscar Tipo de Comprobante:', error);
            return null;
        }
    }

    async insertLineaDeVenta(lineadeVenta: LineaDeVenta, ventaId: string): Promise<any> {
        try {
            // Encuentra la venta por su ID
            const venta = await VentaModel.findById(ventaId);
            if (!venta) {
                throw new Error(`No se encontró la venta con ID: ${ventaId}`);
            }
    
            // Agrega la nueva línea de venta al array de lineasDeVenta
            venta.lineasDeVenta.push(
                {
                    inventario : new mongoose.Types.ObjectId(lineadeVenta.getInventario().getId()),
                    cantidad : lineadeVenta.getCantidad(),
                    precioUnitario : lineadeVenta.getPrecioUnitario()
                }
            );
                
            // Actualiza el monto total de la venta
            const monto =  (lineadeVenta.getCantidad() * lineadeVenta.getPrecioUnitario());
            console.log(monto)
            venta.monto += monto;

            // Guarda los cambios en la base de datos
            const ventaGuardada = await venta.save();
            return ventaGuardada;
        } catch (error) {
            console.error("Error al agregar la línea de venta:", error);
            throw error;
        }
    }

    async buscarPuntoDeVenta(criterios: { id: string }) {
        try {
            const pdvMongo = await PuntoDeVentaModel.findById(criterios.id).exec();
            if(!pdvMongo || !pdvMongo._id || !pdvMongo.numero || !pdvMongo.sucursal || !pdvMongo.estado){
                console.error('error al obtener punto de venta')
                return null;
            }
            const id_suc = pdvMongo.sucursal.toString();
            const sucursal = await this.buscarSucursal({id : id_suc});
            if(!sucursal){
                console.error('error al obtener sucursal de pdv')
                return null;
            }
            const pdv : PuntoDeVenta = new PuntoDeVenta(pdvMongo._id.toString(),pdvMongo.numero,sucursal,pdvMongo.estado);
            return pdv;
        } catch (error) {
            console.error('Error al buscar el punto de venta:', error);
            throw error;
        }
    }

    async buscarSucursal(criterios: { id: string }) {
        try {
            const sucursal = await SucursalModel.findById(criterios.id).exec();
            if (!sucursal || !sucursal._id || !sucursal.nombre || !sucursal.ciudad || !sucursal.telefono) {
                return null
            }

            const sucursalResponse = new Sucursal(sucursal._id.toString() ,sucursal.nombre,sucursal.ciudad,sucursal.telefono)

            return sucursalResponse;
        } catch (error) {
            console.error('Error al buscar la sucursal:', error);
            throw error;
        }
    }

    async obtenerUsuarioPorId( id : string){
        try {
            const usuarioEncontrado = await UsuarioModel.findById(id).exec();
            if(!usuarioEncontrado?._id || !usuarioEncontrado?.usuario || !usuarioEncontrado.contraseña || !usuarioEncontrado.permisos){
                return null;
            }
            const usuarioResponse : Usuario = new Usuario(usuarioEncontrado._id.toString(),usuarioEncontrado.usuario,usuarioEncontrado.contraseña, usuarioEncontrado.permisos);

            return usuarioResponse;
             
        } catch (error) {
            console.error('Error al obtener el usuario por su nombre de usuario:', error);
            return null; // Hubo un error
        }
    }

    async obtenerCliente(id: string): Promise<any> {
        try {
            const clienteMongo = await ClienteModel.findById( id ).exec();
            if(!clienteMongo){
                console.error('Cliente no registrado');
                return null;
            }
            if(!clienteMongo.nombre || !clienteMongo.apellido || !clienteMongo.telefono 
                || !clienteMongo.email || !clienteMongo.domicilio || !clienteMongo.dni
                || !clienteMongo.condicion || !clienteMongo._id){
                    console.error('error al obtener datos del cliente');
                    return null;
            }
            
            const cliente = new Cliente(clienteMongo.nombre,clienteMongo.apellido
                ,clienteMongo.telefono,clienteMongo.email,clienteMongo.domicilio,
                clienteMongo.condicion,{dni : clienteMongo.dni, cuit : clienteMongo.cuit, cuil : clienteMongo.cuil},clienteMongo._id.toString(),)
            
            return cliente;
        } catch (error) {
            console.error('Error al obtener el cliente por su DNI:', error);
            return null;
        }
    }
}
import { Cliente } from '../domain/entities/Cliente';
import { IClienteRepository } from '../domain/interfaces/IClienteRepository';
import { ClienteModel } from '../infrastructure/models/cliente.schema';


export class ClienteMongo implements IClienteRepository {
    // Método para crear un nuevo cliente
    async crearCliente(nuevoCliente: Cliente): Promise<any> {
        try {
            // Crear una instancia del modelo Cliente
            const cliente = new ClienteModel(nuevoCliente);

            await cliente.save();
            console.log('client creado');
            return cliente; 
        } catch (error) {
            console.error('Error al crear el cliente:', error);
            return null;
        }
    }

    
    async obtenerClientePorDni(dni: number): Promise<any> {
        try {
            const clienteMongo = await ClienteModel.findOne({ dni }).exec();
            if(!clienteMongo){
                console.error('Cliente no registrado');
                return null;
            }
            console.log(clienteMongo)
            if(!clienteMongo.nombre || !clienteMongo.apellido || !clienteMongo.telefono 
                || !clienteMongo.email || !clienteMongo.domicilio || !clienteMongo.dni
                || !clienteMongo.condicion || !clienteMongo._id){
                    console.error('error al obtener datos del cliente');
                    return null;
            }
            
            const cliente = new Cliente(clienteMongo.nombre,clienteMongo.apellido
                ,clienteMongo.telefono,clienteMongo.email,clienteMongo.domicilio,
                clienteMongo.condicion,{dni : dni, cuit : clienteMongo.cuit, cuil : clienteMongo.cuil},clienteMongo._id.toString(),)
            
            return cliente;
        } catch (error) {
            console.error('Error al obtener el cliente por su DNI:', error);
            return null;
        }
    }
    // Método para actualizar un cliente
    async actualizarCliente(id: string, nuevosDatos: any): Promise<boolean> {
        try {
            // Buscar el cliente por su ID y actualizar sus datos
            await ClienteModel.findByIdAndUpdate(id, nuevosDatos).exec();
            return true; // Se actualizó exitosamente
        } catch (error) {
            console.error('Error al actualizar el cliente:', error);
            return false; // Hubo un error
        }
    }

    // Método para eliminar un cliente por su ID
    async eliminarCliente(id: string): Promise<boolean> {
        try {
            // Buscar el cliente por su ID y eliminarlo
            await ClienteModel.findByIdAndDelete(id).exec();
            return true; // Se eliminó exitosamente
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
            return false; // Hubo un error
        }
    }
}

import { Cliente } from '../domain/entities/Cliente';
import { IClienteRepository } from '../domain/interfaces/IClienteRepository';
import { ClienteModel } from '../infrastructure/models/cliente.schema';


export class ClienteMongo implements IClienteRepository {
    // Método para crear un nuevo cliente
    async crearCliente(nuevoCliente: Cliente): Promise<any> {
        try {
            
            // Crear una instancia del modelo Cliente
            const cliente = new ClienteModel({
                nombre : nuevoCliente.getNombre(),
                apellido : nuevoCliente.getApellido(),
                telefono : nuevoCliente.getTelefono(),
                email : nuevoCliente.getEmail(),
                domicilio : nuevoCliente.getDomicilio(),
                dni : nuevoCliente.getDni(),
                cuil : nuevoCliente.getCuil(),
                cuit : nuevoCliente.getCuit()
            });

            await cliente.save();
            return cliente; 
        } catch (error) {
            console.error('Error al crear el cliente:', error);
            return null;
        }
    }

    
    async obtenerClientePorDni(dni: number): Promise<any> {
        try {
            const cliente = await ClienteModel.findOne({ dni }).exec();
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

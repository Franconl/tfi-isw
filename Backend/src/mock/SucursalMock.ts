import { Sucursal } from "../domain/entities/Sucursal";
import { ISucursalRepository } from "../domain/repositories/ISucursalRepository";

export class SucursalMock implements ISucursalRepository {
  getSucursal(criterios: { id: string; }): Promise<Sucursal | null> {
    // Supongamos que aquí deberías buscar la sucursal por ID
    // En este ejemplo, devolvemos una sucursal de ejemplo con ID '1'
    // Puedes ajustar esto según tu lógica real de recuperación de sucursal
    if (criterios.id === '1') {
      return Promise.resolve(new Sucursal(criterios.id,'centro', 'concepcion' , 1232));
    } else {
      return Promise.resolve(null); // Devolver nulo si no se encuentra la sucursal
    }
  }
}

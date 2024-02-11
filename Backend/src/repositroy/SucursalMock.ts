import { PuntoDeVenta } from "../domain/entities/PuntoDeVenta";
import { Sucursal } from "../domain/entities/Sucursal";
import { ISucursalRepository } from "../domain/interfaces/ISucursalRepository";

export class SucursalMock implements ISucursalRepository {
  public getSucursal(criterios: { id: string; }): Promise<Sucursal | null> {
    // Supongamos que aquí deberías buscar la sucursal por ID
    // En este ejemplo, devolvemos una sucursal de ejemplo con ID '1'
    // Puedes ajustar esto según tu lógica real de recuperación de sucursal
    if (criterios.id === '1') {
      return Promise.resolve(new Sucursal(criterios.id,'centro', 'concepcion' , 1232));
    } else {
      return Promise.resolve(null); // Devolver nulo si no se encuentra la sucursal
    }
  }

  public getPuntoDeVenta(criterios: { numero : number; }): Promise<PuntoDeVenta | null> {
    if (criterios.numero === 1) {
      return Promise.resolve(new PuntoDeVenta(criterios.numero,new Sucursal('1','centro', 'concepcion' , 1232)));
    } else {
      return Promise.resolve(null); // Devolver nulo si no se encuentra la sucursal
    }
  }
}

import { Venta } from "../entities/Venta";
import { Sesion } from "../entities/Sesion";

export interface IConexionAfipService {
    solicitarToken(): Promise<string>;
    solicitarUltimoComprobante(token : string): Promise<{A : number, B : number}>;
    solicitarCae(venta: Venta, sesion: Sesion): Promise<any>;
}
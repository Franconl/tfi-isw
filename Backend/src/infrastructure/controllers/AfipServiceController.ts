import { ConexionAfipService } from "../../aplication/ConexionAfipService";
import { parseString } from "xml2js";
import { promisify } from 'util';
import { VentaService } from "../../aplication/VentaService";

export class AfipServiceController {

    private afipService: ConexionAfipService;

    constructor(afipService: ConexionAfipService) {
        this.afipService = afipService;
    }

    public async solicitarToken(): Promise<any> {
        try {
            const response = await this.afipService.solicitarToken();
    
            const parseStringAsync = promisify(parseString);
            const data: any = await parseStringAsync(response);
    
            // Acceder a los datos según la estructura del objeto JSON devuelto
            const result = data['s:Envelope']['s:Body'][0]['SolicitarAutorizacionResponse'][0]['SolicitarAutorizacionResult'][0];
    
            const puntoVenta = result['a:PuntoVenta'][0];
            const token = result['a:Token'][0];
            const vencimiento = result['a:Vencimiento'][0];
    
            this.afipService.getSesion().setTokenAfip(token);
            
        } catch (error) {
            console.error('Error al solicitar Token:', error);
            return null;
        }
    }
    
    
    
  
    
    public async solicitarUltimoComprobante() {
        try {
            const response = await this.afipService.solicitarUltimoComprobante();
            
            const parseStringAsync = promisify(parseString);
            const data: any = await parseStringAsync(response);
    
            // Acceder a los datos según la estructura del objeto JSON devuelto
            const comprobantes = data['s:Envelope']['s:Body'][0]['SolicitarUltimosComprobantesResponse'][0]['SolicitarUltimosComprobantesResult'][0]['a:Comprobantes'][0]['a:Comprobante'];
    
            for (const comprobante of comprobantes) {
                const descripcion = comprobante['a:Descripcion'][0];
                const id = comprobante['a:Id'][0];
                const numero = comprobante['a:Numero'][0];
                
                
                if (descripcion === 'Factura A') {
                    this.afipService.getSesion().setNumeroComprobanteA(parseInt(numero) + 1);
                } else if (descripcion === 'Factura B') {
                    this.afipService.getSesion().setNumeroComprobanteB(parseInt(numero) + 1);
                }
            }
        } catch (error) {
            console.error('Error al solicitar comprobantes:', error);
            return null;
        }
    }
    

    public async solicitarCae(ventaService : VentaService){
        var venta = ventaService.getVenta();
        try{
            if(venta){
                await this.afipService.solicitarCae(venta);
            }
        }catch(error) {
            console.error('Error al solicitar comprobantes:', error);
            return null;
        }
        
    }
}

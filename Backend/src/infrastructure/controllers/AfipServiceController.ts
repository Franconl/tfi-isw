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
    
            const result = data['s:Envelope']['s:Body'][0]['SolicitarAutorizacionResponse'][0]['SolicitarAutorizacionResult'][0];
    
            const puntoVenta = result['a:PuntoVenta'][0];
            const token = result['a:Token'][0];
            const vencimiento = result['a:Vencimiento'][0];
            
            if(token){
                this.afipService.setToken(token);
                console.log('token solicitado');
                return token;
            }throw Error;
            
            
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
                
                if(numero){
                    if (descripcion === 'Factura A') {
                        this.afipService.getSesion().setNumeroComprobanteA(parseInt(numero) + 1);
                    } else if (descripcion === 'Factura B') {
                        this.afipService.getSesion().setNumeroComprobanteB(parseInt(numero) + 1);
                        console.log(numero)
                    }

                    console.log('Ultimos comprobantes solicitados')
                }
                
            }
        } catch (error) {
            console.error('Error al solicitar comprobantes:', error);
            return null;
        }
    }
    

    public async solicitarCae(ventaService : VentaService){
        var venta = ventaService.getVenta();
        console.log(venta);
        try{
            if(venta){
                const xmlResponse = await this.afipService.solicitarCae(venta);

                const parseStringAsync = promisify(parseString);
                const data: any = await parseStringAsync(xmlResponse);

                const cae = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:Cae'][0];
                const error = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:Error'][0];
                const estado = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:Estado'][0];
                const fechaDeVencimiento = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:FechaDeVencimiento'][0];
                const observacion = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:Observacion'][0];
                const tipoComprobante = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:TipoComprobante'][0];
                console.log(cae,error,estado,tipoComprobante,'estado')
                if(estado == 'Aprobada' || estado == 'AprobadaParcialmente'){
                    console.log('Venta Aprobada por AFIP');
                    ventaService.crearComprobante(cae);
                    this.afipService.setUltimosComprobantes(tipoComprobante);
                    return {cae,error,estado,tipoComprobante}
                }else{
                    let n = 0;
                    while(n > 1){
                        this.solicitarToken();
                        this.solicitarCae(ventaService);
                        n++;
                    }

                }
                return null;
            }
        }catch(error) {
            console.error('Error al solicitar comprobantes:', error);
            return null;
        }
        
    }
}

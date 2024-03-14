import axios from "axios";
import { Venta } from "../domain/entities/Venta";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { VentaService } from "./VentaService";
import { parse, differenceInDays } from 'date-fns';
import { Cliente } from "../domain/entities/Cliente";
import { parseString } from "xml2js";
import { promisify } from 'util';
import { Sesion } from "../domain/entities/Sesion";

export class ConexionAfipService {
    private url : string = "http://istp1service.azurewebsites.net/LoginService.svc";

    public async solicitarToken() : Promise<any> {
        const headers = {
            'Content-Type': 'text/xml;charset=UTF-8',
            'SOAPAction': 'http://ISTP1.Service.Contracts.Service/ILoginService/SolicitarAutorizacion',
            };

            const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:istp="http://ISTP1.Service.Contracts.Service">
            <soapenv:Header/>
            <soapenv:Body>
              <istp:SolicitarAutorizacion>
                <istp:codigo>C4DA2C56-362C-491D-BECE-347FB4982B7B</istp:codigo>
              </istp:SolicitarAutorizacion>
            </soapenv:Body>
          </soapenv:Envelope>`

            try{
                const response = await axios.post(this.url,xmlBody,{ headers })
                const parseStringAsync = promisify(parseString);
                const data: any = await parseStringAsync(response.data);

                const result = data['s:Envelope']['s:Body'][0]['SolicitarAutorizacionResponse'][0]['SolicitarAutorizacionResult'][0];
    
                const token = result['a:Token'][0];
                
                if(token){
                    console.log('token solicitado');
                    return token;
                }throw Error;

            }catch(error){
                console.error('error en la solicitud SOAP: ',error);
                throw error;
            }

        }
    
    public async solicitarUltimoComprobante(token : string) : Promise<any> {

        const headers = {
            'Content-Type' : 'text/xml;charset=UTF-8',
            'SOAPAction': 'http://ISTP1.Service.Contracts.Service/ILoginService/SolicitarUltimosComprobantes'
        }

        const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:istp="http://ISTP1.Service.Contracts.Service">
        <soapenv:Header/>
        <soapenv:Body>
          <istp:SolicitarUltimosComprobantes>
            <istp:token>${token}</istp:token>
          </istp:SolicitarUltimosComprobantes>  
        </soapenv:Body>
      </soapenv:Envelope>`

      try{
        const response = await axios.post(this.url, xmlBody , {headers});

            const parseStringAsync = promisify(parseString);
            const data: any = await parseStringAsync(response.data);
    
            // Acceder a los datos según la estructura del objeto JSON devuelto
            const comprobantes = data['s:Envelope']['s:Body'][0]['SolicitarUltimosComprobantesResponse'][0]['SolicitarUltimosComprobantesResult'][0]['a:Comprobantes'][0]['a:Comprobante'];
    
            for (const comprobante of comprobantes) {
                const descripcion = comprobante['a:Descripcion'][0];
                const numero = comprobante['a:Numero'][0];
                var numeroA = 0;
                var numeroB = 0;
                if(numero){
                    if (descripcion === 'Factura A') {
                        var numeroA = (parseInt(numero) + 1);
                    } else if (descripcion === 'Factura B') {
                        var numeroB = (parseInt(numero) + 1);
                    }

                    console.log('Ultimos comprobantes solicitados')

                    return {A : numeroA,B : numeroB}
                }
                
            }
      }catch(error){
        console.error('error en la solicitud SOAP: ',error);
        throw error;
      }

    }

    public async solicitarCae(venta : Venta , sesion : Sesion) : Promise<any> {
        const cliente = venta.getCliente();

        const token = sesion.getTokenAfip();
        const fecha = venta.getFecha();
        const importeIva = venta.getImporteIva().toFixed(2);
        const importeNeto = venta.getImporteNeto().toFixed(2);
        const importeTotal = venta.getMonto().toFixed(2);
        if(!this.validarImporteTotal(venta) || !this.validarFecha(fecha)) return console.error('Datos invalidos');
        const tipoDeComprobante = venta.getTipoDeComprobante();


        var numero;

        if(tipoDeComprobante.getDescripcion() == 'FacturaA'){
          numero = sesion.getNumeroComprobanteA();
        }else{
          numero = sesion.getNumeroComprobanteB();
        }
        const tipoDocumento = this.getTipoDocumento(cliente , tipoDeComprobante);
        const numDocumento = this.getNumDocumento(tipoDocumento, cliente);


        const headers = {
          'Content-Type' : 'text/xml;charset=UTF-8',
          'SOAPAction': 'http://ISTP1.Service.Contracts.Service/ILoginService/SolicitarCae'
        }

        const xmlBody = 
          `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:istp="http://ISTP1.Service.Contracts.Service">
          <soapenv:Header/>
          <soapenv:Body>
             <istp:SolicitarCae>
                <istp:token>${token}</istp:token>
                <istp:solicitud xmlns:sge="http://schemas.datacontract.org/2004/07/SGE.Service.Contracts.Data">
                      <sge:Fecha>${fecha}</sge:Fecha>
                      <sge:ImporteIva>${importeIva}</sge:ImporteIva>
                      <sge:ImporteNeto>${importeNeto}</sge:ImporteNeto>
                      <sge:ImporteTotal>${importeTotal}</sge:ImporteTotal>
                      <sge:Numero>${numero}</sge:Numero>
                      <sge:NumeroDocumento>${numDocumento}</sge:NumeroDocumento>
                      <sge:TipoComprobante>${tipoDeComprobante.getDescripcion()}</sge:TipoComprobante>
                      <sge:TipoDocumento>${tipoDocumento}</sge:TipoDocumento>
                </istp:solicitud> 
             </istp:SolicitarCae>
          </soapenv:Body>
       </soapenv:Envelope>
       
       `
      
      try{
        console.log(xmlBody)
        const response = await axios.post(this.url, xmlBody , {headers});

          const parseStringAsync = promisify(parseString);
          const data: any = await parseStringAsync(response.data);

          const cae = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:Cae'][0];
          const error = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:Error'][0];
          const estado = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:Estado'][0];
          const fechaDeVencimiento = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:FechaDeVencimiento'][0];
          const observacion = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:Observacion'][0];
          const tipoComprobante = data['s:Envelope']['s:Body'][0]['SolicitarCaeResponse'][0]['SolicitarCaeResult'][0]['a:TipoComprobante'][0];
          if(estado == 'Aprobada' || estado == 'AprobadaParcialmente'){
              console.log('Venta Aprobada por AFIP');
          }
          return {cae,error,estado,tipoComprobante}
      }catch(error){
        console.error('error en la solicitud SOAP: ',error);
        throw error;
      }
    
  }
    

    private getTipoDocumento(cliente : Cliente, tipoDeComprobante : TipoDeComprobante) : string{
      const dni = cliente.getDni();
      if(dni == 11111111){
        return 'ConsumidorFinal'
      }
      const cuil = cliente.getCuil();
      const cuit = cliente.getCuit();

      console.log(dni,cuil,cuit)

      if(tipoDeComprobante.getDescripcion() == "FacturaB"){
        if(dni && this.validarDni(dni)) return 'Dni';
      }else{
        if(cuit && this.validarCui(cuit)) return 'Cuit';
        if(cuil && this.validarCui(cuil)) return 'Cuil';
      }

      return 'ConsumidorFinal'
    }

    private getNumDocumento(tipoDocumento : string, cliente : Cliente) : number{
      
      if(tipoDocumento == 'Cuil'){
        return cliente.getCuil();
      }else if(tipoDocumento == 'Cuit'){
        return cliente.getCuit();
      }else if(tipoDocumento == 'Dni'){
        return cliente.getDni();
      }

      return 0;
    }

    private validarDni(dni : any) : boolean{
      const num = dni.toString().length;
      if(num >= 7 && num <= 8) return true;
      else return false;
    }

    private validarCui(cui : any) : boolean{
      const num = cui.toString().length;
      if(num == 11) return true;
      else return false;
    }

    private validarFecha(fecha : string) : boolean{
      const fechaParseada = parse(fecha, "yyyy-MM-dd'T'HH:mm:ss.SS", new Date());

    const diferenciaEnDias = differenceInDays(new Date(), fechaParseada);

    return Math.abs(diferenciaEnDias) <= 5;

    }

    private validarImporteTotal(venta : Venta) : boolean{
      return venta.getMonto() > 0;
    }

}

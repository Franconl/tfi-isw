import axios from "axios";
import { Venta } from "../domain/entities/Venta";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { Sesion } from "../domain/entities/Sesion";
import { VentaService } from "./VentaService";
import { parse, differenceInDays } from 'date-fns';
import { Cliente } from "../domain/entities/Cliente";

export class ConexionAfipService {
    private sesion : Sesion;
    private url : string = "http://istp1service.azurewebsites.net/LoginService.svc";

    constructor(sesion : Sesion){
        this.sesion = sesion;
    }

    getSesion() : Sesion {
      return this.sesion;
    }
    
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
                return response.data;
            }catch(error){
                console.error('error en la solicitud SOAP: ',error);
                throw error;
            }

        }
    
    public async solicitarUltimoComprobante() : Promise<any> {
      const token = this.sesion.getTokenAfip();
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
        return response.data
      }catch(error){
        console.error('error en la solicitud SOAP: ',error);
        throw error;
      }

    }

    public async solicitarCae(venta : Venta) : Promise<any> {
        const cliente = venta.getCliente();

        const token = this.sesion.getTokenAfip();
        const fecha = venta.getFecha();
        const importeIva = venta.getImporteIva().toFixed(2);
        const importeNeto = venta.getImporteNeto().toFixed(2);
        const importeTotal = venta.getImporteTotal().toFixed(2);
        if(!this.validarImporteTotal(venta) || !this.validarFecha(fecha)) return console.error('Datos invalidos');
        const tipoDeComprobante = venta.getTipoDeComprobante();


        var numero;

        if(tipoDeComprobante.getDescripcion() == 'FacturaA'){
          numero = this.sesion.getNumeroComprobanteA();
        }else{
          numero = this.sesion.getNumeroComprobanteB();
        }
        const tipoDocumento = this.getTipoDocumento(cliente);
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
                      <sge:TipoComprobante>${tipoDeComprobante}</sge:TipoComprobante>
                      <sge:TipoDocumento>${tipoDocumento}</sge:TipoDocumento>
                </istp:solicitud> 
             </istp:SolicitarCae>
          </soapenv:Body>
       </soapenv:Envelope>
       
       `
      
      try{
        const response = await axios.post(this.url, xmlBody , {headers});
        return response.data
      }catch(error){
        console.error('error en la solicitud SOAP: ',error);
        throw error;
      }
    
  }
    

    private getTipoDocumento(cliente : Cliente) : string{
      const dni = cliente.getDni();
      const cuil = cliente.getCuil();
      const cuit = cliente.getCuit();

      if(dni && this.validarDni(dni)){
        return 'Dni';
      }else if(cuil && this.validarCui(cuit)){
        return 'Cuil';
      }else if(cuit && this.validarCui(cuit)){
        return 'Cuit';
      }
      return 'ConsumidorFinal';
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
      return venta.getImporteTotal() > 0;
    }

    public setToken(token : string){
      this.sesion.setTokenAfip(token);
    }

    public incrementarNumComprobante(tipo : string){
      if(tipo == 'FacturaA'){
        this.sesion.setNumeroComprobanteA(+1);
      }else this.sesion.setNumeroComprobanteB(+1);
    }

    setUltimosComprobantes(tipoDeComprobante : string){
      if(tipoDeComprobante == 'FacturaA'){
        this.sesion.setNumeroComprobanteA(this.sesion.getNumeroComprobanteA() + 1);
      }else{
        this.sesion.setNumeroComprobanteB(this.sesion.getNumeroComprobanteB() + 1);
      }
    }
}

/*import axios from "axios";
import { Venta } from "../domain/entities/Venta";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { Sesion } from "../domain/entities/Sesion";

export class ConexionAfipService {
    private url : string;
    private codigo : string;
    private sesion : Sesion;
    private venta : Venta;

    constructor(url : string = "http://istp1service.azurewebsites.net/LoginService.svc?singleWsdl", codigo : string, sesion : Sesion, venta : Venta){
        this.url = url;
        this.codigo = codigo;
        this.sesion = sesion;
        this.venta = venta;
    }

    getSesion() : Sesion {
      return this.sesion;
    }
    
    public async solicitarToken() : Promise<any> {
        const headers = {
            'Content-Type': 'text/xml;charset=UTF-8',
            'SOAPAction': 'http://ISTP1.Service.Contracts.Service/LoginService/SolicitarAutorizacion',
            };

            const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:istp="http://ISTP1.Service.Contracts.Service">
            <soapenv:Header/>
            <soapenv:Body>
              <istp:SolicitarAutorizacion>
                <codigo>${this.codigo}</codigo>
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
    
    public async solicitarUltimoComprobante(token : string) : Promise<any> {
        const headers = {
            'Content-Type' : 'text/xml;charset=UFT-8',
            'SOAPAction': 'http://ISTP1.Service.Contracts.Service/LoginService/SolicitarUltimosComprobantes'
        }

        const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:istp="http://ISTP1.Service.Contracts.Service">
        <soapenv:Header/>
        <soapenv:Body>
          <istp:SolicitarUltimosComprobantes>
            <token>${token}</token>
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

    getNumComprobante() : number {
        switch(this.venta.getTipoDeComprobante()){
            case TipoDeComprobante.FACTURA_A:
                return 1;
            case TipoDeComprobante.FACTURA_B:
                return 6;
        }
    }

    public async solicitarCae() : Promise<any> {

        const token = this.sesion.getTokenAfip();
        const fecha = this.venta.getFecha();
        const importeIva = this.venta.getImporteIva();
        const importeNeto = this.venta.getImporteNeto();
        const importeTotal = this.venta.getImporteTotal();
        if(!this.validarImporteTotal() || !this.validarFecha(fecha)) return console.error('Datos invalidos');
        const tipoDeComprobante = this.getNumComprobante();
        var numero;

        if(tipoDeComprobante == 1){
          numero = this.sesion.getNumeroComprobanteA();
        }else numero = this.sesion.getNumeroComprobanteB();
    
        const tipoDocumento = this.getNumTipoDocumento();
        const numDocumento = this.getNumDocumento(tipoDocumento);


        const headers = {
          'Content-Type' : 'text/xml;charset=UFT-8',
          'SOAPAction': 'http://ISTP1.Service.Contracts.Service/LoginService/SolicitarCae'
        }

        const xmlBody = 
          `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:istp="http://ISTP1.Service.Contracts.Service">
        <soapenv:Header/>
        <soapenv:Body>
          <istp:SolicitarCae>
            <token>${token}</token>
            <fecha>${fecha}</fecha>
            <ImporteIva>${importeIva}</ImporteIva>
            <ImporteNeto>${importeNeto}</ImporteNeto>
            <ImporteTotal>${importeTotal}</ImporteTotal>
            <Numero>${numero}</Numero>
            <NumeroDocumento>${numDocumento}</NumeroDocumento>
            <TipoComprobante>${tipoDeComprobante}</TipoComprobante>
            <TipoDocumento>${tipoDocumento}</TipoDocumento>
          </istp:SolicitarCae>  
        </soapenv:Body>
      </soapenv:Envelope>`
      
      var attempts = 0;
      try{
        const response = await axios.post(this.url, xmlBody , {headers});
        return response.data
        attempts = 2;
      }catch(error){
        console.error('error en la solicitud SOAP: ',error);
        throw error;
      }
    
  }
    

    private getNumTipoDocumento() : number{
      const dni = this.venta.getCliente().getDni();
      const cuil = this.venta.getCliente().getCuil();
      const cuit = this.venta.getCliente().getCuit();

      if(dni && this.validarDni(dni)){
        return 96;
      }else if(cuil && this.validarCui(cuit)){
        return 86;
      }else if(cuit && this.validarCui(cuit)){
        return 80;
      }
      return 99;
    }

    private getNumDocumento(tipoDocumento : number) : number{
      
      if(tipoDocumento == 86){
        return this.venta.getCliente().getCuil();
      }else if(tipoDocumento == 80){
        return this.venta.getCliente().getCuit();
      }else if(tipoDocumento == 96){
        return this.venta.getCliente().getDni();
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

    private validarFecha(fecha : Date) : boolean{
      const fechaActual = new Date();

      const diferenciaMilisegundos = Math.abs(fechaActual.getTime() - fecha.getTime());
      const diferenciaDias = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    
      return diferenciaDias <= 5;

    }

    private validarImporteTotal() : boolean{
      return this.venta.getImporteTotal() > 0;
    }
}
*/
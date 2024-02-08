import axios from "axios";
import { Venta } from "../domain/entities/Venta";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";
import { Sesion } from "../domain/entities/Sesion";
import { VentaService } from "./VentaService";
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
        console.log(response.data)
        return response.data
      }catch(error){
        console.error('error en la solicitud SOAP: ',error);
        throw error;
      }

    }

    getNumComprobante(venta : Venta) : number {
        switch(venta.getTipoDeComprobante()){
            case TipoDeComprobante.FACTURA_A:
                return 1;
            case TipoDeComprobante.FACTURA_B:
                return 6;
        }
    }

    public async solicitarCae(venta : Venta) : Promise<any> {
        const cliente = venta.getCliente();

        const token = this.sesion.getTokenAfip();
        const fecha = venta.getFecha();
        const importeIva = venta.getImporteIva();
        const importeNeto = venta.getImporteNeto();
        const importeTotal = venta.getImporteTotal();
        if(!this.validarImporteTotal(venta) || !this.validarFecha(fecha)) return console.error('Datos invalidos');
        const tipoDeComprobante = this.getNumComprobante(venta);
        var numero;

        if(tipoDeComprobante == 1){
          numero = this.sesion.getNumeroComprobanteA();
        }else numero = this.sesion.getNumeroComprobanteB();
    
        const tipoDocumento = this.getNumTipoDocumento(cliente);
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
                <istp:solicitud>
                   <istp:Fecha>2024-02-09T02:01:32.18</istp:Fecha>
                   <istp:ImporteIva>5000.50</istp:ImporteIva>
                   <istp:ImporteNeto>20000.00</istp:ImporteNeto>
                   <istp:ImporteTotal>25000.50</istp:ImporteTotal>
                   <istp:Numero>7</istp:Numero>
                   <istp:NumeroDocumento>43175379</istp:NumeroDocumento>
                   <istp:TipoComprobante>6</istp:TipoComprobante>
                   <istp:TipoDocumento>96</istp:TipoDocumento>
                </istp:solicitud>
             </istp:SolicitarCae>
          </soapenv:Body>
       </soapenv:Envelope>
       `
      
      try{
        const response = await axios.post(this.url, xmlBody , {headers});
        console.log(response.data);
        return response.data
      }catch(error){
        console.error('error en la solicitud SOAP: ',error);
        throw error;
      }
    
  }
    

    private getNumTipoDocumento(cliente : Cliente) : number{
      const dni = cliente.getDni();
      const cuil = cliente.getCuil();
      const cuit = cliente.getCuit();

      if(dni && this.validarDni(dni)){
        return 96;
      }else if(cuil && this.validarCui(cuit)){
        return 86;
      }else if(cuit && this.validarCui(cuit)){
        return 80;
      }
      return 99;
    }

    private getNumDocumento(tipoDocumento : number, cliente : Cliente) : number{
      
      if(tipoDocumento == 86){
        return cliente.getCuil();
      }else if(tipoDocumento == 80){
        return cliente.getCuit();
      }else if(tipoDocumento == 96){
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

    private validarFecha(fecha : Date) : boolean{
      const fechaActual = new Date();

      const diferenciaMilisegundos = Math.abs(fechaActual.getTime() - fecha.getTime());
      const diferenciaDias = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    
      return diferenciaDias <= 5;

    }

    private validarImporteTotal(venta : Venta) : boolean{
      return venta.getImporteTotal() > 0;
    }
}

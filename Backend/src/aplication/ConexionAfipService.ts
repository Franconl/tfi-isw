import axios from "axios";
import { Venta } from "../domain/entities/Venta";
import { TipoDeComprobante } from "../domain/entities/TipoDeComprobante";

export class ConexionAfipService {
    private url : string;
    private codigo : string;

    constructor(url : string = "http://istp1service.azurewebsites.net/LoginService.svc?singleWsdl", codigo : string){
        this.url = url;
        this.codigo = codigo;
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

    getNumComprobante(venta : Venta) : number {
        switch(venta.getTipoDeComprobante()){
            case TipoDeComprobante.FACTURA_A:
                return 1;
            case TipoDeComprobante.FACTURA_B:
                return 6;
        }
    }

    public async solicitarCae(venta : Venta) : Promise<any> {
        const fecha = venta.getFecha;
        const importeIva = venta.getImporteIva();
        const importeNeto = venta.getImporteNeto();
        const importeTotal = venta.getImporteTotal();
        const numero  = 2; //numero comprobante
        const numDocumento = venta.getCliente().getDni();
        const tipoDeComprobante = this.getNumComprobante(venta);
    }
}
    
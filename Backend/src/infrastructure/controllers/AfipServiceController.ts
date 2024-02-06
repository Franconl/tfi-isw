import { ConexionAfipService } from "../../aplication/ConexionAfipService";

export class AfipServiceController {

    private afipService : ConexionAfipService;

    constructor(afipService : ConexionAfipService){
        this.afipService = afipService;
    }

    public async solicitarToken() : Promise<any>{
        try{

            const response = await this.afipService.solicitarToken();
            this.afipService.getSesion().setTokenAfip(response.token);
            console.log(response,'<<<<<<<<<<<<<<<<<--------------------')

        } catch (error) {
            console.error('Error al solicitar Token:', error);
            return null;
          }
    }

    public async solicitarUltimoComprobante(){
        try{

            const response = await this.afipService.solicitarUltimoComprobante();
            this.afipService.getSesion().setNumeroComprobanteA(response.A);
            this.afipService.getSesion().setNumeroComprobanteB(response.B);

        } catch (error) {
            console.error('Error al solicitar Token:', error);
            return null;
          }
    }
}
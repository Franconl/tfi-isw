import { TarjetaData } from "../domain/entities/TarjetaData";
import { TarjetaRes } from "../domain/entities/TarjetaRes";

export class ConexionTarjetaService {
  private apiKey: string;
  private url: string;

  constructor(apiKey: string = 'b192e4cb99564b84bf5db5550112adea', url: string = 'https://developers.decidir.com/api/v2/tokens') {
    this.apiKey = apiKey;
    this.url = url;
  }

  public async solicitarToken(tarjetaData: TarjetaData): Promise<TarjetaRes> {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'api-key': this.apiKey
        },
        body: JSON.stringify(tarjetaData.getData())
      };

      const response = await fetch(this.url, requestOptions);

      if (!response.ok) {
        throw new Error(`Error al solicitar token: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Respuesta del servicio:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error al solicitar token:', error);
      throw error;
    }
  }

  public async confirmarPago(siteTransactionId: string, token: string, monto: number): Promise<TarjetaRes> {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          site_transaction_id: siteTransactionId,
          payment_method_id: 1,
          token: token,
          bin: "450799",
          amount: monto,
          currency: "ARS",
          installments: 1,
          description: "",
          payment_type: "single",
          establishment_name: "single",
          sub_payments: [{
            site_id: "",
            amount: monto,
            installments: null
          }]
        })
      };

      const response = await fetch(this.url, requestOptions);

      if (!response.ok) {
        throw new Error(`Error al realizar el pago: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Respuesta del servicio de pago:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error al realizar el pago:', error);
      throw error;
    }
  }
}

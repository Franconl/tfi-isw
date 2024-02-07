import { TarjetaData } from "../domain/entities/TarjetaData";
import { TarjetaRes } from "../domain/entities/TarjetaRes";
import { Venta } from "../domain/entities/Venta";
import { VentaService } from "./VentaService";

export class ConexionTarjetaService {
  private venta! : Venta;

  constructor(ventaService: VentaService) {

    const venta = ventaService.getVenta();

    if (venta instanceof Venta) {
      this.venta = venta;
    } else {
      console.error('La venta obtenida no es una instancia de Venta');
    }
  }

  public async solicitarToken(tarjetaData: TarjetaData): Promise<any> {
    try {
      console.log(this.venta,'<-------')
      const requestOptions = {
        method: 'POST',
        headers: {
          'apikey': 'b192e4cb99564b84bf5db5550112adea',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(tarjetaData)
      };

      const response = await fetch('https://developers.decidir.com/api/v2/tokens',requestOptions);

      if (!response.ok) {
        throw new Error(`Error al solicitar token: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData.id;
    } catch (error) {
      console.error('Error al solicitar token:', error);
      throw error;
    }
  }

  public async confirmarPago(token: string, monto: number): Promise<any> {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'apikey': '566f2c897b5e4bfaa0ec2452f5d67f13',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site_transaction_id: this.venta.getId(),
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

      const response = await fetch('https://developers.decidir.com/api/v2/payments', requestOptions);

      if (!response.ok) {
        throw new Error(`Error al realizar el pago: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData.status;
    } catch (error) {
      console.error('Error al realizar el pago:', error);
      throw error;
    }
  }
}

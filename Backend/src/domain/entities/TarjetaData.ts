export class TarjetaData {
    private data: any;
  
    constructor(
      cardNumber: string,
      expirationMonth: string,
      expirationYear: string,
      securityCode: string,
      cardHolderName: string,
      cardHolderIdentification: { type: string; number: string }
    ) {
      this.data = {
        card_number: cardNumber,
        card_expiration_month: expirationMonth,
        card_expiration_year: expirationYear,
        security_code: securityCode,
        card_holder_name: cardHolderName,
        card_holder_identification: cardHolderIdentification
      };
    }
  
    getData(): any {
      return this.data;
    }
  }
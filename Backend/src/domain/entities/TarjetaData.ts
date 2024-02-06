export class TarjetaData {
    private data: any;
  
    constructor(
      card_number : string,
      card_expiration_month: string,
      card_expiration_year: string,
      security_code: string,
      card_holder_name: string,
      card_holder_identification: {type : string, dni : string}
    ) {
      this.data = {
        card_number: card_number,
        card_expiration_month: card_expiration_month,
        card_expiration_year: card_expiration_year,
        security_code: security_code,
        card_holder_name: card_holder_name,
        card_holder_identification: card_holder_identification
      };
    }
  
    getData(): any {
      return this.data;
    }
  }
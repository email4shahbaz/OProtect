import Model from 'react-native-models';

export default class QuotationItem extends Model {
  static get className() {
      return "QuotationItem";
  }
  constructor(){
      super({
            mem_uid: "String",
            prebooking_id: "String",
            day_rate: "String",
            night_rate: "String",
            sunday_day_rate: "String",
            sunday_night_rate: "String",
            holiday_rate: "String",
            qt_message: "String",
            calculated_price: "Number",

      });
    }
}


import Model from 'react-native-models';

export default class Auth extends Model {
  static get className() {
      return "Auth";
  }
  constructor(){
      super({
            is_mobile: "Number",
            step: "Number",
            login: "String",
            mem_email: "String",
            mem_phone: "String",
            mem_phone_country_code: "String",
            mem_company: "String",
            CompanyName: "String",
            CompanyNumber: "String",
            urole_id: "Number",
            flowlu_account_type: "Number",
            mem_type: "Number",
            mem_address: "String",
            lat: "String",
            lng: "String",
            place_id: "String",
            mem_fname: "String",
            mem_lname: "String",
            mem_name: "String",
            user_password: "String",
            provider_id: "Number",
            sm_id: "String",
            phone_verified:"Number",
      });
    }
}

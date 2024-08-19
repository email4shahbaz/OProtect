import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity} from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import PhoneInput from 'react-native-smooth-phone-input';
import Country from 'react-native-smooth-phone-input/src/country';


export class PhoneInputWithModal extends React.Component {
      phoneRef:any = null;

      constructor(props) {
            super(props);

            this.state = {
                  //cca2: "il",
                  //countryCode: "+972",
                  cca2: "il",
                  countryCode: "+972",
                  phoneNumber: '',
                  showCountryPicker:false,
                  isValidNumber: false,
            };
      }

      render() {
            //  const{onSelect}=this.onSelectCountry;
            const{cca2, showCountryPicker, countryCode, phoneNumber}=this.state;
            return (
                  <View style={{ height: 50}} >
                        <View style={styles.pcontainer}>
                              <View style={{flexDirection: 'row', alignItems: 'center'}}>

                                    <View>
                                          <PhoneInput ref={this.setPhoneRef}
                                                value={phoneNumber}
                                                enabled={false}
                                                initialCountry={cca2}
                                                onChangePhoneNumber={this.onPhoneNumberChange} />

                                          <TouchableOpacity onPress={this.onPressFlag} style={{position: 'absolute', backgroundColor: '#FFFFFF55', padding: 20}}>
                                          </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.textInput, styles.countryCode]}  editable={false} >({countryCode})</Text>
                                    <TextInput placeholder='Entrez le numéro de téléphone' keyboardType='phone-pad' textContentType='telephoneNumber' style={[styles.textInput, styles.phoneNumber]}  onChangeText={(txt)=>this.onPhoneEntered(txt)} />
                              </View>

                              <View>
                                    <CountryPicker
                                    placeholder=''
                                    withFilter
                                    visible={showCountryPicker}
                                    onClose={()=>this.setState({showCountryPicker:false})}
                                    onSelect={(cntry) => this.handleSelectCountry(cntry)}
                                    />
                              </View>
                        </View>

                        { !this.state.isValidNumber && (
                              <View style={{height: 3, backgroundColor: 'red'}} />
                        )}

                        { this.state.isValidNumber && (
                              <View style={{height: 3, backgroundColor: 'green'}} />
                        )}

                  </View>
            );
      }

      setPhoneRef = (ref: any) => (this.phoneRef = ref);

      handleSelectCountry = (country) => {
            //  console.log(country);
            this.setState({cca2: country.cca2, showCountryPicker:false, countryCode: '+'+country.callingCode[0]});
            this.phoneRef.selectCountry(country.cca2.toLowerCase());

            if(this.props.onCountryChanged){
                  this.props.onCountryChanged(country.cca2.toLowerCase());// ? ()=>{console.log("callback");} : null;
            }
      };

      onPhoneNumberChange = (phone) =>{
            this.setState({isValidNumber: this.phoneRef.isValid()})
            if(this.phoneRef.isValid()){
                  this.setState({phoneNumberValid: true})
                  if(this.props.onValidNumberEntered){
                        this.props.onValidNumberEntered(this.state.countryCode, phone);// ? ()=>{console.log("callback");} : null;
                  }
            }
            else{
                  this.setState({phoneNumberValid: false});
                  if(this.props.onInvalidNumberEntered){
                        this.props.onInvalidNumberEntered(phone);// ? ()=>{console.log("callback");} : null;
                  }
            }
      }

      onPressFlag = () => {
            this.setState({showCountryPicker: true});
      }

      onPhoneEntered = (txt) => {
            this.setState({phoneNumber: txt})
      }

      getPhoneWithCode =() => {
            return "+"+this.state.countryCode+this.phoneNumber;
      }






}


PhoneInputWithModal.propTypes = {
      onChangePhoneNumber: PropTypes.func,
}


const styles = StyleSheet.create({
      pcontainer:{
            padding: 10,
            flexDirection: 'row',
            backgroundColor: '#fff',
            width: '100%',
      },
      textInput:{
            fontSize: 18,
            paddingTop:  0,
      },

      countryCode:{
            paddingTop: 0,
      },
      phoneNumber:{
            marginTop: 2,
            fontSize: 18,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
      }

});

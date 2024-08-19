// @flow

// #region imports
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import PhoneInput from 'react-native-smooth-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
// #endregion

// #region flow types
export type Props = { ...any };

export type State = {
  pickerData: Array<any> | null,
  cca2?: string,
  initialValue?: string,
  initialCountry: 'an' | 'us' | 'uk',
  placeholder?: string,
  isValidPhoneNumber: boolean,
  countryCode: string,
  isoCode: string,
  intPhoneNum: string,
  showpicker: boolean,

  ...any,
};
// #endregion

// #region constants
const { height: deviceHeight } = Dimensions.get('window');
// #endregion

export class Signup extends Component<Props, State> {
  // #region references
  phone: any = null;
  // #endregion
  state = {
    cca2: 'pk',
    placeholder: '',
    initialCountry: 'pk',
    initialValue: null,
    isValidPhoneNumber: false,
    countryCode: '',
    isoCode: '',
    intPhoneNum: '',
    showpicker: false
  };

  // #region lifecycle
  componentDidMount() {
    this.setState({ pickerData: this.phone.getPickerData()});
  }

  render() {
    const {cca2, placeholder, initialCountry,  initialValue, isValidPhoneNumber, countryCode, isoCode, intPhoneNum, showpicker,} = this.state;
    const valueProps = !initialValue ? {} : { value: initialValue };

    return (
      <View style={styles.container}>
        <View style={styles.phoneForm}>
          {/* phone input: */}
          <PhoneInput
            ref={this.setPhoneRef}
            style={styles.phoneInput}
            initialCountry={cca2}

            textProps={{ placeholder, keyboardType: 'phone-pad',  textContentType: 'telephoneNumber', }}
            {...valueProps}
            onChangePhoneNumber={this.handlesOnInputChange}>

          </PhoneInput>

          <View style={styles.statusContainer}>
            <Text>
              Phone number is valid:{' '}
              {!isValidPhoneNumber ? 'NOT A VALID NUMBER' : 'VALID!'}
            </Text>
            <Text>country code: {countryCode || ''}</Text>
            <Text>iso code: {isoCode || ''}</Text>
            <Text>international phone number: {intPhoneNum || ''}</Text>
          </View>


        </View>
      </View>
    );
  }
  // #endregion

  // #region phone input related

  // #region set phone input reference
  setPhoneRef = (ref: any) => (this.phone = ref);
  // #endregion

  // #region on press flag (open country  modal)
  onPressFlag = () =>  {
    //console.log(this.phone.getState("iso2"));
    this.phone.selectCountry({cca2: "us"});
    //this.setState({cca2: "ad"});
    //console.log(this.phone.selectCountry("india"));
  //  this.mobile.setCountry("us");//this.setState({showpicker: true});
  }

  // #endregion

  // #region on input change event
  handlesOnInputChange = (value: string) => {
    this.setState({
      cca2: value,
      isValidPhoneNumber: this.phone.isValid(),
      countryCode: this.phone.getCountryCode(),
      isoCode: this.phone.getISOCode(),
      intPhoneNum: this.phone.getInternationalFormatted(),
    });

    const payload = {
      phone: this.phone.getInternationalFormatted(),
      isValidNumber: this.phone.isValid(),
      isoCode: this.phone.getISOCode(),
      countryCode: this.phone.getCountryCode(),
    };

    console.log('handlesOnInputChange: payload: ', payload);
  };
  // #endregion

  // #endregion

  // #region country picker related

  // #region set countryPicker reference
  setCountryPicker = (ref: any) => (this.countryPicker = ref);
  // #endregion

  // #region on country selection
  handlesOnSelectCountry = ({ cca2 }: { cca2: string }) => {
    //console.log(cca2.toLowerCase());
    this.setState()
    console.log(cca2.toLowerCase());
    //this.phone.selectCountry(this.cca2.toLowerCase());

  };



  // #region on country selection
  handlesOnSelectCountry = ({flag}: {flag: string}) => {
    //console.log(cca2.toLowerCase());
    console.log(flag);

  };



  // #endregion

  // #endregion
}

// #region styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  phoneForm: {
    marginTop: (deviceHeight * 1) / 5,
    flex: 1,
    paddingHorizontal: 10,
  },
  statusContainer: {
    marginVertical: 20,
  },

  phoneInput: {
    height: 50,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    borderColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 1,
  }
});

const countryPickerStyle = StyleSheet.create({
  itemCountryName: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  countryName: {
    color: '#4A4A4A',
    borderColor: 'transparent',
    fontSize: 15,
  },
  letterText: {
    color: '#4A4A4A',
    borderColor: 'transparent',
  },
  input: {
    color: '#4A4A4A',
    borderBottomWidth: 1,
    fontSize: 15,
    borderColor: '#4A4A4A',
  },
  closeButton: {
    height: 56,
    padding: 10,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonImage: {
    height: 32,
    width: 32,
  },
});
// #endregion

export default Signup;

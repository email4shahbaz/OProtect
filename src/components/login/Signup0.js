import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';


import LinearGradient from 'react-native-linear-gradient';
import PhoneInput from 'react-native-smooth-phone-input';
import CountryPicker from 'react-native-country-picker-modal';

export class Signup extends Component {


  constructor(props) {
    super(props);

   this.onPressFlag = this.onPressFlag.bind(this);
   this.selectCountry = this.selectCountry.bind(this);

    state = {
      email   : '',
      password: '',
      cca: 'PK',
      showpicker: true,
    }
  }

  componentDidMount() {
    //Alert.alert("Hi", this.countryPicker);
    this.setState({
      pickerData: this.phone.getPickerData(),
      showpicker: true,
    });
  }

  onPressFlag() {
    Alert.alert("Hi", "Hello");
    this.setState({showpicker: true});

  }






  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca: country.cca2 });
  }


  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  loginClicked = () => {
     this.props.navigation.navigate("login");
  }

  render() {
    return (





        <View style={styles.container}>



        <LinearGradient colors={['#4A55FF', '#4A55FF', '#8891FF']} style={styles.mainBg} >
          <Text style={styles.txtHeading}>{this.props.route.params.type}</Text>

          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}

                placeholder="Full name"
                underlineColorAndroid='transparent'
                onChangeText={(name) => this.setState({name})}/>
            <Image style={styles.inputIcon} source={require('../../images/icon_user.png')}/>
          </View>


          <View style={styles.inputContainer}>
            <PhoneInput style={styles.inputs}
                textProps={{
                      placeholder: "+923004343163",
                      keyboardType: 'phone-pad',
                      textContentType: 'telephoneNumber',
                    }}

              ref={(ref) => {
                  this.phone = ref;
              }}
               initialCountry="pk"
               onPressFlag={this.onPressFlag}
                underlineColorAndroid='transparent'
                onChangeText={(phone) => this.setState({phone})}/>
            <Image style={styles.inputIcon} source={require('../../images/icon_cellphone.png')}/>
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid='transparent'
                onChangeText={(email) => this.setState({email})}/>
            <Image style={styles.inputIcon} source={require('../../images/icon_email.png')}/>
          </View>

          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({password})}/>
            <Image style={styles.inputIcon} source={require('../../images/icon_password.png')}/>
          </View>

          <TouchableOpacity style={styles.btnByRegister} onPress={() => this.onClickListener('restore_password')}   >

              <Text style={styles.textByRegister}>By registering on this App you confirm that you have read and accept our policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.onClickListener('login')}>
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.buttonContainer} onPress={() => this.loginClicked()}>
              <Text style={styles.btnText}>Have an account?</Text>
          </TouchableOpacity>
          </LinearGradient>


        </View>
    );
  }
}

const resizeMode = 'center';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  mainBg: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  txtHeading:{
    color:"white",
    fontSize: 36,
    marginBottom: 20,
    fontWeight:'bold',
    textAlign:'center',
  },

  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:300,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',

    /*shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,*/
  },
  inputs:{
    height:45,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginRight:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:300,
    borderRadius:30,
    backgroundColor:'transparent'
  },
  btnByRegister: {
    height:15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:20,
    width:300,
    backgroundColor:'transparent'
  },
  loginButton: {
    backgroundColor: "#00b5ec",

  /*  shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.50,
    shadowRadius: 12.35,

    elevation: 19,*/
  },
  loginText: {
    color: 'white',
  },
  bgImage:{
    flex: 1,
    resizeMode,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btnText:{
    color:"white",
    fontWeight:'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  textByRegister:{
    color:"white",
    //fontWeight:'bold',
    textAlign:'center',

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});

import React, { Component } from 'react';
import {StyleSheet, ScrollView, Image, Text, View, Alert, Keyboard, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import {Appbar, TextField, Button, Icon, ProgressCircle, ProgressBar, Ripple } from 'material-bread';

import auth from '@react-native-firebase/auth';

import UserModel from '../.././models/UserModel';

import Auth from '../.././models/Auth';
import { validate } from 'validate.js';
import constraints from './constraints.js';

import {PhoneInputWithModal} from '../.././components/reuseable/PhoneInputWithModal';
import styles from './../../../OProtect.styles.js';

export class Login extends Component {
	authInfo={};
	phoneAuth=null;
	accountPhone="";
	timer=null;
	smsCodeInput=null;

	//0=new, 1=existing with phone, 2=existing without phone (password), 3=existing without phone, without password
	accountType=0;
	msg="";



	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			phoneNumberTypes: false,
			step: 1,
			errors:{},
			smsCodeEntered: false,
			countDownSeconds: 60,
			countDownStarted: false,
			data: { emailAddress: "" },
			codeStr: '  -  -  -  -  -  -',
			smsCode: ''
		};

		this.authInfo.is_mobile=1;
	}

	handleOnEmailEntered = (email) => {
		this.setState({data: {emailAddress: email}});
		this.authInfo.login=email;
		this.authInfo.mem_email=email;
		const validationResult = validate(this.state.data, constraints);
		this.setState({ errors: validationResult });
	}

	handleOnInvalidPhoneEntered = (num) => {
		let typed=true;
		if(num==''){typed=false;}
		this.setState({validPhone: false, phoneNumberTyped: typed});
	}

	handleOnValidPhoneEntered = (code, num) => {
		let typed=true;
		if(num==''){typed=false;}
		this.authInfo.mem_phone=code+num;
		this.setState({validPhone: true, dialCode: code, validPhoneNumber: code+num,  phoneNumberTyped: typed});
	}





	login = async () => {
		 // validationResult is undefined if there are no errors
		 if(this.state.errors!=undefined){return;}

		try{
			this.authInfo.step=this.state.step;
			this.setState({isLoading: true})
			fetch('https://www.oprotect.com/api/index.php?action=login', {
			    method: 'post',
			    body: JSON.stringify(this.authInfo),
			}).then(function(response) {
			    return response.json();
		    }).then(this.onLoginResult)
			.finally(() => {
	                  this.setState({ isLoading: false });
	            });
		}
	    	catch (error) {
			Alert.alert("Error", "Error");
			console.error(error);
	    	}
     }


     saveUserData = async(userData) =>{
   		try {
   			//Alert.alert(userData.toString());
        	await AsyncStorage.setItem('user', JSON.stringify(userData));
			this.setState({step: 1});
        		this.props.navigation.navigate("homeScreen");
      	}
      	catch (error) {
      		Alert.alert(error.toString());
        		// Error saving data
      	}
     }

	 onLoginResult = (result) =>{
		if (result.status=== '1'){
			Keyboard.dismiss();
			this.accountType=result.chk_status;
			this.accountPhone=result.phone;

			//User data found. proceed to next screen.
			if(result.data){
			  	this.saveUserData(result.data);
            }

			//
			else{
				if(this.accountType==='0'){
					//email not exist
					this.props.navigation.navigate("signup", {auth: this.authInfo});
				}
				else{
					this.authInfo.phone_verified=1;
					this.setState({smsCodeEntered: true, step: 2});
					this.login();
				}
			}
		}
	 }


	onLoginResult2 = (result) => {
		if (result.status=== '1'){
			Keyboard.dismiss();
			this.accountType=result.chk_status;
			this.accountPhone=result.phone;

			//User data found. proceed to next screen.
			if(result.data){
				  	this.saveUserData(result.data);
            }

			else{
				if(this.accountType==='0'){
					//email not exist
					this.setState({step:2});
					this.msg="Aucun compte n'a été trouvé avec l'email que vous avez fourni, vérifiez votre numéro de téléphone pour continuer l'inscription.";
				}

				else if(this.accountType==='1'){
					//email and phone number exist
					if(result.phone!=""){
					    this.setState({step:2});
					    this.msg="Un compte avec ce mail est déjà existant. Verifiez votre numéro de télephone pour pouvoir continuer";

					}
				}

				else if(this.accountType==='2'){
					//email exists phone number NOT exist
					 this.setState({step:2});
					 this.msg="Vous devez vérifier votre numéro de téléphone pour l'ajouter à votre compte et continuer à vous connecter.";
				}
			}
		}

		else if(result.status=='2'){
			this.authInfo.phone_verified=1;
			this.props.navigation.navigate("signup", {auth: this.auth});
		}
		else{
			Alert.alert("Signin Failed", result.message);
		}
	}

	verifyPhone = () => {
		this.setState({step: 3});

	}

	sendSMS = async () => {
		this.setState({})
		this.authInfo.phone_verified=1;
		//UNCOMMENT TO SEND ACTION SMS
		if(this.accountPhone!='' && this.accountPhone!=this.state.validPhoneNumber){
			Alert.alert("Phone Number Mismatch", "Phone number you entered does not match with your account phone number");
		}
		else{
			this.setState({isLoading: true});
			this.phoneAuth = await auth().signInWithPhoneNumber(this.state.validPhoneNumber);
			this.setState({isLoading: false});
			if(this.phoneAuth){
				this.startCountDown();
				this.setState({step: 4});
			}
			else{
				Alert.alert("Error authentication");
			}
		}

	}


	onSMSCodeEntered = (code) => {
		let arr=code.split("");
		let codeStr="";
		for(let c=0; c < 6; c++){
			if(c<arr.length){
    			codeStr=codeStr+' '+arr[c]+' ';
			}
			else{
				codeStr=codeStr+ ' - ';
			}
		}
		this.setState({codeStr: codeStr});
		if(code.length==6){
			Keyboard.dismiss();
			this.setState({smsCodeEntered: true, smsCode: code});
		}
		else{
			this.setState({smsCodeEntered: false, smsCode: code});
		}
	}

	verifySMSCode = () => {
		if(this.timer!=undefined){
			clearInterval(this.timer);
		}

		this.setState({isLoading: true});

		this.phoneAuth.confirm(this.state.smsCode).then(result =>{
		     this.setState({isLoading: false});
		     if(this.accountPhone===''){
				this.authInfo.phone_verified=1;
				this.props.navigation.navigate("signup", {auth: this.authInfo});
			}

			else {
				this.setState({smsCodeEntered: true, step: 2});
				this.login();
			}
		}).
	     catch(error => {
		     this.setState({isLoading: false});
		     Alert.alert(error.toString());
	     });
	}


	startCountDown = () =>{
		if(this.timer!=undefined){
			clearInterval(this.timer);
		}

		this.setState({countDownStarted: true});
		timer = setInterval(() => {
      		this.setState({countDownSeconds: this.state.countDownSeconds-1});
			if(this.state.countDownSeconds==0){
				clearInterval(this.timer);
				this.setState({countDownStarted: false, countDownSeconds: 60});
			}
    	}, 1000);
	}






	render() {
		return (
			<View  style={styles.container}>
				{this.state.step==1 &&(
					<View style={{padding: 30}}>
						<View style={{flex:1, width: '100%', alignItems: 'center', marginTop: 20, marginBottom: 60}}>
							<Image source={require('../.././images/op_logo.png')} style={{width: 200, height: 40}}/>
						</View>
						<View style={styles.contentContainerStyle}>
							<Text style={[styles.login_heading, styles.text_primary_color]}>Se connecter / s'inscrire</Text>
							<Text style={[styles.login_sub_heading, styles.text_secondary_color]}>Pour continuer sur Oprotect</Text>
						</View>

						<Text style={styles.login_label}>Entrez votre email</Text>

						<TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 18}}
				                   type={'outlined'}
				                   containerStyle={{ marginTop: 10, marginBottom: 10,}}
							 borderWidth={2}
							 borderColor={this.state.errors===undefined ? ('#00AED8'):('#777777')}
				                   label={'Email*'}
				                   trailingIcon={
				                     <Icon name={'email'} size={24} color={'#6e6e6e'} />
				                   }
				                   onChangeText={(email) => this.handleOnEmailEntered(email) }
							 value={this.state.data.emailAddress}

				                 />

					      <Button fullWidth type="contained" containerStyle={{marginTop: 10, height: 48}} style={{height: 50}} onPress={()=>this.login()}  textStyle={{fontSize: 20}} text={'SUIVANT'} color={'#002D4C'} textColor={'#ffffff'}  />
					</View>
					)}

				{this.state.step==2 &&(
					<View style={{padding: 30}}>
						<View style={styles.contentContainerStyle}>
							<Text style={[styles.login_heading, styles.text_primary_color]}>Vérification du numéro de téléphone</Text>
							<Image style={{marginTop: 20, width:100, height: 100,}} source={require('../.././images/icon_key.png')} />
						</View>
						<Text style={styles.login_label}>{this.msg}</Text>
					      <Button fullWidth type="contained" containerStyle={{marginTop: 10, height: 48}} style={{height: 50}} onPress={()=>this.verifyPhone()}  textStyle={{fontSize: 14}} text={'VÉRIFIER VOTRE NUMÉRO DE TÉLÉPHONE'}  color={'#002D4C'} textColor={'#ffffff'}  />
					</View>
				)}

				{this.state.step==3 &&(
					<View style={{padding: 0}}>
						<Appbar barType={"normal"} title={'Entrez votre numéro de téléphone'} color={'#002D4C'} />
						<View style={[styles.contentContainerStyle, {marginLeft: 20, marginRight: 20}]}>
							<View style={{width: '100%', marginTop: 20}}>
								<PhoneInputWithModal style={{width: '100%', height: 24, left:40}}
								onValidNumberEntered={(code, num)=>{this.handleOnValidPhoneEntered(code, num)}}
								onInvalidNumberEntered={(num)=>{this.handleOnInvalidPhoneEntered(num)}}
								 />

							</View>

							{!this.state.validPhone && this.state.phoneNumberTyped &&(
								<Text style={{marginTop: 5, marginLeft: 30, marginRight: 30, color: 'red'}}>Entrez un numéro de téléphone valide</Text>
							)}

						</View>
						<View style={{marginTop: 10, marginLeft: 30, marginRight:30}}>
							<Button fullWidth type="contained" containerStyle={{marginTop: 10, height: 48}} style={{height: 50}} onPress={()=>this.sendSMS()}  textStyle={{fontSize: 14}} text={'VÉRIFIER VOTRE NUMÉRO DE TÉLÉPHONE'}  color={'#002D4C'} textColor={'#ffffff'} />
						</View>
						<Text style={[styles.login_label, {marginLeft: 30, marginRight: 30, color: '#777777'}]}>En cliquant sur "vérifier votre numéro de téléphone" un SMS vous serra envoyé. Des frais peuvent être appliqués par votre opérateur.</Text>
					</View>
				)}


				{this.state.step==4 &&(
					<View style={{padding: 0}}>
						<Appbar barType={"normal"} title={'VÉRIFIER VOTRE NUMÉRO DE TÉLÉPHONE'} color={'#002D4C'} />

						<View style={{fontSize: 14, marginTop: 10, marginLeft: 20, marginRight: 20}}>
							<Text style={{marginTop: 5}}>{
`Entrez le code à 6 chiffres que nous
avons envoyé à`}</Text>
							<Text style={{marginTop: 5, color: 'blue'}}>{this.state.validPhoneNumber}</Text>

						</View>
						<View style={{alignItems: 'center'}}>
							<View style={{width: '100%', height: 90, alignItems: 'center'}} >
								<TextInput ref={(tf)=>this.smsCodeInput = tf} onChangeText={(txt)=>{this.onSMSCodeEntered(txt)}} autoFocus keyboardType={'numeric'}></TextInput>
								<View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: 80, backgroundColor: 'white'}}></View>
								<Text style={{position: 'absolute', zIndex: 100, color: 'black', fontSize: 40}} onPress={()=> {this.smsCodeInput.focus()}} >{this.state.codeStr}</Text>
							</View>
							{this.state.smsCodeEntered && (
								<Button fullWidth type="contained" containerStyle={{marginTop: 10, height: 48}} style={{height: 50}} onPress={()=>this.verifySMSCode()}  textStyle={{fontSize: 14}} text={'Vérifier'}  color={'#002D4C'} textColor={'#ffffff'}  />
							)}

							<TouchableOpacity style={{marginTop: 20, enabled: false}} onPress={()=>this.sendSMS()}>
								<Text style={{color: this.state.countDownStarted ? 'grey' : 'blue'}}>{this.state.countDownStarted ? `Renvoyer le code (00:${this.state.countDownSeconds})` : 'Renvoyer le code'}</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}



				{ this.state.isLoading && (
					<View style={styles.loader}>
					    <ProgressCircle color={'#E91E63'} />
					</View>
				)}

			</View>
		);
	}
}

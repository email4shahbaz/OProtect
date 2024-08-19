import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert, Keyboard} from 'react-native';
import {TextField, Button, Icon, ProgressCircle, Appbar } from 'material-bread';
import LinearGradient from 'react-native-linear-gradient';
import UserModel from '../.././models/UserModel';
import {PhoneInputWithModal} from '../.././components/reuseable/PhoneInputWithModal';

import styles from './../../../OProtect.styles.js';

export class ChangePassword extends Component {

	constructor(props) {
		super(props);
		this.state = {
	             isLoading: false,
	             user: props.route.params.user,
			 currentPass: '',
			 newPass:'',
			 confirmNewPass:'',
	      };
	}


	handleOnPhoneEntered = (phone) => {
		this.user.setLogin(phone);
	}

	changePassword = async () => {
		Keyboard.dismiss();
		if(this.state.user.getPass()==this.state.currentPass){
			if(this.state.newPass==this.state.confirmNewPass){
				this.callChange();
			}
			else{
				Alert.alert("Password Mismatch", "Both your password and confirmation password does not match");
			}
		}
		else{
			Alert.alert("Password Mismatch", "Entered password does not match with your current password");
		}
     }

     callChange = () =>{
	     Keyboard.dismiss();

	     //let str=JSON.stringify({mem_uid: this.state.user.getMem_uid(), pass: this.state.newPass});


	     try{
		     this.setState({isLoading: true})
		     fetch('http://www.helpline-app.com/api/index.php?action=update_password', {
			   method: 'post',
			   body: JSON.stringify(
				   {mem_uid: this.state.user.getMem_uid(), pass: this.state.newPass}
			   ),
		     }).then(function(response) {
			   return response.json();
		   }).then(this.onChangePasswordSuccess)
		     .finally(() => {
			     this.setState({ isLoading: false });
		     });
	     }
	     catch (error) {
		     Alert.alert("Error", "Error");
		     console.error(error);
	     }
     }

	onChangePasswordSuccess = (result) => {
		if (result.status=== '1'){
			Alert.alert("Password Changed", "Your password changed successfully");
			this.passwordChanged();
		}
		else{
			Alert.alert("Password Change Failed", result.message);
		}
	}

	passwordChanged = () => {
		//userModel={__RNM_CLASS_NAME__: "UserModel", data: data};
		UserModel.require(UserModel);
		this.state.user.setPass(this.state.newPass);
		//Save users
		this.state.user.store("UserModel").then(() => {
			this.props.navigation.goBack();
		}).catch((error) => {
			Alert.alert("Error Storage", "Your password changed but there is error saving user to local storage");
		});
	}


	render() {
		return (
				<View style={styles.container}>
				<Appbar  barType={'normal'} title={'Change Password'} navigation={'arrow-back'} color={'#092C73'} onNavigation={()=>this.props.navigation.goBack()}    />
					<LinearGradient colors={['#4A55FF', '#4A55FF', '#8891FF']} style={[styles.mainBgHome, {justifyContent: 'center'}]} >
						<Text style={styles.txtHeading}>Change Password</Text>
						<TextField
							style={{width: 300, backgroundColor: 'white', borderRadius: 12, fontSize: 18}}
				                   type={'outlined'}
				                   containerStyle={{ marginTop: 10, marginBottom: 10}}
				                   label={'Current Password'}
							 value={this.state.currentPass}
				                   trailingIcon={
				                     <Icon name={'lock'} size={24} color={'#6e6e6e'} />
				                   }
				                   onChangeText={(password) => {this.setState({currentPass: password})}}
							 secureTextEntry={true}
				                 />

						     <TextField
	     						style={{width: 300, backgroundColor: 'white', borderRadius: 12, fontSize: 18}}
	     			                   type={'outlined'}
	     			                   containerStyle={{ marginTop: 20, marginBottom: 10}}
	     			                   label={'New Password'}
							 value={this.state.newPass}
	     			                   trailingIcon={
	     			                     <Icon name={'lock'} size={24} color={'#6e6e6e'} />
	     			                   }
	     			                   onChangeText={(password) =>  {this.setState({newPass: password})}}
	     						 secureTextEntry={true}
	     			                 />


						     <TextField
							     style={{width: 300, backgroundColor: 'white', borderRadius: 12, fontSize: 18}}
								type={'outlined'}
								containerStyle={{ marginTop: 5, marginBottom: 10}}
								label={'Confirm New Password'}
								value={this.state.confirmNewPass}
								trailingIcon={
								  <Icon name={'lock'} size={24} color={'#6e6e6e'} />
								}
								onChangeText={(password) =>  {this.setState({confirmNewPass: password})}}
								secureTextEntry={true}
							    />


							<Button
							    style={{width: 300, height: 50}}
						          text={'Change Password'}
						          icon={<Icon name="input" />}
						          color={'#FFA800'}
						          radius={15}
						          type="flat"
							    onPress={this.changePassword}
						        />
						</LinearGradient>

					{ this.state.isLoading && (
						<View style={styles.loader}>
						    <ProgressCircle color={'#E91E63'} />
						</View>
					)}
				</View>
		);
	}
}

const resizeMode = 'center';

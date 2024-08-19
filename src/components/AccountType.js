/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import React from 'react';
import {
      StyleSheet,
      Text,
      View,
      Alert,
      Image,
      TouchableOpacity,

      } from 'react-native';
      import {Ripple, Icon, TextField, Button} from 'material-bread';
      import SplashScreen from 'react-native-splash-screen';
      import LinearGradient from 'react-native-linear-gradient';
      import styles from './../../OProtect.styles.js';



      export class AccountType extends React.Component {


            showSignInScreen(type, typeName) {
                  //Alert.alert('Hi', type);
                  //Alert.alert(this.props.navigation);
                  this.props.navigation.navigate("signup", {type: type, typeName: typeName, mode: 0});
            }

            render() {
                  return(

                        <View style={styles.container}>
                        <LinearGradient colors={['#4A55FF', '#4A55FF', '#8891FF']} style={styles.mainBg} >
                        <Image style={{position: 'absolute', top: -100}} source={require('.././images/bg_top.png')}/>

                        <Ripple rippleCentered onPress={()=>this.props.navigation.goBack()} rippleColor={'#ffffff'} >
                        <View style={{borderRadius: 75, flexDirection: 'row', paddingVertical: 5, paddingRight: 10,}}>
                        <Icon name={"arrow-back"} size={28} color={'#ffffff'}  />
                        <Text style={{color: '#ffffff', fontSize: 18,}}>Back</Text>
                        </View>
                        </Ripple>

                        <Text style={styles.txtHeading}>Account Type</Text>

                        <View style={styles.whiteBg}>

                        <Text style={[styles.txtHeading, {color: '#000000', fontSize: 24}]}>Select Account Type</Text>

                        <TouchableOpacity style={[styles.inputContainer, {marginTop: 40, backgroundColor: '#FFC21A', borderWidth: 0}]} onPress={()=> this.props.navigation.navigate('signup', {type: 3, mode: 0, typeName: 'Donner'})}>
                        <Text style={styles.buttonText}> Donner  </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.inputContainer, {marginTop: 40, backgroundColor: '#4CA5FF', borderWidth: 0}]} onPress={()=> this.props.navigation.navigate('signup', {type: 4, mode: 0, typeName: 'Donee'})}>
                        <Text style={styles.buttonText}> Donee  </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.inputContainer, {marginTop: 40, backgroundColor: '#172169', borderWidth: 0}]} onPress={()=> this.props.navigation.navigate('signup', {type: 5, mode: 0, typeName: 'Volunteer'})}>
                        <Text style={styles.buttonText}> Volunteer  </Text>
                        </TouchableOpacity>

                        </View>
                        </LinearGradient>
                        </View>
                        );

                  }
            };

 import React from 'react';
 import {View, StyleSheet, Text, Image, Alert} from 'react-native';
 import {Button} from 'material-bread';

import styles from './../../OProtect.styles.js';


export class WelcomeScreen extends React.Component {


  render() {
     return(
       <View style={styles.welcome_container}>
            <Image style={styles.welcome_logo} source={require('.././images/logo.png')}/>
            <Text style={styles.welcome_heading}>WELCOME</Text>
            <View style={styles.welcome_slogan}>
                  <Text style={styles.welcome_sloganTxt}>Aim to provide relief in a responsible way to those in need.</Text>
            </View>

            <View style={styles.buttonCont}>
                  <Button style={styles.button} text={'Login'} radius={50} type="outlined" borderSize={3} onPress={()=>this.props.navigation.navigate('login')} />
                  <Button style={styles.button} text={'Signup'} radius={50} type="flat" color={'#2042AD'} textColor={'#ffffff'} onPress={()=>this.props.navigation.navigate('accountType')}  />
            </View>
       </View>
    );
  }
};

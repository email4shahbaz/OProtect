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
import {Ripple, Icon} from 'material-bread';
import LinearGradient from 'react-native-linear-gradient';
import DrawerHeader from './../drawer/DrawerHeader';
import styles from '../../.././OProtect.styles';


export class SearchType extends React.Component {


  showNextScreen(type) {
    //Alert.alert('Hi', type);
    //Alert.alert(this.props.navigation);
    if(type==='area'){
        this.props.navigation.navigate("Areas");
    }
    else if(type==='location'){
       //this.props.navigation.navigate("Users");
    }
  }

  render() {
     return(


           <View style={styles.container}>
                 <LinearGradient colors={['#4A55FF', '#4A55FF', '#8891FF']} style={styles.mainBg} >
                       <Image style={{position: 'absolute', top: -100}} source={require('../.././images/bg_top.png')}/>

                       <Ripple rippleCentered onPress={()=>this.props.navigation.goBack()} rippleColor={'#ffffff'} >
                             <View style={{borderRadius: 75, flexDirection: 'row', paddingVertical: 5, paddingRight: 10,}}>
                                   <Icon name={"arrow-back"} size={28} color={'#ffffff'}  />
                                   <Text style={{color: '#ffffff', fontSize: 18,}}>Back</Text>
                             </View>
                       </Ripple>

                       <Text style={styles.txtHeading}>Search Type</Text>

                       <View style={styles.whiteBg}>

                            <Text style={[styles.txtHeading, {color: '#000000', fontSize: 24}]}>Select Search Type</Text>

                            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Areas")} style={[styles.inputContainer, {marginTop: 40, backgroundColor: '#FFC21A', borderWidth: 0}]} >
                                   <Text style={styles.buttonText}> Search By Area  </Text>
                            </TouchableOpacity>



                             <TouchableOpacity style={[styles.inputContainer, {marginTop: 40, backgroundColor: '#172169', borderWidth: 0}]} >
                                    <Text style={styles.buttonText}>  Current Location  </Text>
                             </TouchableOpacity>

                       </View>
                  </LinearGradient>
           </View>

    );

  }
};

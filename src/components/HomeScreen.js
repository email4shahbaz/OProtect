import React, {useCallback, useEffect} from 'react';
import { StyleSheet, Text, View, Image, Alert, ScrollView, TouchableOpacity, AsyncStorage} from 'react-native';
import {Ripple, Appbar, Icon, Heading, Subtitle, Butto, BottomNavigation, BottomNavigationItem, ProgressCircle} from 'material-bread';

import messaging from '@react-native-firebase/messaging';
import UserModel from '.././models/UserModel';
import styles from './../../OProtect.styles.js';
import {Colors} from '../.././Colors.js';


//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {readUserData} from '.././store/appstate';



const HomeScreen = (props) =>{

      const dispatch = useDispatch();
      const appstate = useSelector(state=>state.appstate);




      requestUserPermission = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            if (enabled) {
                  getFcmToken();
                //console.log('Authorization status:', authStatus);
            }
      }






      const logout = useCallback(
            () =>{
                 // Works on both Android and iOS
                 Alert.alert('Déconnecter', 'Etes-vous sûr de vouloir vous déconnecter?',
                 [
                       {
                             text: 'Non',
                             onPress: () => console.log('Cancel Pressed'),
                             style: 'cancel'
                       },
                       {
                             text: 'Oui',
                             onPress: () =>{
                                   clearUser();
                                   props.navigation.navigate("login");

                             }
                       }
                 ],
                 { cancelable: false } );
           }
     );


      const clearUser = async()=>{
         try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('fcmToken');
        }
        catch (error) {
            Alert.alert(error.toString());
          // Error saving data
        }
      }


      getFcmToken = async () => {
            try {
                 const savedToken = await AsyncStorage.getItem('fcmToken');
                 if (savedToken == null) {
                       const fcmToken = await messaging().getToken();
                       if (fcmToken) {
                             sendTokenToServer(fcmToken);
                       } else {
                             console.log("Failed", "No token received");
                       }
                  }
           }
           catch (error) {
                 Alert.alert(error.toString());
           }
      }



      saveTokenToStorage = async (token) => {
            try {
                await AsyncStorage.setItem('fcmToken', token);
                //Alert.alert("Token Saved to Local Storage");
            }
            catch (error) {
                  Alert.alert("Error", error);
            }
      }

      sendTokenToServer = async (token) => {
            fetch(`https://www.oprotect.com/api/index.php?action=updateDeviceInfo`, {
                  method: 'post',
                  body: JSON.stringify({mem_uid: appstate.user.mem_uid, device_id: token, device_type: Platform.OS == 'android' ? 'AN' : 'IO' }),
            }).then(function(response) {
                  try{
                        let json=response.json();
                        return json;
                  }

                  catch(err){
                        Alert.alert(err.toString());
                  }
            }).then(function(result){
                  console.log(result);
                  if (result.status=== '1'){
                        saveTokenToStorage(token);
                        //Alert.alert("Success", "FCM Token Saved"+token);
                  }
                  else{
                        Alert.alert("Failed", result.message);
                  }
            });
      }






      //Component didMount
      useEffect(() => {
            //MUST UNCOMMENT
            //Alert.alert(props);
            requestUserPermission();
            dispatch(readUserData());
      }, [dispatch])



      return(
            <View style={styles.container}>
                  {appstate.user && (
                        <View style={{flex:5, alignItems: 'center', justifyContent: 'center'}}>
                          {(appstate.user!=null && appstate.user.cmp_logo=='') &&(
                                <Icon name={'location-city'} size={120} color={'#AA1AAAA'} />
                          )}

                          {(appstate.user!=null && appstate.user.cmp_logo!='') &&(
                                <Image source={{ uri: appstate.user.cmp_logo }} style={{width: 140, height: 100, resizeMode: 'contain'}}  />
                          )}

                          {appstate.user.cmp_name!=undefined  &&(
                                <Text style={{fontSize: 24, color: 'grey', marginTop: 10, textAlign: 'center', padding: 20}}>{appstate.user.cmp_name}</Text>
                          )}
                        </View>
                  )}
                  <View style={{flex:1, height: '100%', justifyContent: 'flex-end'}}>
                        <BottomNavigation
                              style={{width: '100%', paddingTop: 10, height: 60,}}
                              backgroundColor={Colors.mainDarkBlue}
                              showLabels

                              actionItems={[
                                    <BottomNavigationItem active={true} icon={'security'} label={'Missions'} onPress={()=>props.navigation.navigate('missions', {user: appstate.user})} />,
                                    <BottomNavigationItem active={true} icon={'account-circle'} label={'Paramètres'} onPress={()=>props.navigation.navigate('profile', {user: appstate.user})} />,
                                    <BottomNavigationItem active={true} icon={'exit-to-app'} label={'Déconnexion'} onPress={()=>logout()} />,
                              ]}
                        />
                  </View>

                  {appstate.loading && (
                      <View style={styles.loader}>
                          <ProgressCircle color={Colors.mainDarkBlue} />
                     </View>
                  )}
            </View>

      );
}

export default HomeScreen;

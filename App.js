/**
* Sample React Native App
* https://github.com/facebook/react-native
*
* @format
* @flow
*/

import 'react-native-gesture-handler';
import React from 'react';
import {View, SafeAreaView, Alert} from 'react-native';

import {Provider} from 'react-redux';
import store from './src/store';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import messaging from '@react-native-firebase/messaging';

//components
import SplashScreen from 'react-native-splash-screen';
import StartScreen from './src/components/StartScreen';
import Signup from './src/components/login/Signup';
import {Login} from './src/components/login/Login';
import HomeScreen from './src/components/HomeScreen';
import {MissionsScreen} from './src/components/missions/MissionsScreen';
import ProfileScreens from './src/components/profile/ProfileScreens';

import { BreadProvider } from "material-bread";
const Stack = createStackNavigator();


export default class App extends React.Component {

      componentDidMount() {
            SplashScreen.hide();

            const unsubscribe = messaging().onMessage(async remoteMessage => {
                  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            });

            return unsubscribe;
      }


      render(){
            return (
                  <Provider store={store}>
                        <BreadProvider>
                              <SafeAreaView style={{flex: 1, backgroundColor: '#002D4C'}}>
                                    <View style={{flex:1}}>
                                          <NavigationContainer>
                                                <Stack.Navigator>
                                                      <Stack.Screen name={"start"} component={StartScreen} options={{headerShown: false}}/>
                                                      <Stack.Screen name={"login"} component={Login} options={{headerShown: false}} />
                                                      <Stack.Screen name={"signup"} component={Signup} options={{headerShown: false}} />
                                                      <Stack.Screen name={"homeScreen"} component={HomeScreen} options={{headerShown: false}}/>
                                                      <Stack.Screen name={"missions"} component={MissionsScreen} options={{headerShown: false}}/>
                                                      <Stack.Screen name={"profile"} component={ProfileScreens} options={{headerShown: false}}/>
                                                </Stack.Navigator>
                                          </NavigationContainer>
                                    </View>
                                </SafeAreaView>
                        </BreadProvider>
                  </Provider>
                  );
            }
      }

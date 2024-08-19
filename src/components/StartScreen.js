import React, {useCallback} from 'react';
import {Text, View, Alert, PermissionsAndroid, Platform, AsyncStorage} from 'react-native';
//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from '.././store/appstate';

import UserModel from './../models/UserModel';



const StartScreen = (props) =>{
      const dispatch = useDispatch();

      const checkPermission = useCallback(
            async () => {
                  try {
                        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                              checkUserLogin();
                        } else {
                              Alert.alert("Permission Denied", "You would't be able to use this app smoothly");
                              checkUserLogin();
                        }
                  } catch (err) {
                        Alert.alert("Permission Error",err);
                        console.log("Error: "+err);
                  }
            },
      );

      const checkUserLogin = useCallback(
            async () => {
                   try {
                        const userStr = await AsyncStorage.getItem('user');
                        if (userStr !== null) {
                              // We have data!!
                              props.navigation.navigate("homeScreen");

                        }
                        else{
                              props.navigation.navigate("login");
                        }
                  }
                  catch (error) {
                        // Error retrieving data
                        Alert.alert(error.toString());
                  }
            }

      )





      if(Platform.OS == 'android'){
            checkPermission();
      }
      else{
            checkUserLogin();
      }

      return(
            <View />
      )
}

export default StartScreen;

/*

export class StartScreen extends React.Component {
async componentDidMount() {
this._unsubscribe = this.props.navigation.addListener('focus', () => {
if(Platform.OS == 'android'){
this.checkPermission();
}
else{
this.checkUserLogin();
}
});
}


checkPermission = () =>{
var that = this;
//console.log(that);
async function requestWritePermission() {
try {
const granted = await PermissionsAndroid.request(
PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
)
if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//To Check, If Permission is granted
//  console.log("Hello");
that.checkUserLogin();

} else {
alert("Permission Denied now");
that.checkUserLogin();

}
} catch (err) {
alert("err",err);
// that.callLocation();
console.log("Error: "+err);
}
}
requestWritePermission();
}


checkUserLogin(){
UserModel.require(UserModel);
UserModel.restore().then((userModel) => {
//User already exists in local storage
if (userModel!== null && userModel.getLogged_in()==true) {
this.props.navigation.navigate("homeScreen", {user: userModel});
}
else{
this.props.navigation.navigate("login");
}
}).catch((error) => {
this.props.navigation.navigate("login");
});
}


componentWillUnmount() {
this._unsubscribe();
}


render() {
return(
<View />
);
}
};*/

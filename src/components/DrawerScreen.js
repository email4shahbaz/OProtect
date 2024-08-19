 import React from 'react';
 import {StyleSheet, View, Image, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator,  DrawerContentScrollView,  DrawerItemList, DrawerItem} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

import {HomeScreen} from './HomeScreen';
import {ProfileScreen} from './ProfileScreen';
import {UsersList} from './UsersList';
import {NearbyAreas} from './search/NearbyAreas';
import {ChangePassword} from './login/ChangePassword';

import UserModel from '.././models/UserModel';

export class DrawerScreen extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
               isLoading: false,
               user: null,
        };
      }

      componentDidMount() {
        UserModel.require(UserModel);
        UserModel.restore().then((userModel) => {
             //User already exists in local storage
             if (userModel!==null) {
                   this.setState({user: userModel});
             }
          }).catch((error) => {
          });
      };




    logOut = () =>{
      UserModel.require(UserModel);
      UserModel.remove("UserModel").then(() => {
           this.props.navigation.navigate("start");

       }).catch((error) => {
       });
    }

    changePassword = () => {
          this.props.navigation.navigate("changePassword", {user: this.state.user});
     }



  CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Change Password"
          icon={({ focused, color, size }) => {<Image source={require('.././images/icon_password.png')} style={{width: 24, height:24}}/>}}
          onPress={()=>{props.navigation.closeDrawer(); this.changePassword()}}
        />

        <DrawerItem
          label="Logout"
          icon={({ focused, color, size }) => {<Image source={require('.././images/icon_password.png')} style={{width: 24, height:24}}/>}}
          onPress={()=>{props.navigation.closeDrawer(); this.logOut()}}
        />
      </DrawerContentScrollView>
      );
    }


    render() {
     return(
         <Drawer.Navigator drawerStyle={{marginTop: 40, backgroundColor: '#DDDDDD'}} drawerContentOptions={{activeTintColor: '#006DD9',}} drawerContent={this.CustomDrawerContent}  >
            <Drawer.Screen name={"Home"} component={HomeScreen} />
         </Drawer.Navigator>
    );
  }
};


<Drawer.Navigator >
  {/* screens */}
</Drawer.Navigator>

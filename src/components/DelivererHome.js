import React, { Component, Text } from 'react';
import { View, Alert } from 'react-native';
import { Drawer, DrawerItem, DrawerHeader, DrawerSection, Appbar, Heading, BodyText } from 'material-bread';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import UserModel from './../models/UserModel';


import {DeliveryLists} from './delivery/DeliveryLists';
import {DeliveryList} from './delivery/DeliveryList';
import {ChangePassword} from './login/ChangePassword';

const Stack = createStackNavigator();

export class DelivererHome extends React.Component {

      loggedUser=null;

        constructor(props) {
                super(props)
                this.state = {
                  isOpen: false,
                  user: props.route.params.user,
                  pageTitle: "My Delivery Lists",
                }
        }

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



  render() {
    return (

            <View style={styles.container}>
              <Drawer
                open={this.state.isOpen}
                appbar={
                      <Appbar
                      barType={'normal'}
                      title={this.state.pageTitle}
                      navigation={'menu'}
                      onNavigation={() => {this.setState({isOpen: !this.state.isOpen});}}
                      actionItems={[{ name: 'settings' }]}
                     />
                }
                drawerContent={
                      <View>
                        <DrawerHeader title={this.props.route.params.user.getUser_full_name()} subtitle={'Deliverer'} />
                        <DrawerSection bottomDivider>
                          <DrawerItem text={'My Delivery Lists'} icon={'assignment'} active />
                          <DrawerItem text={'Change Password'} icon={'vpn-key'} onPress={()=> this.changePassword()} />
                          <DrawerItem text={'Logout'} icon={'exit-to-app'} onPress={()=> this.logOut()} />

                        </DrawerSection>
                     </View>
                }
                onClose={() => this.setState({ isOpen: false })}
                animationTime={250}
                >
                    <View style={styles.body}>

                          <NavigationContainer independent={true}>
                               <Stack.Navigator headerMode='none' >
                                     <Stack.Screen name={"deliveryLists"} component={DeliveryLists} options={{title: "My Delivery Lists"}}  />
                                     <Stack.Screen name={"deliveryList"} component={DeliveryList} options={{title: "My Delivery List"}} listeners={{focus : () => {this.setState({mode:'list'})},}}/>
                               </Stack.Navigator>
                         </NavigationContainer>

                    </View>
              </Drawer>
            </View>

    );
  }
}



const styles = {
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: 'red',
  },
  body: {
        flex:1,
    backgroundColor: '#eee',
  },
};

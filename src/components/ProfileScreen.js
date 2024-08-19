 import React from 'react';
 import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';

import {Ripple, Icon, Appbar, Heading, Subtitle} from 'material-bread';

import LinearGradient from 'react-native-linear-gradient';
import DrawerHeader from './drawer/DrawerHeader';


//import {UsersList} from 'UsersList';
import UserModel from '.././models/UserModel';

import styles from './../../OProtect.styles.js';

export class ProfileScreen extends React.Component {

      loggedInUser=null;

      constructor(props) {
        super(props);

              this.state = {
                     isLoading: false,
                     user: props.route.params.user,
               };

      }

     componentDidMount() {
           UserModel.require(UserModel);
           UserModel.restore().then((userModel) => {
                 //User already exists in local storage
                 if (userModel!== null) {
                      this.loggedInUser = userModel;
                 }
             }).catch((error) => {
                   Alert.alert("Error", error.toString());
             });
     };



    render() {
     return(
           <View style={styles.container}>

                  {this.state.user && (
                       <LinearGradient colors={['#172169', '#172169', '#2693FF']} style={styles.mainBgHome} >
                             <Image style={{position: 'absolute', top: -100}} source={require('.././images/bg_top.png')}/>

                             <Appbar  barType={'normal'} title={this.props.route.name} navigation={'arrow-back'} color={'#092C73'} onNavigation={()=>this.props.navigation.goBack()}  />

                             <Heading type={5} text={this.state.user.user_full_name} style={{marginTop: 10, color: '#ffffff'}}/>
                             <Subtitle type={2}  text={this.state.user.utype_id==3 && 'Donner' || this.state.user.utype_id==4 && 'Donee' || this.state.user.utype_id==5 && 'Volunteer' || this.state.user.utype_id==6 && 'Deliverer' } style={{marginTop: 10, color: '#ffffff'}}/>

                             <Image source={require('.././images/avatar.png')} style={{marginTop: 20, width: 150, height: 150}}/>



                             {this.state.user.utype_id==3 &&(
                                   <Image source={require('.././images/donation_img.png')} />
                              )}



                              {this.state.user.utype_id==4 &&(
                                    <Image source={require('.././images/donee_img.png')} />
                              )}


                             {this.state.user.utype_id==5 &&(
                                   <Image source={require('.././images/volunteer_img.png')} />
                              )}

                             {this.state.user.utype_id==6 &&(
                                   <Image source={require('.././images/delivery_img.png')} />
                              )}


                        </LinearGradient>
                  )}
          </View>
    );
  }
};

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View, Alert, Image, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Button, FlatList, Modal, PermissionsAndroid,Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import {ProgressCircle, Appbar, Paper, Ripple} from 'material-bread';
import UserModel from '.././models/UserModel';
import DrawerHeader from './drawer/DrawerHeader';
import LinearGradient from 'react-native-linear-gradient';
import styles from './../../OProtect.styles.js';



export class UsersList extends React.Component {
    loggedInUser=null;
     constructor(props) {
       super(props);
      //Alert.alert("Hello", this.props.route.params.type);
       this.state = {
              areas: [],
              users: [],
              isLoading: false,
              modalVisible: false,
              phoneNumber: "",
              currentLatitude: "",
              currentLongitude: "",
              area: "",
              utype_id: 4,
        };
     }

     setModalVisible = (visible) => {
        this.setState({ modalVisible: visible});
      }


      async componentDidMount() {
          this._unsubscribe = this.props.navigation.addListener('focus', () => {
             this.checkUserLogin();
          });
      }

      componentWillUnmount() {
        this._unsubscribe();
      }


     checkUserLogin() {
         if(this.loggedInUser==null){
           UserModel.require(UserModel);
           UserModel.restore().then((userModel) => {
                 //User already exists in local storage
                 if (userModel!== null) {
                      this.loggedInUser = userModel;
                      this.setState({utype_id:userModel.getUtype_id()})
                      this.setState({mem_uid: userModel.getMem_uid()});
                      this.startup();
                 }
             }).catch((error) => {
             });
         }
         else{
           this.startup();
         }
     };

     startup(){
         if(this.props.route.params.area!=null){
           this.setState({area: this.props.route.params.area});
           this.loadNearbyUsers("area");
         }
         else{
           this.checkPermission();
         }
     }


     checkPermission = () =>{
       var that = this;
       console.log(that);
          async function requestLocationPermission() {
            try {
                  const granted = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                          'title': 'Location Access Required',
                          'message': 'This App needs to Access your location'
                      }
                  )
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                      //To Check, If Permission is granted
                   //  console.log("Hello");
                    that.callLocation();

                  } else {
                      alert("Permission Denied");
                  }
              } catch (err) {
                  alert("err",err);
                 // that.callLocation();
                  console.log("Error: "+err);
              }
          }
          requestLocationPermission();
     }



    callLocation() {
      Geolocation.getCurrentPosition(
         //Will give you the current location
          (position) => {
             const currentLongitude = JSON.stringify(position.coords.longitude);
             const currentLatitude = JSON.stringify(position.coords.latitude);

             //getting the Latitude from the location json
             this.setState({ currentLongitude:currentLongitude });
             this.setState({ currentLatitude:currentLatitude });
             this.loadNearbyUsers();
             //Setting state Latitude to re re-render the Longitude Text
          },
          (error) => alert(error.message),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
       );
    }


     loadNearbyUsers=(type)=>{
            // console.log("Data", {mem_uid: this.loggedInUser.getMem_uid(), utype_id: this.loggedInUser.getUtype_id(), user_lat: this.state.currentLatitude, user_lng: this.state.currentLongitude});

             this.setState({isLoading: true});
             try{
                   fetch('http://www.helpline-app.com/api/index.php?action=get_users&user_area='+this.state.area+'&utype_id='+this.state.utype_id+'&mem_uid='+this.state.mem_uid)
                   .then(function(response) {
                       return response.json();
                   }).then(this.allUsersLoaded)
                   .finally(() => {
                       
                         this.setState({ isLoading: false });
                   });
             }
             catch (error) {
                   Alert.alert("Error", "Error loading areas");
                   console.error(error);
             }
     }

     allUsersLoaded = (result) =>{
           if(result.status==1){
                 if(result.data!=null){
                       this.setState({users: result.data});
                 }
           }
           else{
                 Alert.alert("No Record", result.message);
          }

     }



     iconClicked = (what, user) => {

       if(what=='profile'){
          this.props.navigation.navigate("Profile", {user: user});
       }
       else if(what=="phone"){
         //this.setState({phoneNumber: user.login});
         //this.setModalVisible(true);
         RNImmediatePhoneCall.immediatePhoneCall(user.login);
       }
     }




  renderItem = ({item}) => {
    var callIcon = "https://img.icons8.com/color/48/000000/phone.png";

    return (
    /*  <TouchableOpacity>
        <View style={styles.row}>
        <Image source={require(".././images/icon_person.png")} style={styles.pic} />
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt}>{item.user_full_name}</Text>
          </View>
          <View style={styles.end}>
            <Text style={styles.time, {marginLeft: 15}}>{item.user_address} ({item.user_city})</Text>
          </View>
        </View>
        <Image style={[styles.icon, { marginRight: 50 }]} source={{uri: callIcon}}/>
        </View>
      </TouchableOpacity>*/

      <View style={styles.box}>
          <View><Image style={{width: 75, height: 75, marginRight: 20, }} source={require(".././images/avatar.png")} /></View>

          <View style={styles.boxContent}>
            <Text style={styles.title}>{item.user_full_name}</Text>
            <Text style={styles.description}>{item.user_address}</Text>
            <View style={styles.buttons}>


              <TouchableOpacity style={[styles.userlist_icon, styles.profile]} onPress={() => this.iconClicked('profile', item)}>
                <Image style={styles.icon} source={require('.././images/icon_profile.png')}/>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.userlist_icon, styles.message]} onPress={() => this.iconClicked('phone', item)}>
                <Image style={styles.icon} source={require('.././images/icon_phone.png')}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>

    );
  }

    render() {
      const { modalVisible, phoneNumber} = this.state;

        return(

             <View style={styles.container}>
                   <LinearGradient colors={['#172169', '#2693FF', '#2693FF']} style={styles.container}>

                         <Appbar  barType={'normal'} title={this.props.route.params.area} navigation={'arrow-back'} color={'#092C73'} onNavigation={()=>this.props.navigation.goBack()}    />


                         <View style={{ flex: 1, padding: 10 }} >
                             <FlatList
                               extraData={this.state}
                               data={this.state.users}
                               keyExtractor = {(user) => {
                                return user.mem_uid;
                               }}
                               renderItem={this.renderItem}/>
                          </View>


                                {this.state.showProfileInfo && (
                                   <Modal
                                      style={{padding:50}}
                                        animationType="slide"
                                        visible={true}
                                        transparent={true}
                                        onRequestClose={() => {
                                          Alert.alert("Modal has been closed.");
                                        }}
                                        >

                                        <View style={{ flex: 1, justifyContent:'center'}}>
                                              <View style={[styles.modalView, styles.modalProfile]}>

                                                 <View style={{flexDirection: 'row', marginRight: 5, justifyContent:'flex-end',  width: '100%'}}>
                                                       <TouchableOpacity style={{marginRight: 5}}  onPress={() => {this.setState({showProfileInfo: false}) }}>
                                                             <Image style={{width: 24, height: 24}} source={require('.././images/icon_close.png')} />
                                                       </TouchableOpacity>
                                                 </View>

                                                 <Image source={require('.././images/icon_profile.png')} />
                                                 <Text style={styles.modalText}>{this.state.donee.donee_name}</Text>

                                                 <View style={{flexDirection: 'row', alignItems: 'flex-start', width: '100%'}}>
                                                       <Text style={[styles.modalText, {fontSize: 16, flex: 2, textAlign: 'left' }]}>CNIC: </Text>
                                                       <Text style={[styles.modalText, {fontSize: 18, flex: 4, textAlign: 'left' }]}>{this.state.donee.donee_cnic}</Text>
                                                 </View>

                                                 <View style={{flexDirection: 'row', alignItems: 'flex-start', width: '100%'}}>
                                                       <Text style={[styles.modalText, {fontSize: 16, flex: 2, textAlign: 'left' }]}>Phone: </Text>
                                                       <Text style={[styles.modalText, {fontSize: 18, flex: 4, textAlign: 'left' }]}>{this.state.donee.donee_phone}</Text>
                                                 </View>

                                                 <View style={{flexDirection: 'row', alignItems: 'flex-start', width: '100%'}}>
                                                       <Text style={[styles.modalText, {fontSize: 16, flex: 2, textAlign: 'left' }]}>Address: </Text>
                                                       <Text style={[styles.modalText, {fontSize: 18, flex: 4, textAlign: 'left' }]}>{this.state.donee.donee_address}</Text>
                                                 </View>

                                                 <View style={{flexDirection: 'row', alignItems: 'flex-start', width: '100%'}}>
                                                       <Text style={[styles.modalText, {fontSize: 16, flex: 2, textAlign: 'left' }]}>Status: </Text>
                                                       <Text style={[styles.modalText, {fontSize: 18, flex: 4, textAlign: 'left' }]}>{this.state.donee.dstatus_name}</Text>
                                                 </View>



                                        </View>
                                        </View>
                                </Modal>
                                   )}

                   </LinearGradient>


                   { this.state.isLoading && (
                      <View style={styles.loader}>
                          <ProgressCircle color={'red'} />
                      </View>
                   )}


            </View>

    );
  }
};

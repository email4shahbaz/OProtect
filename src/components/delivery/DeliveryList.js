/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View, Alert, Image, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Button, FlatList, Modal, Platform, Linking} from 'react-native';
import { Paper, IconButton, Appbar } from "material-bread";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import UserModel from '../.././models/UserModel';

import LinearGradient from 'react-native-linear-gradient';
import sms from 'react-native-sms-linking';

import styles from './../../../OProtect.styles.js';

export class DeliveryList extends React.Component {
    loggedInUser = null;
    delivery = null;

     constructor(props) {
       super(props);

      //Alert.alert("Hello", this.props.route.params.type);
       this.state = {
              delivery: props.route.params.delivery,
              isLoading: false,
              showPhoneInfo: false,
              showProfileInfo: false,
              showStatus: false,
              showDeliveryFailure: false,
              deliverFailureComments: "",
              selecetedDelivery: null,
              donee: null,
        };
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
                      this.setState({delivery: this.props.route.params.delivery});
                 }
             }).catch((error) => {
             });
         }
         else{
               this.loadDeliveryLists();
         }
     };

     iconClicked = (what, item) => {
           this.setState({donee: item});

       if(what=='profile'){
             this.setState({showProfileInfo: true});
       }
       else if(what=="phone"){
             this.setState({showPhoneInfo: true});
       }

       else if(what=="status"){
             if(item.dstatus_id=='3'){
                  this.setState({showStatus: true});
             }
       }
     }

     makePhoneCall = (phone) => {
           RNImmediatePhoneCall.immediatePhoneCall(phone);
      };

      sendSMS = (phone) => {
            sms(phone, 'چغتائی فاؤنڈیشن کی جانب سے راشن کی فراہمی صرف رجسٹرڈ افراد کے لیے ہے - قومی شناختی کارڈ کی کاپی لازمی ہمراہ لائیں\n\nMessage delivery of Rashan from Chughtai Foundation (only for registered persons).').catch(console.error);
      };



     changeDeliveryStatus = (id) => {



           this.setState({isLoading: true, showStatus: false, showDeliveryFailure: false})

           try{
                 fetch('http://www.helpline-app.com/api/index.php?action=set_delivery_status&mem_uid='+this.loggedInUser.getMem_uid()+'&dld_id='+this.state.donee.dld_id+'&donee_id='+this.state.donee.donee_id+'&dstatus_id='+id+"&dld_comment="+this.state.deliverFailureComments)
                 .then(function(response) {
                     return response.json();
                 }).then((result) => {this.onDeliveryStatusResponse(result, id)})
                 .finally(() => {
                       this.setState({ isLoading: false });
                 });
           }
           catch (error) {
                 Alert.alert("Error", "Error");
                 console.error(error);
           }
     }

     onDeliveryStatusResponse = (result, id) => {
           if(result.status==1){
                var donee=this.state.donee;
                donee.dstatus_id=id;
                this.setState({showStatus: false, showDeliveryFailure: false, donee: donee});

           }
           else{
                 Alert.alert("Server Response", response.data.message);
           }
     }


     renderItem = ({item, index}) => {
          return (

                      <View style={styles.dlists_box}>
                          <View style={{flexDirection: 'column', width: 100, height: '100%', marginRight: 10, alignItems: 'center', backgroundColor: '#FFA500', borderRadius: 8,}}>

                              <Text style={{backgroundColor: '#FFBD42', padding: 5, width: '100%', borderRadius: 5, fontSize: 16, fontWeight: 'bold', color: 'blue', borderRadius: 2,  margin: 10, textAlign: 'center'}}>{index+1}</Text>
                              <Text style={{fontSize: 12, width: '100%', fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 10}}>{item.donee_area}</Text>
                          </View>


                          <View style={styles.boxContent}>
                            <Text style={styles.dlists_title}>{item.donee_name}</Text>
                            <Text style={styles.dlists_phone}>{item.donee_phone}</Text>
                            <Text style={styles.dlists_description}>{item.donee_address}</Text>
                            <View style={styles.dlist_buttons}>
                             <TouchableOpacity style={[styles.dlist_button, styles.profile]} onPress={() => this.iconClicked('profile', item)}>
                                <Image style={styles.dlist_icon} source={require('../.././images/icon_profile.png')}/>
                             </TouchableOpacity>

                             <TouchableOpacity style={[styles.dlist_button, styles.message]}  onPress={() => {this.makePhoneCall(item.donee_phone)}}>
                                <Image style={styles.dlist_icon} source={require('../.././images/icon_phone.png')}/>
                             </TouchableOpacity>

                             <TouchableOpacity style={[styles.dlist_button, styles.sms]}  onPress={() => {this.sendSMS(item.donee_phone)}}>
                                <Image style={[styles.dlist_icon,{width: 24, height: 18}]} source={require('../.././images/icon_sms.png')}/>
                             </TouchableOpacity>
                            </View>
                          </View>


                        <TouchableOpacity style={item.dstatus_id=='3' &&(styles.buttonReadyToDeliver) || item.dstatus_id=='4' && (styles.buttonDelivered) || item.dstatus_id=='5' && (styles.buttonDeliveryRejected)} onPress={() => this.iconClicked('status', item)} disabled={item.dstatus_id=='4' || item.dstatus_id=='5'} >
                           <Image style={styles.iconDelivery} source={require('../.././images/icon_donate.png')}/>
                        </TouchableOpacity>

                       </View>

          );
    }

    render() {
      const { showPhoneInfo, phoneNumber} = this.state;
        return(

            <LinearGradient colors={['#172169', '#2693FF', '#2693FF']} style={styles.container}>

                  <Appbar  barType={'normal'} title={'My Deliver Lists'} navigation={'arrow-back'} color={'#092C73'} onNavigation={()=>this.props.navigation.goBack()}    />

                  <Paper style={{padding: 15,  marginLeft: 10, marginRight: 10, marginTop: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: 'orange' }}  elevation={4}  radius={15}                   >
                        <Text style={{fontSize: 14, flex: 4, marginLeft: 10, color: 'white'}}>{this.props.route.params.delivery.dl_title}</Text>
                  </Paper>

                  {this.state.delivery && (
                      <View style={{ flex: 1, padding: 10 }} >
                        <FlatList
                          extraData={this.state}
                          data={this.state.delivery.list.data}
                          keyExtractor = {(listItem) => {
                             return listItem.dld_id;
                          }}
                          renderItem={this.renderItem}/>
                      </View>
                      )}


                      { this.state.isLoading && (
                          <View style={styles.loader}>
                              <ActivityIndicator  />
                          </View>
                      )}


                      {this.state.showPhoneInfo && (
                         <Modal
                            style={{padding:100}}
                              animationType="slide"
                              visible={true}
                              transparent={true}
                              onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                              }}
                              >

                              <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
                                    <View style={styles.modalView}>
                                      <Image source={require('../.././images/icon_phone.png')} />
                                      <Text style={styles.modalText}>{this.state.donee.donee_phone}</Text>

                                      <View style={{flexDirection: 'row', padding:10, }}>
                                            <TouchableOpacity
                                              style={{ ...styles.openButton, backgroundColor: "#2196F3", flex:1, marginRight:5,}}
                                              onPress={() => {
                                                    this.setState({showPhoneInfo: false})
                                              }}
                                              >
                                              <Text style={styles.textStyle}>Cancel</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                              style={{ ...styles.openButton, backgroundColor: "#2196F3", flex:1, marginLeft:5,  }}
                                              >
                                              <Text style={styles.textStyle}>Call</Text>
                                            </TouchableOpacity>
                                    </View>
                              </View>
                              </View>
                       </Modal>
                         )}








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
                                                      <Image style={{width: 24, height: 24}} source={require('../.././images/icon_close.png')} />
                                                </TouchableOpacity>
                                          </View>

                                          <Image source={require('../.././images/icon_profile.png')} />
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



                            {this.state.showStatus && (
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
                                         <View style={[styles.modalView, styles.modalProfile , {backgroundColor: '#4D7AFF'}]}>

                                                   <View style={{flexDirection: 'row', marginRight: 5, justifyContent:'flex-end',  width: '100%'}}>
                                                         <TouchableOpacity style={{marginRight: 5}}  onPress={() => {this.setState({showStatus: false}) }}>
                                                               <Image style={{width: 24, height: 24}} source={require('../.././images/icon_close.png')} />
                                                         </TouchableOpacity>
                                                   </View>

                                                   <Text style={styles.modalText}>Change Delivery Status</Text>

                                                   <TouchableOpacity onPress={() => this.setState({showStatus: false, showDeliveryFailure: true,})}>
                                                      <Text style={[styles.btnDelivered, styles.btnRejected]}>Not Delivered</Text>
                                                   </TouchableOpacity>


                                                   <TouchableOpacity onPress={() => this.changeDeliveryStatus(4)}>
                                                      <Text style={styles.btnDelivered}>Delivered</Text>
                                                 </TouchableOpacity>
                                         </View>
                                    </View>
                                  </Modal>
                               )}




                               {this.state.showDeliveryFailure && (
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
                                                      <TouchableOpacity style={{marginRight: 5}}  onPress={() => {this.setState({showDeliveryFailure: false}) }}>
                                                            <Image style={{width: 24, height: 24}} source={require('../.././images/icon_close.png')} />
                                                      </TouchableOpacity>
                                                </View>

                                                <Text style={styles.modalText}>Delivery Failure Reason</Text>

                                                <View style={{backgroundColor: 'white', margin: 20, width:'100%', padding: 10}}>
                                                   <TextInput
                                                   onChangeText={deliverFailureComments => this.setState({ deliverFailureComments})}
                                                    placeholder='Enter your comments'>{this.state.deliverFailureComments}</TextInput>
                                                </View>
                                                <TouchableOpacity  onPress={() => this.changeDeliveryStatus(5)}>
                                                   <Text style={[styles.btnDelivered]}>Submit</Text>
                                                </TouchableOpacity>


                                              </View>
                                      </View>
                                     </Modal>
                                  )}
            </LinearGradient>
    );
  }
};

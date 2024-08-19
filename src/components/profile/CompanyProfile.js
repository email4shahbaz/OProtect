import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, TextField, View, Image, Alert, ScrollView, TouchableOpacity,} from 'react-native';
import {Avatar, IconButton, Ripple, Dialog, BodyText, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';



import UserModel from '../.././models/UserModel';
import {IconText} from '../reuseable/IconText';
import {EditableTextInput} from '../reuseable/EditableTextInput';
import {EditableGoogleAddressInput} from '../reuseable/EditableGoogleAddressInput';

import styles from '../../.././OProtect.styles.js';

//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {login, saveUserDetails, changeUserDetails, requestImagePicker, requestAddressPicker} from '../../../src/store/appstate';




const CompanyProfile = (props) =>{

      const dispatch = useDispatch();
      const appstate = useSelector(state=>state.appstate);


      const fieldChanged = useCallback(
            (field, value, save) => {
                  dispatch(changeUserDetails({field: field, value: value}));
                  if(save){dispatch(saveUserDetails({field: field, value: value}));}
            }
      );





      const handleOnPlaceSelect = useCallback(
            (place) => {
                  dispatch(changeUserDetails({field: "cmp_address", value: place.address}));
                  dispatch(saveUserDetails({field: "cmp_address", value:  place.address}));
            }
      );



      if(appstate.user){
            return(
                  <View style={{flex:1, backgroundColor: '#ffffff', borderRadius: 12, margin: 12, padding: 10}}>
                        <View style={{ width: '100%', alignItems: 'center'}}>
                              <View style={{alignItems: 'flex-end'}}>
                                    <Image source={{ uri: appstate.user.cmp_logo!='' ? appstate.user.cmp_logo : 'https://avatars1.githubusercontent.com/u/12564956?s=460&v=4', }} style={{width: 160, height: 80, resizeMode: 'contain'}}  />
                                    <IconButton name="camera-alt" size={32} color={'#00AED8'} style={{marginTop: -15}} onPress={()=> {dispatch(requestImagePicker({value: true, type: 'cmp_logo'}))}}/>
                              </View>
                        </View>

                        <ScrollView>
                              <View style={{ width: '100%', marginTop: 20, }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>Nom de la société</Text>
                                          <EditableTextInput style={{width: '65%'}}
                                                text={appstate.user.cmp_name}
                                                onEditFinish = {(txt)=>{fieldChanged("cmp_name", txt, true)}}
                                                onEditCancel = {(txt)=>{fieldChanged("cmp_name", txt, false)}}
                                          />

                                    </View>
                                    <View style={styles.bookingDivider}/>


                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                         <Text style={{width: '35%', fontWeight: 'bold'}}>Adresse</Text>
                                         <EditableTextInput style={{width: '65%'}}
                                         text={appstate.user.cmp_address}
                                         inlineEdit={false}
                                         onEditClicked = {()=> dispatch(requestAddressPicker({type: 'company', value: true}))}
                                         />

                                    </View>



                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                         <Text style={{width: '35%', fontWeight: 'bold'}}>Numéro de siret</Text>
                                         <EditableTextInput style={{width: '65%'}}
                                                text={appstate.user.cmp_tva_number}
                                                onEditFinish = {(txt)=>{fieldChanged("cmp_tva_number", txt, true)}}
                                                onEditCancel = {(txt)=>{fieldChanged("cmp_tva_number", txt, false)}}
                                         />

                                    </View>
                              </View>
                        </ScrollView>
                  </View>
            );
      }






}

export default CompanyProfile;

/*
export class CompanyProfile extends React.Component {
      loggedInUser=null;
      companyLogoObj = require("../.././images/cmp_logo.jpg");


      constructor(props) {
            super(props);
            this.state = {
                  isLoading: false,
                  user: props.user,
                  companyLogo: this.companyLogoObj,
            };
      }


      updateValue = (val, type) => {
            Alert.alert(type, val);
      }


      requestLogoImage = () => {
            if(this.props.onFilePickerRequest!=null){
                  this.props.onFilePickerRequest('logo');
            }
      }

      setCompanyLogo = (url) => {
            //this.companyLogoObj=require({url});
            this.setState({companyLogo: {uri: url}});

      }


      render() {
            const {user, companyLogo} = this.state;
            return(
                  <View style={{flex:1, backgroundColor: '#ffffff', borderRadius: 12, margin: 12, paddingTop: 30, paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                        <View style={{ width: '100%', alignItems: 'center'}}>
                              <View style={{alignItems: 'flex-end'}}>

                                    <Image source={companyLogo} style={{width: 100, height: undefined, aspectRatio: 135 / 76,}} />
                                    <IconButton name="camera-alt" size={32} color={'blue'} style={{marginTop: 0}} onPress={this.requestLogoImage}/>
                              </View>
                        </View>

                        <ScrollView>
                              <View style={{ width: '100%', marginTop: 20}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>Nom de la société</Text>
                                          <EditableTextInput style={{width: '65%'}} text={user.getCmp_name()} onEditFinish = {(txt)=>{this.updateValue(txt, 'firstName')}}/>
                                    </View>
                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>Adresse</Text>
                                          <EditableTextInput style={{width: '65%'}} text={user.getCmp_address()} onEditFinish = {(txt)=>{this.updateValue(txt, 'lastName')}}/>
                                    </View>

                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>Numéro de siret</Text>
                                          <EditableTextInput style={{width: '65%'}} text={user.getCmp_tva_number}/>
                                    </View>

                              </View>
                        </ScrollView>

                        { this.state.isLoading && (
					<View style={styles.loader}>
					    <ProgressCircle color={'#E91E63'} />
					</View>
				)}
                  </View>
            );
      }
};*/

/*                                          <EditableTextInput style={{width: '65%'}}
                                                text={appstate.user.getCmp_address()}
                                                onEditFinish = {(txt)=>{fieldChanged("cmp_address", txt, false)}}
                                                onEditFinish = {(txt)=>{fieldChanged("cmp_address", txt, true)}}
                                          />*/

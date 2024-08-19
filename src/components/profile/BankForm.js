import React, {useEffect, useCallback, useState} from 'react';
import {StyleSheet, Text, View, Image, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import {IconButton, TextField, BodyText, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';

import UserModel from '../.././models/UserModel';
import {EditableTextInput} from '../reuseable/EditableTextInput';


import styles from '../../.././OProtect.styles.js';
import {GooglePlacesInput} from '../.././components/reuseable/GooglePlacesInput';
//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {requestAddressPicker, saveBankDetails} from '../../../src/store/appstate';



const BankForm = (props) =>{

      const dispatch = useDispatch();
      const appstate = useSelector(state=>state.appstate);

      const [BankAccountOwnerName, setBankAccountOwnerName] = useState("");
      const [BankAccountPostalcode, setBankAccountPostalcode] = useState("");
      const [BankAccountIBAN, setBankAccountIBAN] = useState("");
      const [BankAccountBIC, setBankAccountBIC] = useState("");
      const [BankAccountOwnerAddress, setBankAccountOwnerAddress] = useState("");


      const updateBankDetails = useCallback(
            ()=> {
                  if(BankAccountOwnerName=='' || BankAccountPostalcode=='' || BankAccountIBAN=='' || BankAccountBIC=='' || BankAccountOwnerAddress==''){
                        Alert.alert("Please fill all fields");
                  }
                  else{
                        const data={
                              mem_uid: appstate.user.mem_uid,
                              leetchi_user_id: appstate.user.leetchi_user_id,
                              leetchi_wallet_id: appstate.user.leetchi_wallet_id,
                              BankAccountOwnerCity: appstate.user.BankAccountOwnerCity,
                              BankAccountOwnerCountry: appstate.user.BankAccountOwnerCountry,
                              CompanyNumber: appstate.user.CompanyNumber,
                              CompanyName: appstate.user.CompanyName,

                              BankAccountOwnerAddress: BankAccountOwnerAddress,
                              BankAccountOwnerName: BankAccountOwnerName,
                              BankAccountPostalcode: BankAccountPostalcode,
                              BankAccountIBAN:  BankAccountIBAN,
                              BankAccountBIC:  BankAccountBIC,
                              beneficiary_id: 0,
                        }

                        dispatch(saveBankDetails(data));

                  }
            }
      );


      const handleOnPlaceSelect = useCallback(
        (place) =>{
           // this.auth.lat=place.lat;
            //this.auth.lng=place.lng;
            //this.auth.place_id=place.place_id;
            //this.auth.mem_address=place.address;
            setBankAccountOwnerAddress(place.address);
        }
      );





      return(
            <View style={{position: 'absolute', flex:1,  backgroundColor: '#002D4C', width: '100%', height: '100%', zIndex: 100, padding: 15}}>
                  <View style={{  height: '100%', justifyContent: 'flex-start', padding: 10, backgroundColor: '#FFFFFF', borderRadius: 10}}>
                        <View style={{ alignItems: 'flex-end'}}>
                              <IconButton  name={'close'} color={'#00AED8'} size={24} onPress={()=>{if(props.onClose!=undefined) props.onClose()}}/>
                        </View>

                        <ScrollView style={{marginTop: 10}}>

                                <View style={{ width: '100%'}}>
                                      <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 18}}
                                             type={'outlined'}
                                             containerStyle={{ marginTop: 10, marginBottom: 10,}}
                                             borderWidth={2}
                                             label={'Nom'}
                                             value={BankAccountOwnerName}
                                             onChangeText={(txt) =>{setBankAccountOwnerName(txt)}  }
                                           />



                                           <View style={{flex: 1, width: '100%', marginTop: 10, marginBottom: 10}}>

                                                <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 14, padding: 10, color: 'black'}}
                                                    type={'outlined'}
                                                    containerStyle={{ marginTop: 10, marginBottom: 10,}}
                                                    borderWidth={2}
                                                    editable={false}
                                                    label={'Addresse'}
                                                    multiline={true}
                                                    value={appstate.user.BankAccountOwnerAddress}
                                                  />

                                                  <IconButton style={{position: 'absolute', top: 20, right: 10}}  name={'edit'} color={'#00AED8'} size={24} onPress={()=>dispatch(requestAddressPicker({type: 'bank', value: true}))}/>

                                           </View>


                                           <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 18}}
                                                  type={'outlined'}
                                                  containerStyle={{ marginTop: 10, marginBottom: 10,}}
                                                  borderWidth={2}
                                                  label={'Code postal'}
                                                  value={BankAccountPostalcode}
                                                  onChangeText={(txt) =>{setBankAccountPostalcode(txt)}  }
                                                />



                                          <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 18}}
                                              type={'outlined'}
                                              containerStyle={{ marginTop: 10, marginBottom: 10,}}
                                              borderWidth={2}
                                              label={'IBAN'}
                                              value={BankAccountIBAN}
                                              onChangeText={(txt) =>{setBankAccountIBAN(txt)}}
                                            />

                                        <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 18}}
                                              type={'outlined'}
                                              containerStyle={{ marginTop: 10, marginBottom: 10,}}
                                              borderWidth={2}
                                              label={'Numéro BIC ou SWIFT'}
                                              value={BankAccountBIC}
                                              onChangeText={(txt) =>{setBankAccountBIC(txt)}}
                                            />

                                    <Button fullWidth type="contained" containerStyle={{marginTop: 10, height: 48}} style={{height: 50}} onPress={()=>{updateBankDetails()}}  textStyle={{fontSize: 20}} text={'Enregistrer'} color={'#002D4C'} textColor={'#ffffff'}  />

                                </View>
                        </ScrollView>
                  </View>
            </View>
      );
}

export default BankForm;

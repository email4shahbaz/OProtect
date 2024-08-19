import React, {useEffect, useCallback, useState} from 'react';
import {StyleSheet, Text, View, Image, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import {IconButton, Dialog, BodyText, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';

import UserModel from '../.././models/UserModel';
import {EditableTextInput} from '../reuseable/EditableTextInput';
import BankForm from './BankForm';


import styles from '../../.././OProtect.styles.js';

//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {loadUserDocuments, requestImagePicker} from '../../../src/store/appstate';



const UserBank = () =>{

      const dispatch = useDispatch();
      const appstate = useSelector(state=>state.appstate);

      const [showBankForm, setShowBankForm] = useState(false);

      //Component didMount
      useEffect(() => {
            //dispatch(loadUserDocuments(appstate.user.getMem_uid()));
      }, [dispatch])



      return(
            <View style={{flex:1}}>
                  <View style={{flex:1, backgroundColor: '#ffffff', borderRadius: 12, margin: 12, paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                        <ScrollView>
                              <View style={{ width: '100%'}}>
                                    <Text style={{fontSize: 18, color: 'grey'}}>Coordonnées bancaires du propriétaire du compte</Text>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                          <IconButton  name={'edit'} color={'#00AED8'} size={24} onPress={()=>{setShowBankForm(true)}}/>
                                    </View>


                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>Nom</Text>
                                          <EditableTextInput style={{width: '65%'}} showEditIcon={false}  text={appstate.user.BankAccountOwnerName}  />
                                    </View>
                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>Adresse</Text>
                                          <EditableTextInput style={{width: '65%'}} showEditIcon={false}  text={appstate.user.BankAccountOwnerAddress}  />
                                    </View>
                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>Code postal</Text>
                                          <EditableTextInput style={{width: '65%'}} showEditIcon={false}  text={appstate.user.BankAccountPostalcode}  />
                                    </View>
                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>IBAN</Text>
                                          <EditableTextInput style={{width: '65%'}} showEditIcon={false}  text={appstate.user.BankAccountIBAN}  />
                                    </View>
                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '35%', fontWeight: 'bold'}}>Numéro BIC ou SWIFT</Text>
                                          <EditableTextInput style={{width: '65%'}} showEditIcon={false}  text={appstate.user.BankAccountIBAN}  />
                                    </View>
                                    <View style={styles.bookingDivider}/>


                              </View>
                        </ScrollView>
                  </View>

                  {showBankForm && (
                        <BankForm onClose={()=>setShowBankForm(false)}/>
                  )}

            </View>
      );
}

export default UserBank;

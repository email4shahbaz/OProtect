import React, {useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, Image, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import {IconButton, Dialog, BodyText, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';

import UserModel from '../.././models/UserModel';

import styles from '../../.././OProtect.styles.js';

//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {loadUserDocuments, requestImagePicker, requestDocumentPicker} from '../../../src/store/appstate';



const UserDocuments = () =>{

      const dispatch = useDispatch();
      const appstate = useSelector(state=>state.appstate);

      //Component didMount
      useEffect(() => {
            dispatch(loadUserDocuments(appstate.user.mem_uid));
      }, [dispatch])

      const loadInBrowser = useCallback(
            (link) => {
                  Linking.openURL(link).catch(err => console.error("Couldn't load page", err));
            }
      );


      return(
            <View style={{flex:1, backgroundColor: '#ffffff', borderRadius: 12, margin: 12, paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                  <ScrollView>
                        <View style={{ width: '100%'}}>
                              <View style={styles.documentRow}>
                                    <Text style={styles.docTitle}>K-bis</Text>
                                    <View style={styles.docValueRow}>
                                          <TouchableOpacity onPress={()=>loadInBrowser(appstate.userDocuments['ud_id_card'])}>
                                                <Text style={styles.docValueText}>{appstate.userDocuments['ud_id_card']}</Text>
                                          </TouchableOpacity>
                                          <View style={styles.docEditIcon}>
                                                <IconButton  name={'edit'} color={'#00AED8'} size={24} onPress={()=>{dispatch(requestDocumentPicker({value: true, type: 'ud_id_card'}))}}/>
                                          </View>
                                    </View>
                              </View>
                              <View style={styles.bookingDivider}/>

                              <View style={styles.documentRow}>
                                    <Text style={styles.docTitle}>Certificat d'assurance</Text>
                                    <View style={styles.docValueRow}>
                                          <TouchableOpacity onPress={()=>loadInBrowser(appstate.userDocuments['ud_license'])}>
                                                <Text style={styles.docValueText}>{appstate.userDocuments['ud_license']}</Text>
                                          </TouchableOpacity>
                                          <View style={styles.docEditIcon}>
                                                <IconButton  name={'edit'} color={'#00AED8'} size={24} onPress={()=>{dispatch(requestDocumentPicker({value: true, type: 'ud_license'}))}}/>
                                          </View>
                                    </View>
                              </View>


                              <View style={styles.bookingDivider}/>

                              <View style={styles.documentRow}>
                                    <Text style={styles.docTitle}>Pièce d’identité du gérant</Text>
                                    <View style={styles.docValueRow}>
                                          <TouchableOpacity onPress={()=>loadInBrowser(appstate.userDocuments['ud_agreemen_doc'])}>
                                                <Text style={styles.docValueText}>{appstate.userDocuments['ud_agreemen_doc']}</Text>
                                          </TouchableOpacity>
                                          <View style={styles.docEditIcon}>
                                                <IconButton  name={'edit'} color={'#00AED8'} size={24} onPress={()=>{dispatch(requestDocumentPicker({value: true, type: 'ud_agreemen_doc'}))}}/>
                                          </View>
                                    </View>
                              </View>

                              <View style={styles.bookingDivider}/>

                              <View style={styles.documentRow}>
                                    <Text style={styles.docTitle}>Habilitation CNAPS</Text>
                                    <View style={styles.docValueRow}>
                                          <TouchableOpacity onPress={()=>loadInBrowser(appstate.userDocuments['ud_habilitation_cnaps'])}>
                                                <Text style={styles.docValueText}>{appstate.userDocuments['ud_habilitation_cnaps']}</Text>
                                          </TouchableOpacity>
                                          <View style={styles.docEditIcon}>
                                                <IconButton  name={'edit'} color={'#00AED8'} size={24} onPress={()=>{dispatch(requestDocumentPicker({value: true, type: 'ud_habilitation_cnaps'}))}}/>
                                          </View>
                                    </View>
                              </View>


                              <View style={styles.bookingDivider}/>

                              <View style={styles.documentRow}>
                                    <Text style={styles.docTitle}>Statuts de la société</Text>
                                    <View style={styles.docValueRow}>
                                          <TouchableOpacity onPress={()=>loadInBrowser(appstate.userDocuments['ud_company_status'])}>
                                                <Text style={styles.docValueText}>{appstate.userDocuments['ud_company_status']}</Text>
                                          </TouchableOpacity>
                                          <View style={styles.docEditIcon}>
                                                <IconButton  name={'edit'} color={'#00AED8'} size={24} onPress={()=>{dispatch(requestDocumentPicker({value: true, type: 'ud_company_status'}))}}/>
                                          </View>
                                    </View>
                              </View>

                              <View style={styles.bookingDivider}/>


                        </View>
                  </ScrollView>


            </View>

      );
}

export default UserDocuments;

/*
export class UserDocuments extends React.Component {
      loggedInUser=null;
      documents=null;


      constructor(props) {
            super(props);
            this.state = {
                  isLoading: false,
                  user: props.user,
                  documents: {ud_company_status: 'http://www.google.com/find/images/url=addf;jsad;fkj;sdafjsdsdf;jsad ;fjasdf ;asd'},
            };
      }

      onEditClicked = (type)=>{
            if(this.props.onDocumentPickerRequest!=null){
                  this.props.onDocumentPickerRequest(type);
            }
      }

      setDocument = (type, url) => {
            this.state.documents[type]=url;
            this.setState({documents: this.state.documents});
      }



      render() {
            const {user, documents} = this.state;

      }
};*/

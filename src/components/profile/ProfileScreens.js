import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, Image, ScrollView, TouchableOpacity,} from 'react-native';
import {Ripple, Dialog, BodyText, IconButton, Appbar, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';



//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {loadUserDetails, changeUserDetails, saveUserDetails, requestImagePicker, requestDocumentPicker, equestAddressPicker, uploadImage, uploadDocument, requestCreatePdf} from '../../../src/store/appstate';



import UserModel from '../.././models/UserModel';
import {IconText} from '../reuseable/IconText';
import UserProfile from './UserProfile';
import CompanyProfile from './CompanyProfile';
import UserDocuments from './UserDocuments';
import UserBank from './UserBank';
import UserTarrifs from './UserTarrifs';

import {FileTypeDialog} from '../reuseable/FileTypeDialog';
import {DocumentTypeDialog} from '../reuseable/DocumentTypeDialog';
import {PDFCreator} from './PDFCreator';
import {GooglePlacesModal} from '../reuseable/GooglePlacesModal';



import styles from '../../.././OProtect.styles.js';
import {Colors} from '../../.././Colors.js';

const ProfileScreens = (props) =>{

      //useState Hook for local state
      const [loading, setLoading] = useState(true);
      const [page, setPage] = useState('profile');
      const [showLocationPicker, setShowLocationPicker] = useState(false);
      const [showDocumentDialog, setShowDocumentDialog] = useState(false);
      const [fileType, setFileType] = useState('');
      const [docType, setDocType] = useState('');



      const dispatch = useDispatch();
      const appstate = useSelector(state=>state.appstate);


      //Component didMount
      useEffect(() => {
            //MUST UNCOMMENT
            dispatch(loadUserDetails(appstate.user.mem_uid));
      }, [dispatch])


      const imageCropped = useCallback(
            (image, type) => {
                  dispatch(requestImagePicker({value: false, type: type}));

                  const data={
                              type: type,
                              fileType: image.mime,
                              uri: image.path,
                              mem_uid: appstate.user.mem_uid,
                              cmp_id: appstate.user.cmp_id,
                              ud_id: appstate.userDocId,
                  }
                  if(data.type=='profile' || data.type=='cmp_logo'){
                        dispatch(uploadImage(data));
                  }
                  else{
                        dispatch(uploadDocument(data));
                  }
            }
      );

      const documentSelected = useCallback(
            (uri, type) => {
                  dispatch(requestDocumentPicker({value: false, type: type}));

                  const data={
                              type: type,
                              fileType: 'application/pdf',
                              uri: uri,
                              mem_uid: appstate.user.mem_uid,
                              cmp_id: appstate.user.cmp_id,
                              ud_id: appstate.userDocId,
                  }
                  dispatch(uploadDocument(data));
            }
      );


      const handleOnPlaceSelect = useCallback(
            (place) => {
                  if(appstate.addressPickerType=='company'){
                        dispatch(requestAddressPicker(false));
                        dispatch(changeUserDetails({field: "cmp_address", value: place.address}));
                        dispatch(saveUserDetails({field: "cmp_address", value:  place.address}));
                  }
                  else if(appstate.addressPickerType=='bank'){
                        dispatch(requestAddressPicker(false));
                        dispatch(changeUserDetails({field: "BankAccountOwnerAddress", value: place.address}));
                        dispatch(changeUserDetails({field: "BankAccountOwnerCity", value: place.city}));
                        dispatch(changeUserDetails({field: "BankAccountOwnerCountry", value: place.country}));
                  }
            }
      );

      const createPdfClicked = useCallback(
            ()=> {
                  dispatch(requestDocumentPicker(false));
                  dispatch(requestCreatePdf({value: true, type: appstate.documentType}));
            }
      );



      //dispatch(getUserDetails(stateuser.getMem_uid()));

      return(
                  <View style={{flex: 1}}>
                        <View style={styles.mainContainer}>
                              <View style={styles.mainHeader}>
                                    <Text style={{color: 'white', fontSize: 22,}}>PARAMETRES</Text>
                                    <IconButton style={{position: 'absolute', left: 0, top: 3 }} name="keyboard-arrow-left"  size={42} color={'white'} onPress={()=>props.navigation.goBack()}  />
                              </View>


                              <View style={[styles.mainContainer, {backgroundColor: '#002D4C'}]}>
                                    {(page=='profile') && ( <UserProfile  />)}
                                    {(page=='company') && ( <CompanyProfile />)}
                                    {(page=='documents') && ( <UserDocuments />)}
                                    {(page=='bank') && ( <UserBank />)}
                                    {(page=='tarif') && ( <UserTarrifs />)}
                              </View>

                              <View style={{ height: 70, justifyContent: 'flex-end', backgroundColor: 'white'}}>
                                    <Tabs selected={page} style={{backgroundColor:'white'}}  selectedStyle={{color: Colors.mainLightBlue}} onSelect={(el)=>setPage(el.props.name)}>
                                           <IconText name='profile' key='1'  label={'Compte'} icon={'account-box'} selectedColor={Colors.mainLightBlue} textStyles={{fontSize: 11 }}/>
                                           <IconText name='company' key='2'  label={'Société'} icon={'business'} selectedColor={Colors.mainLightBlue} textStyles={{fontSize: 11}}/>
                                           <IconText name='documents' key='3'  label={'Documents'} icon={'description'} selectedColor={Colors.mainLightBlue} textStyles={{fontSize: 11}}/>
                                           <IconText name='bank' key='4'  label={'Banque'} icon={'account-balance'} selectedColor={Colors.mainLightBlue} textStyles={{fontSize: 11 }}/>
                                           <IconText name='tarif' key='5'  label={'Tarifs'} icon={'euro-symbol'} selectedColor={Colors.mainLightBlue} textStyles={{fontSize: 11 }}/>
                                     </Tabs>
                              </View>


                              {appstate.loading && (
                                    <View style={styles.loader}>
                                        <ProgressCircle color={'#002D4C'} />
                                    </View>
                              )}


                              {appstate.imagePickerRequested && (
                                    <FileTypeDialog imageType={appstate.imagePickerType} onClose={()=> dispatch(requestImagePicker({value: false, type: appstate.imageType}))}  onImageCropped={(image)=>imageCropped(image,  appstate.imagePickerType)} />
                              )}

                              {appstate.documentPickerRequested && (
                                    <FileTypeDialog imageType='document' dialogType='document' onClose={()=> dispatch(requestDocumentPicker({value: false, type: appstate.documentType}))}  onImageCropped={(image)=>imageCropped(image,  appstate.documentType)} onDocumentSelected={(uri)=>documentSelected(uri, appstate.documentType)} onCreatePdfClicked={()=> createPdfClicked()}/>
                              )}

                              {appstate.createPdfRequested && (
                                    <PDFCreator docType={appstate.documentType} onClose={()=>dispatch(requestCreatePdf({value: false}))} onPDFCreated={(uri)=>documentSelected(uri, appstate.documentType)}/>
                              )}


                              {appstate.addressPickerRequested && (
                                    <GooglePlacesModal
                                          text={'Address'}
                                          googleApiKey={'AIzaSyAIBmyMKqOQm7fSjtmKHR0gHMK2qPdJvbo'}
                                          stylesContainer={{width: '100%'}}
                                          stylesInput={{ width: '100%', paddingTop: 20,}}
                                          onSelect={place => handleOnPlaceSelect(place)}
                                          onClose={()=>dispatch(requestAddressPicker(false))}
                                    />
                              )}


                        </View>



                  </View>
      )
}

export default ProfileScreens;

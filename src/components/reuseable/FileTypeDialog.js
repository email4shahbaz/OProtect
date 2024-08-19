import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity, Alert, Platform} from 'react-native';
import {Divider, IconButton, Icon, Button,} from 'material-bread';


import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import FilePickerManager from 'react-native-file-picker';

import styles from '../../.././OProtect.styles.js';

export class FileTypeDialog extends React.Component {
      static propTypes = {
            imageType: PropTypes.String,
            docType: 'image',
            onClose: PropTypes.func,
            onFileSelected: PropTypes.func,

      }

      constructor(props) {
            super(props);
            this.state = {
                  dialogType: props.dialogType==null ? "image" : props.dialogType,
            };
      }

      openImagePicker = (mode) => {
            let options;

            if(this.props.imageType=='profile'){
                  options={width: 300, height: 300, cropping: true, cropperCircleOverlay: true, useFrontCamera: true, freeStyleCropEnabled: true};
            }
            else{
                  options={cropping: true, freeStyleCropEnabled: true};
            }

            let picker;

            if(mode==1){picker=ImagePicker.openCamera(options)}
            else{picker=ImagePicker.openPicker(options)}


            picker.then(image => {
                  if(this.props.onImageCropped!=null){
                        this.props.onImageCropped(image);
                        this.closeDialog();
                  }
            });
      }

      openDocumentPicker = async () => {
            // Pick a single file
            if(Platform.OS == 'android'){
                  FilePickerManager.showFilePicker({type: 'application/pdf'}, (response) => {
                        console.log('Response = ', response);

                        if (response.didCancel) {
                              console.log('User cancelled file picker');
                        }
                        else if (response.error) {
                              console.log('FilePickerManager Error: ', response.error);
                        }
                        else {
                              if(this.props.onDocumentSelected!=null){
                                    this.props.onDocumentSelected('file://'+response.path);
                              }
                        }
                  });
            }

            // for IOS we use DocumentPicker
            else{
                  try {
                        const result = await DocumentPicker.pick({
                              type: [DocumentPicker.types.pdf],
                        });

                        if(this.props.onDocumentSelected!=null){
                              this.props.onDocumentSelected(result.uri);
                        }
                  } catch (err) {
                        if (DocumentPicker.isCancel(err)) {
                              // User cancelled the picker, exit any dialogs or menus and move on
                        } else {
                              throw err;
                        }
                  }
            }


      }


      createNewPdf = () => {
            if(this.props.onCreatePdfClicked!=null){
                  this.props.onCreatePdfClicked();
            }
      }


      closeDialog = () => {
            if(this.props.onClose!=null){
                  this.props.onClose();
            }
      }


      render() {
            const{dialogType} = this.state;
            return(
                  <View style={styles.dialogCont}>

                        {dialogType=='document' && (
                              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    <View style={{width: '100%', padding: 30,  backgroundColor: '#777777'}}>
                                          <Text style={{color: 'white', fontSize: 20, marginBottom: 20}}>Choisir le type de Document</Text>
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={()=>this.setState({dialogType: 'image', docType: 'image'})}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Document Image</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={()=>this.setState({dialogType: 'choosePdfType'})} >
                                                <Text style={{color: 'white', fontSize: 14, }}>Document PDF</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={this.closeDialog}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Annuler</Text>
                                          </TouchableOpacity>
                                    </View>
                              </View>
                        )}


                        {dialogType=='choosePdfType' && (
                              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    <View style={{width: '100%', padding: 30,  backgroundColor: '#777777'}}>
                                          <Text style={{color: 'white', fontSize: 20, marginBottom: 20}}>Choisir le pdf source</Text>
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={this.openDocumentPicker}>
                                                <Text style={{color: 'white', fontSize: 14, }}>PDF de la gallerie</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={this.createNewPdf}  >
                                                <Text style={{color: 'white', fontSize: 14, }}>Créer un nouveau PDF</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={this.closeDialog}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Annuler</Text>
                                          </TouchableOpacity>
                                    </View>
                              </View>
                        )}


                        {dialogType=='image' && (
                              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    <View style={{width: '100%', padding: 30,  backgroundColor: '#777777'}}>
                                          <Text style={{color: 'white', fontSize: 20, marginBottom: 20}}>Choisir une image</Text>
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={()=>this.openImagePicker(1)}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Appareil photo</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={()=>this.openImagePicker(2)}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Gallerie</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={this.closeDialog}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Annuler</Text>
                                          </TouchableOpacity>
                                    </View>
                              </View>
                        )}
                  </View>
            );
      }

};

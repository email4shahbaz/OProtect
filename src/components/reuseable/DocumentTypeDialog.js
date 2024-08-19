import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Divider, IconButton, Icon, Button,} from 'material-bread';


import ImagePicker from 'react-native-image-crop-picker';
import styles from '../../.././OProtect.styles.js';

export class DocumentTypeDialog extends React.Component {
      static propTypes = {
            imageType: PropTypes.String,
            onClose: PropTypes.func,
            onFileSelected: PropTypes.func,
      }

      constructor(props) {
            super(props);
            this.state = {
                  showDocumentDialog: true,
                  showImageDialog: false,
            };
      }

      openImagePicker = (mode) => {
            let options={cropping: true};
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


      closeDialog = () => {
            if(this.props.onClose!=null){
                  this.props.onClose();
            }
      }


      render() {
            const{showDocumentDialog, showImageDialog} = this.state;
            return(

                  <View style={styles.dialogCont}>
                        {showDocumentDialog && (
                              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    <View style={{width: '100%', padding: 30,  backgroundColor: '#777777'}}>
                                          <Text style={{color: 'white', fontSize: 20, marginBottom: 20}}>Choose Document Type</Text>
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={()=>this.setState({showImageDialog: true, showDocumentDialog: false})}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Image Document</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} >
                                                <Text style={{color: 'white', fontSize: 14, }}>PDF Document</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={this.closeDialog}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Cancel</Text>
                                          </TouchableOpacity>
                                    </View>
                              </View>
                        )}


                        {showImageDialog && (
                              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                    <View style={{width: '100%', padding: 30,  backgroundColor: '#777777'}}>
                                          <Text style={{color: 'white', fontSize: 20, marginBottom: 20}}>Choose Image</Text>
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={()=>this.openImagePicker(1)}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Camera</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={()=>this.openImagePicker(2)}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Gallery</Text>
                                          </TouchableOpacity>
                                          <View style={[styles.bookingDivider, {backgroundColor: '#999999'}]} />
                                          <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={this.closeDialog}>
                                                <Text style={{color: 'white', fontSize: 14, }}>Cancel</Text>
                                          </TouchableOpacity>
                                    </View>
                              </View>
                        )}
                  </View>
            );
      }

};

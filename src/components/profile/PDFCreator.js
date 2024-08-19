import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity, Alert, Platform} from 'react-native';
import {Divider, IconButton, Icon, Button, ProgressCircle} from 'material-bread';

import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { SliderBox } from "react-native-image-slider-box";
import ImagePicker from 'react-native-image-crop-picker';
import styles from '../../.././OProtect.styles.js';

export class PDFCreator extends React.Component {
      static propTypes = {
            docType: PropTypes.String,
            onClose: PropTypes.func,
            onPDFCreated: PropTypes.func,
      }

      constructor(props) {
            super(props);
            this.state = {
                  docType: props.docType,
                  showImagePicker: false,
                  images: [],
                  currentPage: 0,
                  creatingPDF: false,
            };
      }

      openImagePicker = (mode) => {
            let options={cropping: true, freeStyleCropEnabled: true};
            let picker;
            if(mode==1){picker=ImagePicker.openCamera(options)}
            else{picker=ImagePicker.openPicker(options)}

            picker.then(image => {
                  this.state.images.push(image.path);
                  this.setState({showImagePicker: false});
            });
      }

      closeDialog = () => {
            if(this.props.onClose!=null){
                  this.props.onClose();
            }
      }


      addPage = () =>{
            this.setState({showImagePicker: true});
            //let p=this.state.pages;
            //p.push("http://www.google.com");
            //this.setState({pages: p});
      }


      removePage = () =>{
            this.state.image.splice(this.state.currentPage, 1);
            this.setState({currentPage: this.state.currentPage-1});
      }

      onSliderLayout = (e) => {
            //Alert.alert(e.nativeEvent.layout.width.toString());
            this.setState({
                  sliderWidth: e.nativeEvent.layout.width, sliderHeight: e.nativeEvent.layout.height
            });
      };


      onSlideChanged = (index) =>{
            //Alert.alert(index.toString());
            this.setState({currentPage: index})
      }


      async createPDF() {
            this.setState({creatingPDF: true});

            let html =`<div style="padding: 5px; margin: 5px; width: 2440px; background-color: 'red' ">`;

            let images='';

            for (let i = 0; i < this.state.images.length; i++) {
                  images+=` <div style="padding-left: 140px; padding-top: 100px; width: 2440px; height: 3600px; background-color: 'red' "><img src="${this.state.images[i]}" style="width: 2600px" width="2600px"  /></div> `;
            }

            html=html+images+"</div>";

            console.log(html);

            //Alert.alert("Hello", html);
            //return;

            //console.log(html);
            //return;



            let timestamp=new Date().getTime();

            const options = {
                  //Content to print
                  html,
                  //File Name
                  fileName: this.state.docType+"_"+timestamp,
                  //File directory
                  directory: 'docs',
                  width: 2480,
                  height: 3508,
            };
            let file = await RNHTMLtoPDF.convert(options);
            this.setState({creatingPDF: false});

            if(this.props.onPDFCreated!=null && file.filePath!=null){
                  if(Platform.OS=='android'){
                      this.props.onPDFCreated("file://"+file.filePath);
                  }
                  else{
                      this.props.onPDFCreated(file.filePath);
                  }

                  this.closeDialog();
            }
      }







      render() {

            const{showImagePicker, images, currentPage, creatingPDF} = this.state;

            return(
                  <View style={styles.dialogCont}>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                              <View style={{flex: 1, width: '100%', padding: 10,  backgroundColor: '#FFF'}}>
                                    <Text style={{fontSize: 24, fontWeight: 'bold'}}>Créer un nouveau PDF</Text>
                                    <IconButton name={'close'} size={24} style={{position: 'absolute', top: 10, right: 10}} onPress={()=> {if(this.props.onClose!=null) this.props.onClose()}}/>
                                    <View style={{width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 10}}>
                                          <Button type={'flat'} text={'Ajouter une page'} onPress={this.addPage}>
                                                <Text style={{marginLeft: 10, color: 'white'}}>Ajouter une page</Text>
                                          </Button>

                                          {images.length > 0 && (
                                                <Button type={'flat'} text={'Add'} onPress={this.deletePage} color={'red'} onPress={this.removePage}>
                                                      <Text style={{marginLeft: 10, color: 'white'}}>Effacer la page</Text>
                                                </Button>
                                          )}
                                    </View>

                                    <View style={{flex: 1, backgroundColor: '#CCCCCC', marginTop: 10, marginBottom: 10}}>
                                          <View style={{flex: 1}} onLayout={this.onSliderLayout}>
                                                <SliderBox
                                                     images={this.state.images}
                                                     parentWidth={this.state.sliderWidth}
                                                     sliderBoxHeight={this.state.sliderHeight}
                                                     resizeMode={'contain'}
                                                     disableOnPress={true}
                                                     currentImageEmitter={(index)=> this.onSlideChanged(index)}


                                                 />
                                          </View>
                                    </View>
                                    {images.length > 0 && (
                                          <Button type={'flat'} text={'Enregistrer'} onPress={()=>this.createPDF()} />
                                    )}
                              </View>

                        </View>








                        {showImagePicker==true && (
                              <View style={{position: 'absolute', flex:1, width: '100%', height: '100%', top: 30, left: 30, backgroundColor: '#333333'}}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20}}>
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
                                                <TouchableOpacity style={{paddingTop: 10, paddingBottom: 10}} onPress={()=> this.setState({showImagePicker: false})}>
                                                      <Text style={{color: 'white', fontSize: 14, }}>Annuler</Text>
                                                </TouchableOpacity>
                                          </View>
                                    </View>
                              </View>
                        )}


                        {creatingPDF && (
                              <View style={styles.loader}>
                                  <ProgressCircle color={'#002D4C'} />
                              </View>
                        )}
                  </View>
            );
      }

};

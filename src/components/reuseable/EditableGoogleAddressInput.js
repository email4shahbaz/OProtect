import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TextInput, Text, View, Alert, Keyboard, TouchableOpacity} from 'react-native';
import {Ripple, IconButton, Dialog, Icon} from 'material-bread';

import {GooglePlacesModal} from './GooglePlacesModal';
import {GooglePlacesInput} from './GooglePlacesInput';


export class EditableGoogleAddressInput extends React.Component {
      googleTextInput=null;
      initialText='';

      static propTypes = {
            text: PropTypes.string.isRequired,
            onEditFinish: PropTypes.func,


            textStyles: PropTypes.oneOfType([
                  PropTypes.array,
                  PropTypes.number,
                  PropTypes.shape({}),
            ]).isRequired,
      }

      constructor(props) {
            super(props);
            this.state = {
                  editable: false,
                  canEdit: this.props.editable!=null ? this.props.editable: true,
                  txt: this.props.text,
                  place: null,
            };
      }


      onEdit = () => {
            this.initialText=this.props.text;
            this.setState({txt: this.props.text, editable: true});
            this.googleTextInput.setFocus(true);
      }

      onFinishEdit = () => {
            this.setState({editable: false});
            Keyboard.dismiss();

            if(this.props.onEditFinish!=undefined && this.state.place!=null){
                  this.props.onEditFinish(this.state.place);
            }
      }

      onCancelEdit = () => {
            this.googleTextInput.setFocus(false);
            this.setState({editable: false, txt: this.initialText});
            if(this.props.onCancelEdit!=undefined){this.props.onCancelEdit(this.initialText)}
            Keyboard.dismiss();
      }

      handleOnPlaceSelect = (place) =>{
            /*this.auth.setLat(place.lat);
            this.auth.setLng(place.lng);
            this.auth.setPlace_id(place.place_id);
            this.auth.setMem_address(place.address);*/

            this.setState({place: place});

            //this.setState({user_address: place.address, user_country: place.country, user_city: place.city})
      }



      render = () => {
            const {editable, txt, canEdit} = this.state;


            return (
                  <View style={{flex:1, flexDirection: 'row'}}>
                        <View style={{flex: 1, justifyContent: 'space-between',  width: '100%'}}>
                            {editable && (
                                <GooglePlacesInput
                                    googleApiKey={'AIzaSyAIBmyMKqOQm7fSjtmKHR0gHMK2qPdJvbo'}
                                    value={txt}
                                    ref={(tf)=> this.googleTextInput = tf}
                                    editable={this.state.editable}
                                    textInputProps={{width: '90%', marginRight: 50}}
                                    onSelect={place => this.handleOnPlaceSelect(place)}
                                    />
                              )}


                                {!editable && (
                                      /*This is just a dummy text to make parent height expand
                                      //Parent height would't expand because actual text is absolute positioned.*/
                                      <View>
                                            <Text ref={(t) => {this.txtField = t}} style={{color: 'white', marginRight: 30, marginTop: 5, padding: 0}}>
                                                  {this.props.text}
                                            </Text>

                                            <Text ref={(t) => {this.txtField = t}} style={{position: 'absolute',  top: 5, left: 10, color: 'black', marginRight: 30, margin: 0, padding: 0}}>
                                                  {this.props.text}
                                            </Text>
                                      </View>
                                )}
                        </View>




                        {(editable==false && canEdit==true ) &&(
                              <IconButton  name={'edit'} color={'#00AED8'} size={24} onPress={this.onEdit}/>
                        )}

                        {editable==true &&(
                              <TouchableOpacity style={{backgroundColor: 'green', borderRadius: 10, padding: 5}} onPress={this.onFinishEdit}>
                                    <Icon  name={'done'} size={24} color={'white'}  />
                              </TouchableOpacity>
                        )}

                  </View>
            );
      }
}

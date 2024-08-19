import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TextInput, Text, View, Alert, Keyboard, TouchableOpacity} from 'react-native';
import {IconButton, Button, Icon} from 'material-bread';


export class EditableTextInput extends React.Component {
      txtField=null;
      txtInput=null;
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
                  showEditIcon: this.props.showEditIcon!=undefined ? this.props.showEditIcon : true,
                  txt: this.props.text,
                  inlineEdit: this.props.inlineEdit!=undefined ? this.props.inlineEdit : true,
            };
      }


      onEdit = () => {
            if(this.state.inlineEdit){
                  this.initialText=this.props.text;
                  this.setState({txt: this.props.text, editable: true});
                  this.txtInput.focus();
            }
            else{
                  if(this.props.onEditClicked!=undefined){
                        this.props.onEditClicked();
                  }
            }
      }

      onFinishEdit = () => {
            this.setState({editable: false});
            Keyboard.dismiss();

            if(this.props.onEditFinish!=undefined){
                  this.props.onEditFinish(this.state.txt);
            }
      }

      onCancelEdit = () => {
            this.setState({editable: false, txt: this.initialText});
            if(this.props.onCancelEdit!=undefined){this.props.onCancelEdit(this.initialText)}
            Keyboard.dismiss();
      }


      render = () => {
            const {editable, txt, canEdit, showEditIcon} = this.state;


            return (
                  <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', borderRadius: 5, padding: 10, backgroundColor: '#FFFFFF'}}>
                        <View style={{flex: 1, justifyContent: 'space-between',  width: '100%'}}>
                              {editable && (
                                    <TextInput
                                          value = {txt}
                                          editable = {editable}
                                          ref={(tf) => {this.txtInput = tf}}
                                          style={{color: 'black', marginRight: 40,  margin: 0, padding: 0}}
                                          onChangeText = {(t) => {this.setState({txt: t});}}
                                    />
                              )}


                              {!editable && (
                                    /*This is just a dummy text to make parent height expand
                                    //Parent height would't expand because actual text is absolute positioned.*/
                                    <View>
                                          <Text ref={(t) => {this.txtField = t}} style={{color: 'white', marginRight: 30, marginTop: 5, padding: 0}}>
                                                {this.props.text}
                                          </Text>

                                          <Text ref={(t) => {this.txtField = t}} style={{position: 'absolute',  top: 5, color: 'black', marginRight: 30, margin: 0, padding: 0}}>
                                                {this.props.text}
                                          </Text>
                                    </View>
                              )}

                        </View>


                        {(editable==false && canEdit==true && showEditIcon==true) &&(
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

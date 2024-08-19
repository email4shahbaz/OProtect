import React, {useEffect, useState, useCallback } from 'react';
import {StyleSheet, Text, View, Image, Alert, ScrollView, TouchableOpacity,} from 'react-native';
import {Avatar, IconButton, Ripple, Dialog, BodyText, Appbar, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';


import UserModel from '../.././models/UserModel';
import {IconText} from '../reuseable/IconText';
import {EditableTextInput} from '../reuseable/EditableTextInput';


//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {login, getUserDetails, saveUserDetails, changeUserDetails, requestImagePicker} from '../../../src/store/appstate';

import styles from '../../.././OProtect.styles.js';


const UserProfile=(props)=>{
      //Local State Hook
      //const [loading, setLoading] = useState(false);

      const dispatch = useDispatch();
      var appstate = useSelector(state => state.appstate);

      const [profileImage, setProfileImage] = useState(appstate.user.mem_photo!='' ? appstate.user.mem_photo : 'https://avatars1.githubusercontent.com/u/12564956?s=460&v=4');


      const fieldChanged = useCallback(
            (field, value, save) => {
                  dispatch(changeUserDetails({field: field, value: value}));
                  if(save){dispatch(saveUserDetails({field: field, value: value}));}
            }
      );




      if(appstate.user){
            return(
                  <View style={{flex:1, backgroundColor: '#ffffff', borderRadius: 12, margin: 12, padding: 10}}>
                        <View style={{ width: '100%', alignItems: 'center'}}>
                              <View style={{alignItems: 'flex-end'}}>
                                    <Avatar  type="image"  image={<Image source={{ uri: appstate.user.mem_photo!='' ? appstate.user.mem_photo : 'https://avatars1.githubusercontent.com/u/12564956?s=460&v=4', }}  /> }  size={80} />
                                    <IconButton name="camera-alt" size={32} color={'#00AED8'} style={{marginTop: -15}} onPress={()=> {dispatch(requestImagePicker({value: true, type: 'profile'}))}}/>
                              </View>
                        </View>

                        <ScrollView>
                              <View style={{ width: '100%', marginTop: 20,}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '25%', fontWeight: 'bold'}}>Prénom du contact</Text>
                                          <EditableTextInput style={{width: '75%'}}
                                                text={appstate.user.mem_fname}
                                                onEditFinish = {(txt)=>{fieldChanged("mem_fname", txt, true)}}
                                                onEditCancel = {(txt)=>{fieldChanged("mem_fname", txt, false)}}
                                          />

                                    </View>
                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '25%', fontWeight: 'bold'}}>Nom du contact</Text>
                                          <EditableTextInput style={{width: '75%'}}
                                                text={appstate.user.mem_lname}
                                                onEditFinish = {(txt)=>{fieldChanged("mem_lname", txt, true)}}
                                                onEditCancel = {(txt)=>{fieldChanged("mem_lname", txt, false)}}
                                          />

                                    </View>


                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '25%', fontWeight: 'bold'}}>Téléphone</Text>
                                          <EditableTextInput style={{width: '75%'}} text={appstate.user.mem_phone} editable = {false} />
                                    </View>

                                    <View style={styles.bookingDivider}/>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{width: '25%', fontWeight: 'bold'}}>Mail</Text>
                                          <EditableTextInput style={{width: '75%'}} text={appstate.user.mem_email} editable = {false} />
                                    </View>

                              </View>
                        </ScrollView>


                  </View>
            );
      }
}

export default UserProfile;

/*export class UserProfile extends React.Component {
      loggedInUser=null;



      constructor(props) {
            super(props);
            this.state = {
                  isLoading: false,
                  page: 'profile',
                  user: props.user,
                  profileImage: 'https://avatars1.githubusercontent.com/u/12564956?s=460&v=4',
            };
      }


      updateValue = (val, type) => {
            Alert.alert(type, val);
      }



      requestProfileImage = () => {
            if(this.props.onFilePickerRequest!=null){
                  this.props.onFilePickerRequest('profile');
            }
      }

      setProfileImage = (url) => {
            this.setState({profileImage: url});
      }



      render() {
            const {user, showImagePicker, profileImage} = this.state;


            return(
                        <View style={{flex:1, backgroundColor: '#ffffff', borderRadius: 12, margin: 12, padding: 10}}>
                              <View style={{ width: '100%', alignItems: 'center'}}>
                                    <View style={{alignItems: 'flex-end'}}>
                                          <Avatar  type="image"  image={<Image source={{ uri: profileImage, }}  /> }  size={80} />
                                          <IconButton name="camera-alt" size={32} color={'blue'} style={{marginTop: -20}} onPress={this.requestProfileImage}/>
                                    </View>
                              </View>

                              <Text>Hello</Text>

                              <ScrollView>
                                    <View style={{ width: '100%', marginTop: 20,}}>
                                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={{width: '35%', fontWeight: 'bold'}}>Prénom du contact</Text>
                                                <EditableTextInput style={{width: '65%'}} text={user.getMem_fname()} onEditFinish = {(txt)=>{this.updateValue(txt, 'firstName')}}/>
                                          </View>
                                          <View style={styles.bookingDivider}/>

                                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={{width: '35%', fontWeight: 'bold'}}>Nom du contact</Text>
                                                <EditableTextInput style={{width: '65%'}} text={user.getMem_lname()} onEditFinish = {(txt)=>{this.updateValue(txt, 'lastName')}}/>
                                          </View>

                                          <View style={styles.bookingDivider}/>

                                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={{width: '35%', fontWeight: 'bold'}}>Téléphone</Text>
                                                <EditableTextInput style={{width: '65%'}} text={user.getMem_phone()} editable = {false} />
                                          </View>

                                          <View style={styles.bookingDivider}/>

                                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={{width: '35%', fontWeight: 'bold'}}>Mail</Text>
                                                <EditableTextInput style={{width: '65%'}} text={user.getMem_email()} editable = {false} />
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

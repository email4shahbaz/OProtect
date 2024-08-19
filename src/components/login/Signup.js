import React, { Component, useState, useCallback, useEffect } from 'react';
import {StyleSheet,Text,View,ScrollView,TextInput,TouchableOpacity,Image,Alert,Picker,ActivityIndicator, AsyncStorage} from 'react-native';

import{ProgressCircle, TextField, Button, Icon, Ripple} from 'material-bread';
import LinearGradient from 'react-native-linear-gradient';
//import TextInputMask from 'react-native-text-input-mask';
import {GooglePlacesModal} from '../reuseable/GooglePlacesModal';

import CountryPicker from 'react-native-country-picker-modal';
import {EditableTextInput} from '../reuseable/EditableTextInput';
import {PhoneInputWithModal} from '../.././components/reuseable/PhoneInputWithModal';
import UserModel from '../.././models/UserModel';
import Auth from '../.././models/Auth';
import styles from './../../../OProtect.styles.js';


//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {login, saveUserDetails, changeUserDetails, requestImagePicker, requestAddressPicker} from '../../../src/store/appstate';


const Signup = (props) => {

      const dispatch = useDispatch();
      const appstate = useSelector(state=>state.appstate);

      const [isLoading, setIsLoading] = useState(false);
      const [fname, setFname] = useState('');
      const [lname, setLname] = useState('');
      const [auth, setAuth] = useState(null);
      const [address, setAddress] = useState('');
      const [CompanyName, setCompanyName] = useState('');
      const [CompanyNumber, setCompanyNumber] = useState('');


      //Component didMount
      useEffect(() => {
          setAuth(props.route.params.auth);
            //dispatch(loadUserDocuments(appstate.user.getMem_uid()));
      }, [dispatch])



      const handleOnPlaceSelect = useCallback(
            (place) => {
                    dispatch(requestAddressPicker(false));
                    auth.lat=place.lat;
                    auth.lng=place.lng;
                    auth.place_id=place.place_id;
                    auth.mem_address=place.address;
                    setAddress(place.address);
            }
      );


      const callSignup = useCallback(
        async () => {

            if(fname==='' || lname===''){
                  Alert.alert("Empty fields", "Please fill all required fields.");
                  return;
            }

            auth.mem_type=2;
            auth.urole_id=3;
            auth.mem_fname=fname;
            auth.mem_lname=lname;
            auth.CompanyName=CompanyName;
            auth.CompanyNumber=CompanyNumber;

            setIsLoading(true);
            try{

                  fetch('https://www.oprotect.com/api/index.php?action=signup', {
                     method: 'post',
                     body: JSON.stringify(auth),

                  }).then(function(response) {
                        return response.json();
                  }).then(onSignupSuccess)
                  .finally(() => {
                        setIsLoading(false);
                  });
            }
            catch (error) {
                  Alert.alert("Error", "Error Signup");
                  console.error(error);
                  setIsLoading(false);
            }
      }
    );


    const onSignupSuccess = useCallback(
        (result) =>{
            setIsLoading(false);
            if(result.status=== '1'){
                  Alert.alert("Registeration Successfull", "Your registeration is successfull");
                  if(result.data){
                        saveUserData(result.data);



                        //props.navigation.navigate("homeScreen", {mem_uid: result.data.mem_uid});




                        /*this.user.populateFromState(result.data);
                        this.user.setLogged_in(true);
                        this.user.setPhone_no_verified(true);
                        this.user.setIs_registered(true);

                        this.user.store("UserModel").then(() => {

                        }).catch((error) => {
                              Alert.alert("Error Storage", "You are logged in but there is error saving user to local storage");
                        });*/
                  }
            }
            else{
                  Alert.alert("Registeration Error", result.message);
            }
      }
    )



    const saveUserData = useCallback(
      async(userData) =>{
         try {
           //Alert.alert(userData.toString());
             await AsyncStorage.setItem('user', JSON.stringify(userData));
             props.navigation.navigate("homeScreen");
           }
           catch (error) {
             Alert.alert(error.toString());
               // Error saving data
           }
        }
      );

        return (
                  <View style={styles.container}>
                        <ScrollView>
                              <View style={{padding: 15}}>
                                    <Text style={styles.txtHeading}>Agents / Sociétés de sécurité</Text>
                                    <Text style={{textAlign: 'center', fontSize: 11}}>Si vous êtes une société de sécurité privée ayant toutes les autorisations et habilitations pour pouvoir exercer, merci de remplir le formulaire.</Text>
                                    <Text style={{marginTop: 20, marginBottom: 10}}>Formulaire à remplir:</Text>

                                    <View style={{flex:1}}>
                                          <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 14}}
                                                 type={'outlined'}
                                                 containerStyle={{ marginTop: 5, marginBottom: 5,}}
                                                 borderWidth={1}
                                                 value={fname}
                                                 label={'Prénom'}
                                                 onChangeText={(txt) => setFname(txt)}
                                                 trailingIcon={<Icon name={'account-circle'} size={24} color={'#00AED8'} />}
                                          />

                                          <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 14}}
                                               type={'outlined'}
                                               containerStyle={{ marginTop: 5, marginBottom: 5,}}
                                               borderWidth={1}
                                               value={lname}
                                               label={'Nom de famille'}
                                               onChangeText={(txt) => setLname(txt)}
                                               trailingIcon={<Icon name={'account-circle'} size={24} color={'#00AED8'} />}
                                          />


                                          <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 5, padding: 10, marginTop: 5, marginBottom: 5, borderColor: '#CCCCCC'}}>
                                               <Text style={{width: '35%', color: 'grey', fontSize: 16}}>Adresse</Text>
                                               <EditableTextInput style={{width: '65%'}}
                                               text={address}
                                               inlineEdit={false}
                                               onEditClicked = {()=> dispatch(requestAddressPicker({type: 'user', value: true}))}
                                               />
                                          </View>

                                          <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 14}}
                                               type={'outlined'}
                                               containerStyle={{ marginTop: 5, marginBottom: 5,}}
                                               borderWidth={1}
                                               value={CompanyName}
                                               label={'Nom de la société'}
                                               onChangeText={(txt) => setCompanyName(txt)}
                                               trailingIcon={<Icon name={'location-city'} size={24} color={'#00AED8'} />}
                                          />

                                          <TextField borderSize={2} style={{ backgroundColor: 'white', fontSize: 14}}
                                                type={'outlined'}
                                                containerStyle={{ marginTop: 5, marginBottom: 5,}}
                                                borderWidth={1}
                                                value={CompanyNumber}
                                                label={'Numéro de siret'}
                                                onChangeText={(txt) => setCompanyNumber(txt)}
                                                trailingIcon={<Icon name={'location-city'} size={24} color={'#00AED8'} />}
                                          />
                                    </View>


                        </View>

                        <View style={{flex: 1, height: '100%',  justifyContent: 'flex-end', padding: 10}}>
                              <Button fullWidth type="flat" borderRadius={0} style={{height: 40}} onPress={()=>callSignup()}  textStyle={{fontSize: 20}} text={'ENVOYER'} color={'#002D4C'} textColor={'#ffffff'}  />
                        </View>
                        {isLoading && (
                              <View style={styles.loader}>
                              <ProgressCircle color={'#E91E63'} />
                              </View>
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
                        </ScrollView>

                  </View>

            );
}


export default Signup;

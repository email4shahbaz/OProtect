import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import {GooglePlacesInput} from '../.././components/reuseable/GooglePlacesInput';


export class Signup extends React.Component {
  render(){
    return (
          <View style={styles.container}>
            <GooglePlacesInput
                  googleApiKey={'AIzaSyBO4yS7kUaq_YeebS_smAWG2APntT2Lv1g'}
                  onSelect={place => console.log("Place Country: "+place.country)}
              />
            </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
});

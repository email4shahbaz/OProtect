/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View, Alert, Image, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Button, FlatList, Modal, PermissionsAndroid,Platform} from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import {ProgressCircle, Ripple, Icon} from 'material-bread';
import LinearGradient from 'react-native-linear-gradient';
import SearchList from './../reuseable/SearchList';
import styles from './../../../OProtect.styles.js';


export class NearbyAreas extends React.Component {

     constructor(props) {
       super(props);
      //Alert.alert("Hello", this.props.route.params.type);
       this.state = {
              areas: [],
              isLoading: false,

        };
     }

     async componentDidMount() {
       this._unsubscribe = this.props.navigation.addListener('focus', () => {
          this.loadAllAreas();
       });
     };

     componentWillUnmount() {
       this._unsubscribe();
     }

    loadAllAreas=()=>{
          this.setState({isLoading: true});
          try{
                fetch('http://www.helpline-app.com/api/index.php?action=get_areas')
                .then(function(response) {
                    return response.json();
                }).then(this.allAreasLoaded)
                .finally(() => {
                      this.setState({ isLoading: false });
                });
          }
          catch (error) {
                Alert.alert("Error", "Error loading areas");
                console.error(error);
          }
    }

    allAreasLoaded = (result) => {
          this.setState({areas: result.data});
           this.filteredData = result.data;
   }



    onLocationSelected = (area) => {
       this.props.navigation.navigate("Users", {area: area})
    }



  renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={()=>{this.onLocationSelected(item.title)}}>
        <View style={styles.area_row}>
          <Icon name={'location-on'} size={36}  reverse  color="#4F8EF7" />
          <Text style={styles.area_name}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

    render() {
      const { areas } = this.state;

        return(

            <View style={styles.container}>
                  <LinearGradient colors={['#4A55FF', '#4A55FF', '#8891FF']} style={styles.mainBg} >
                        <Image style={{position: 'absolute', top: -100}} source={require('../.././images/bg_top.png')}/>

                        <Ripple rippleCentered onPress={()=>this.props.navigation.goBack()} rippleColor={'#ffffff'} >
                              <View style={{borderRadius: 75, flexDirection: 'row', paddingVertical: 5, paddingRight: 10,}}>
                                    <Icon name={"arrow-back"} size={28} color={'#ffffff'}  />
                                    <Text style={{color: '#ffffff', fontSize: 18,}}>Back</Text>
                              </View>
                        </Ripple>

                        <Text style={styles.txtHeading}>Search Areas</Text>

                        <View style={[styles.whiteBg,{padding: 10}]}>
                              <View style={{flex: 1, width: '100%'}}>
                                    {areas.length > 0 &&(
                                        <SearchList
                                          style={{width: '100%'}}
                                          data={areas}
                                          searchField='title'
                                          renderItem={this.renderItem}/>
                                    )}
                              </View>

                        </View>
                   </LinearGradient>

                   { this.state.isLoading && (
                      <View style={styles.loader}>
                          <ProgressCircle color={'red'} />
                      </View>
                   )}

            </View>
          )
      }
};

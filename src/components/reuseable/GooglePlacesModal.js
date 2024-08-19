import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
      ActivityIndicator,
      StyleSheet,
      Text,
      TextInput,
      TouchableOpacity,
      View,
      Modal,
      Alert,
      TouchableHighlight,
      PixelRatio,
      ScrollView,
} from 'react-native';

import styles from '../../.././OProtect.styles.js';
import {Icon, Paper, Button} from 'material-bread';

export class GooglePlacesModal extends Component {
      textInput=null;

      constructor(props) {
            super(props);
            this.state = {
                  places: [],
                  showList: false,
                  isLoading: false,
                  modalVisible: false,
                  resultText: "Address",
                  editable: false,
            };
      }


      timeout = null;


      setFocus = (enable) =>{
            this.setState({editable: enable});
            if(enable && this.textInput!=null){
                  this.textInput.focus();
            }
      }

      render() {
            return (
                  <View style={styles.dialogCont}>
                        <View style={{flex: 1, height: '100%', backgroundColor: '#CCCCCC'}}>
                              <View style={{flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', padding: 5}}>
                                    <Icon name={'place'} size={30} color={'#003399'} style={{position: 'absolute', zIndex: 500}}/>
                                    <TouchableOpacity style={{position: 'absolute', zIndex: 600, right: 5, top: 5}} onPress={()=>{if(this.props.onClose!=undefined){this.props.onClose();}}}>
                                          <Icon name={'close'} size={24} color={'#000000'} />
                                    </TouchableOpacity>

                                    <TextInput
                                          placeholder={this.props.text}
                                          style={{padding: 10, backgroundColor: 'white', width: '100%', paddingLeft: 30}}
                                          {...this.props.textInputProps}
                                          onChangeText={query => this.setState({ query }, () => this.fetchPlaces())}
                                          value={this.state.query}
                                          multiline={true}

                                          ref={(tf)=> {this.textInput=tf}}

                                          onFocus={() => this.setState({ showList: true })}
                                          /*onBlur={() => this.setState({ showList: false })}*/
                                          /*autoFocus = {true}*/
                                          {...this.props.textInputProps}
                                          clearButtonMode="always"
                                    />
                              </View>


                              {this.state.showList && (
                                    <ScrollView>
                                          <View shadow={3} style={{width: '100%', flex: 1, backgroundColor: '#EEEEEE'}}>
                                                {this.state.isLoading && (
                                                      <ActivityIndicator
                                                      size="small"
                                                      style={[styles.loading, this.props.stylesLoading]}
                                                      />
                                                )}
                                                {this.state.places.map(place => {
                                                      return (
                                                            <TouchableOpacity
                                                                  color={'red'}
                                                                  key={`place-${place.id}`}
                                                                  style={{padding: 10, color: '#000000', width: '100%', borderBottomWidth: 1, borderBottomColor: '#AAAAAA'}}
                                                                  onPress={() => {this.onPlaceSelect(place.place_id, place)}}
                                                                  >

                                                                  <Text style={{padding: 10, color: '#000000', width: '100%'}}>
                                                                        {this.props.resultRender(place)}
                                                                  </Text>
                                                                  {this.props.iconResult}
                                                            </TouchableOpacity>
                                                      );
                                                }
                                          )}
                                          </View>
                                    </ScrollView>
                              )}
                        </View>
                  </View>
            );
      }

      buildCountryQuery = () => {
            const { queryCountries } = this.props;

            if (!queryCountries) {
                  return '';
            }

            return `&components=${queryCountries
                  .map(countryCode => {
                        return `country:${countryCode}`;
                  })
                  .join('|')}`;
            };

            buildLocationQuery = () => {
                  const { searchLatitude, searchLongitude, searchRadius } = this.props;

                  if (!searchLatitude || !searchLongitude || !searchRadius) {
                        return '';
                  }

                  return `&location=${searchLatitude},${searchLongitude}&radius=${searchRadius}`;
            };

            buildTypesQuery = () => {
                  const { queryTypes } = this.props;

                  if (!queryTypes) {
                        return '';
                  }

                  return `&types=${queryTypes}`;
            };

            buildSessionQuery = () => {
                  const { querySession } = this.props;

                  if (querySession) {
                        return `&sessiontoken=${querySession}`
                  }

                  return ''
            };

            fetchPlaces = async () => {
                  if (!this.state.query || this.state.query.length < this.props.requiredCharactersBeforeSearch ) {
                        this.setState({showList: false});
                        return;
                  }





                  this.setState(
                        {
                              showList: true,
                              isLoading: true,
                        },
                        async () => {
                              const places = await fetch(
                                    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${
                                          this.state.query
                                    }&key=${this.props.googleApiKey}&inputtype=textquery&language=${
                                          this.props.language
                                    }&fields=${
                                          this.props.queryFields
                                    }${this.buildLocationQuery()}${this.buildCountryQuery()}${this.buildTypesQuery()}${this.buildSessionQuery()}`
                              ).then(response => response.json());


                              this.setState({
                                    isLoading: false,
                                    places: places.predictions,
                              });
                        }
                  );
            };

            onPlaceSelect = async (id, passedPlace) => {
                  //this.setState({isLoading: true,})
                  this.setState({query: passedPlace.description});

                  try {
                        const response = await fetch(
                              `https://maps.googleapis.com/maps/api/geocode/json?place_id=${id}&key=${this.props.googleApiKey}&fields=${this.props.queryFields}&language=${this.props.language}${this.buildSessionQuery()}`
                        ).then(response => response.json());


                        //  console.log(response);

                        //  this.fetchPlaceDetails(place.result.place_id)
                        return this.setState(
                              {
                                    showList: false,
                                    isLoading: false,
                                    modalVisible: false,
                                    /*query:
                                    response &&
                                    response.results[0] &&
                                    (response.results[0].formatted_address || response.result.name),*/
                              },
                              () => {

                                    let result = response.results[0];
                                    let details={address: result.formatted_address, area: "", place_id: id, street: "", city: "", state: "", country: "", zipcode: "", lat: 0.00, lng: 0.00};

                                    if(result.geometry!=null && result.geometry.location!=null){
                                          details.lat=result.geometry.location.lat.toString();
                                          details.lng=result.geometry.location.lng.toString();
                                    }


                                    for(var i=0; i<result.address_components.length; i++){

                                          if(result.address_components[i].types[0] === "political"){
                                                details.area = result.address_components[i].long_name;
                                          }

                                          else if(result.address_components[i].types[0] === "administrative_area_level_3"){
                                                details.street = result.address_components[i].long_name;
                                          }

                                          else if(result.address_components[i].types[0] === "administrative_area_level_2"){
                                                details.city = result.address_components[i].long_name;
                                          }
                                          else if(result.address_components[i].types[0] === "administrative_area_level_1"){
                                                details.state = result.address_components[i].long_name;
                                          }

                                          else if(result.address_components[i].types[0] === "country"){
                                                details.country = result.address_components[i].long_name;
                                          }

                                    }
                                    //this.setState({resultText: details.area, query: passedPlace.description});

                                    return this.props.onSelect && this.props.onSelect(details);
                              }
                        );





                        /*  return this.setState(
                        {
                        showList: false,
                        query:
                        place &&
                        place.result &&
                        (place.result.formatted_address || place.result.name),
                  },
                  () => {
                  return this.props.onSelect && this.props.onSelect(place);
            }
      );*/
} catch (e) {
      console.log(e);
      return this.setState(
            {
                  showList: false,
                  query: passedPlace.description,
            },
            () => {
                  return this.props.onSelect && this.props.onSelect(passedPlace);
            }
      );
}
};





}

GooglePlacesModal.propTypes = {
      stylesInput: PropTypes.object,
      stylesContainer: PropTypes.object,
      stylesList: PropTypes.object,
      stylesItem: PropTypes.object,
      stylesItemText: PropTypes.object,
      stylesLoading: PropTypes.object,
      resultRender: PropTypes.func,
      queryFields: PropTypes.string,
      queryCountries: PropTypes.array,
      queryTypes: PropTypes.string,
      querySession: PropTypes.string,
      searchRadius: PropTypes.number,
      searchLatitude: PropTypes.number,
      searchLongitude: PropTypes.number,
      googleApiKey: PropTypes.string.isRequired,
      placeHolder: PropTypes.string,
      textInputProps: PropTypes.object,
      iconResult: PropTypes.any,
      iconInput: PropTypes.any,
      language: PropTypes.string,
      onSelect: PropTypes.func,
      requiredCharactersBeforeSearch: PropTypes.number,
      requiredTimeBeforeSearch: PropTypes.number,
};

GooglePlacesModal.defaultProps = {
      stylesInput: {},
      stylesContainer: {},
      stylesList: {},
      stylesItem: {},
      stylesLoading: {},
      stylesItemText: {},
      queryFields: 'formatted_address,geometry,name',
      placeHolder: 'Search Areas...',
      textInputProps: {},
      language: 'en',
      resultRender: place => place.description,
      requiredCharactersBeforeSearch: 2,
      requiredTimeBeforeSearch: 500,
};


/*
const styles = StyleSheet.create({
      modal: {
            flex: 1,
      },
      textInputContainer: {
            backgroundColor: '#FFA500',
            borderTopColor: '#7e7e7e',
            borderBottomColor: '#b5b5b5',
            borderTopWidth: 1 / PixelRatio.get(),
            borderBottomWidth: 1 / PixelRatio.get(),
            flexDirection: 'row',
      },
      textInput: {
            backgroundColor: '#FFFFFF',
            borderRadius: 5,


            fontSize: 15,
            flex: 1
      },


      input: {
            paddingHorizontal: 5,

      },




      scrollView: {
            backgroundColor: '#fff',
      },
      place: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
            padding: 15,
            position: 'relative',
            zIndex: 10001,
      },
      placeIcon: {
            position: 'absolute',
            top: 10,
            right: 15,
            color: 'rgba(0,0,0,0.3)',
      },
      placeText: {
            color: 'rgba(0,0,0,0.8)',
            paddingRight: 60,
      },
      loading: {
            margin: 10,
      },
});*/

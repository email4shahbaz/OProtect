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
      TouchableHighlight,
      PixelRatio,
      ScrollView,
} from 'react-native';

import {Paper, Button} from 'material-bread';

export class GooglePlacesInput extends Component {
      textInput=null;


      state = {
            query: this.props.value,
            places: [],
            showList: false,
            isLoading: false,
            modalVisible: false,
            resultText: "Address",
            editable: this.props.editable,
            clearButtonMode: this.props.clearButtonMode,
      };

      timeout = null;



      setFocus = (val) =>{
          this.setState({editable: val, showList: false});
          this.textInput.focus(true);


      }


      render() {
            return (
                  <View style={{flex: 1, width: '100%'}}>
                        <View style={{flex: 1, width: '100%'}}>
                              <TextInput
                                    placeholder={'Address'}
                                    style={[styles.input, this.props.stylesInput, {margin: 0, padding: 0}]}
                                    ref={(ti)=> this.textInput=ti}
                                    multiline={true}
                                    {...this.props.textInputProps}
                                    onChangeText={query => this.setState({ query }, () => this.fetchPlaces())}
                                    value={this.state.query}
                                    onFocus={() => this.setState({ showList: true })}
                                    /*onBlur={() => this.setState({ showList: false })}*/
                                    /*autoFocus = {true}*/
                                    editable = {this.state.editable}
                                    style={this.props.textInputProps}
                                    clearButtonMode={this.state.clearButtonMode==true ? "always" : ""}
                              />

                              {this.state.showList && (


                                    <View shadow={3} style={{width: '100%', flex: 1, position: 'absolute',  zIndex: 100000, marginLeft: 20, marginTop: 40, marginRight: 15, backgroundColor: '#EEEEEE'}}>

                                          <ScrollView>
                                                <View style={{flex: 1,}}>
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
                                                                  style={[styles.place, this.props.stylesItem]}
                                                                  onPress={() => {this.onPlaceSelect(place.place_id, place)}}
                                                                  >

                                                                  <Text style={[styles.placeText, this.props.stylesItemText]}>
                                                                  {this.props.resultRender(place)}
                                                                  </Text>
                                                                  {this.props.iconResult}
                                                            </TouchableOpacity>
                                                      );
                                                }
                                          )}
                                          </View>
                                    </ScrollView>
                                    </View>
                              )}
                        </View>
                  </View>
            );
      }

      toggleModal = (visible) =>{
            this.setState({ modalVisible: visible });
      }


      onPlaceSearch = () => {
            //clearTimeout(this.timeout);
            //this.timeout = setTimeout(this.fetchPlaces, this.props.requiredTimeBeforeSearch);
      };

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

GooglePlacesInput.propTypes = {
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

GooglePlacesInput.defaultProps = {
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
            padding: 8,
            margin: 15,
            fontSize: 15,
            flex: 1
      },


      input: {
            height: 45,
            paddingHorizontal: 15,
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
});

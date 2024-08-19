import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View, Image, Alert, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {Ripple, Divider, TextField, IconButton, Appbar, Icon, Heading, Subtitle, Button, BodyText, ProgressCircle} from 'material-bread';

import Tabs from 'react-native-tabs';

import {IconText} from '../reuseable/IconText';
import {MissionsList} from './MissionsList';


import styles from '../../.././OProtect.styles.js';





export class AgentMissionsAndQuotes extends React.Component {
      missionsList=null;

      static propTypes = {
            bookings: PropTypes.object.isRequired,
            quotations: PropTypes.object.isRequired,
            onClose: PropTypes.func,
      }

      constructor(props) {
            super(props);
            this.state = {
                  bookingTypes: props.bookings.length > 0 ? 3:2,
                  bookings: props.bookings,
                  quotations: props.quotations,
                  page: props.bookings.length > 0 ? 'missions' : 'quotes',
            };
      }

/*      setData = (bks, qts) =>{
            this.setState({bookings: bks, quotations: qts});
      }*/

      tabChanged = (el) =>{
            this.setState({page: el.props.name});
            this.missionsList.setBookings(el.props.name=='quotes' ? 2:3, el.props.name=='quotes' ? this.state.quotations: this.state.bookings);
      }


      render() {
            const{bookingTypes, bookings, quotations} = this.state;
            return(
                  <View style={[styles.bookingCont, {padding: 0, borderRadius: 0}]}>
                        <View style={{ height: 50, backgroundColor: 'white', marginTop: 20}}>
                              <Tabs selected={this.state.page} style={{backgroundColor:'white'}}  selectedStyle={{color:'red'}} onSelect={this.tabChanged} >
                                    {bookings.length > 0 &&(
                                         <IconText name='missions' key='1'  label={'Missions'} icon={''} selectedColor={'#00AED8'} textStyles={{fontSize: this.state.page=='missions' ? 28: 22, fontWeight: 'bold'} } />
                                    )}

                                    {quotations.length > 0 &&(
                                         <IconText name='quotes' key='2'  label={'Devis'} icon={''} selectedColor={'#00AED8'} textStyles={{fontSize: this.state.page=='quotes' ? 28: 22, fontWeight: 'bold'} } />
                                    )}
                               </Tabs>
                        </View>

                        <IconButton name="close" size={24} style={{position: 'absolute', top: 10, right: 10, alignSelf: 'flex-end'}} onPress={()=>{this.props.onClose()}}/>

                        <View style={{flex: 1, backgroundColor: '#002D4C'}}>
                              <MissionsList ref={list => {this.missionsList = list}} static={true}
                                    onViewQuoteClicked={(booking)=>{this.props.onViewQuoteClicked(booking)}}
                                    onRefuseMissionClicked={(booking)=>{this.props.onRefuseMissionClicked(booking)}}
                                    bookingTypes={bookingTypes}
                                    bookings={bookingTypes==2 ? quotations : bookings}
                                     />
                        </View>
                  </View>
            );
      }

};

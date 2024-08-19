import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View, Image, Alert, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {Ripple, Divider, TextField, IconButton, Appbar, Icon, Heading, Subtitle, Button, BodyText, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';

import UserModel from '../.././models/UserModel';
import {QuotePriceInput} from './QuotePriceInput';

import QuotationItem from '../.././models/quotation/QuotationItem';

import styles from '../../.././OProtect.styles.js';





export class ViewQuote extends React.Component {
      static propTypes = {
            booking: PropTypes.object.isRequired,
            onClose: PropTypes.func,
      }

      constructor(props) {
            super(props);
            this.state = {
                  user: props.user,
                  booking: props.booking,
            };
      }

      getAllGuardTypes=(booking)=>{
            let guardTypes="";
            if(booking.booking_agents!=null && booking.booking_agents.length > 0){
                  for(let i=0; i<booking.booking_agents.length; i++){
                        guardTypes=guardTypes+booking.booking_agents[i].gt_title_fr+"\n";
                  }
                  if(guardTypes.endsWith("\n")){
                        guardTypes=guardTypes.substring(0, guardTypes.length-1);
                  }
            }
            return guardTypes;
      }









      render() {
            const{booking, isLoading, estimateLoaded, newEstimate} = this.state;
            return(
                  <View style={styles.bookingCont}>
                        <IconButton name="close" size={24} style={{position: 'absolute', top: 5, right: 5, alignSelf: 'flex-end'}} onPress={()=>{this.props.onClose()}}/>
                        <ScrollView style={{marginTop: 15}}>
                              <View style={{width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                    <View style={[styles.bookingItemValItem, styles.bookingItemValItemQuote, {paddingRight: 20}]}>
                                          <Text style={styles.quoteItemValTitle}>Addresse</Text>
                                          <Text style={[styles.quoteItemValValue, {marginLeft: 10}]}>{booking.mission_address}</Text>
                                    </View>

                                    <View style={[styles.bookingItemValItem, styles.bookingItemValItemQuote]}>
                                          <Text style={styles.quoteItemValTitle}>Dates</Text>
                                          <Text style={styles.quoteItemValValue}>{`Du ${booking.start_date} Au ${booking.end_date}`}</Text>
                                    </View>

                                    <View style={[styles.bookingItemValItem, styles.bookingItemValItemQuote]}>
                                          <Text style={styles.quoteItemValTitle}>Heures</Text>
                                          <Text style={styles.quoteItemValValue}>{booking.booking_hours}</Text>
                                    </View>

                                    <View style={[styles.bookingItemValItem, styles.bookingItemValItemQuote]}>
                                          <Text style={styles.quoteItemValTitle}>Nb d'agents</Text>
                                          <Text style={styles.quoteItemValValue}>{booking.total_agents}</Text>
                                    </View>
                                    <TextField
                                            type={'outlined'}
                                            containerStyle={{ marginTop: 5, width: '100%', }}
                                            label={'Message du devis...'}
                                            style={{padding: 0}}
                                            editable={false}
                                            multiline
                                            height={80}
                                            value={this.state.quotationMessage}
                                            onChangeText={value => this.setState({ quotationMessage: value })}
                                          />
                              </View>

                              <View style={{ width: '100%', marginTop: 10,  backgroundColor: '#CCCCCC', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                    <Text style={{width: '100%', padding: 10, marginBottom: 8, backgroundColor: '#002D4C', color: 'white', fontWeight: 'bold'}}>INDIQUEZ VOS TARIFS HORAIRES</Text>
                                    <QuotePriceInput label='Jour' editable={false} value={booking.prc_day_rate} />
                                    <View style={styles.quoteBoxDivider} />
                                    <QuotePriceInput label='Nuit' editable={false} value={booking.prc_night_rate}/>
                                    <View style={styles.quoteBoxDivider} />
                                    <QuotePriceInput label='Dimanche jour' editable={false} value={booking.prc_sunday_day_rate}/>
                                    <View style={styles.quoteBoxDivider} />
                                    <QuotePriceInput label='Dimanche nuit' editable={false} value={booking.prc_sunday_night_rate}/>
                                    <View style={styles.quoteBoxDivider} />
                                    <QuotePriceInput label='Jours fériés' editable={false} value={booking.prc_holiday_rate}/>
                              </View>
                              <View style={{marginTop: 10,}}>
                                    <Text style={{fontWeight: 'bold'}}>Prix:</Text>
                                    <View style={styles.quotePriceBox}>
                                         <Text style={{marginTop: 5}}>{this.getAllGuardTypes(this.state.booking)}</Text>
                                         <Text style={styles.quotePriceText}>{booking.qt_Total}€</Text>
                                    </View>
                                    <View style={[styles.quoteBoxDivider, {marginTop: 5}]} />

                                    <View style={styles.quotePriceBox}>
                                         <Text style={{marginTop: 5}}>Commission</Text>
                                         <Text style={styles.quotePriceText}>-{booking.qt_Fees}€</Text>
                                    </View>
                                    <View style={styles.quotePriceBox}>
                                         <Text style={{marginTop: 5}}>Total HT</Text>
                                         <Text style={styles.quotePriceText}>{(booking.qt_Total-booking.qt_Fees).toFixed(2)}€</Text>
                                    </View>

                                    <View style={styles.quotePriceBox}>
                                         <Text style={{marginTop: 5}}>TVA</Text>
                                         <Text style={styles.quotePriceText}>{booking.agent_amount.vat.toFixed(2)}€</Text>
                                    </View>
                                    <View style={[styles.quoteBoxDivider, {marginTop: 5}]} />
                                    <View style={styles.quotePriceBox}>
                                         <Text style={{marginTop: 5, color: 'blue'}}>Total TTC</Text>
                                         <Text style={[styles.quotePriceText,{color: 'blue'}]}>{booking.agent_amount.total_amount.toFixed(2)}€ TTC</Text>
                                    </View>

                              </View>
                        </ScrollView>

                  </View>
            );
      }

};

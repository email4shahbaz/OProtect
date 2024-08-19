import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View, Image, Alert, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {Ripple, Divider, TextField, IconButton, Appbar, Icon, Heading, Subtitle, Button, BodyText, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';

import UserModel from '../.././models/UserModel';
import {QuotePriceInput} from './QuotePriceInput';


import styles from '../../.././OProtect.styles.js';





export class SendQuote extends React.Component {
      static propTypes = {
            booking: PropTypes.object.isRequired,
            onClose: PropTypes.func,
            onQuotationSent: PropTypes.func,
      }

      hourlyRates={dayRate: '', nightRate: '', sundayDayRate: '', sundayNightRate: '', holidayRate: ''};
      loggedInUser=null;
      quotationItem = {};

      constructor(props) {
            super(props);
            this.state = {
                  isLoading: false,
                  user: props.user,
                  bookingTypes: props.bookingTypes,
                  booking: props.booking,
                  estimateLoaded: false,
                  agentHourlyRates: this.hourlyRates,
                  quotationMessage: '',
            };
      }


      loadEstimate = () =>{
            if(this.checkAllRatesFilled()===false){
                  Alert.alert("Warning", "Merci de remplir tous les champs");
            }
            else{
                  this.callEstimateService();
            }
      }

      callEstimateService = async () => {
           try{
                 this.setState({isLoading: true})

                 let query=`mem_uid=${this.state.user.user_id}&prebooking_id=${this.state.booking.booking_id}&day_rate=${this.state.agentHourlyRates.dayRate}&night_rate=${this.state.agentHourlyRates.nightRate}&sunday_day_rate=${this.state.agentHourlyRates.sundayDayRate}&sunday_night_rate=${this.state.agentHourlyRates.sundayNightRate}&holiday_rate=${this.state.agentHourlyRates.holidayRate}`;
                 fetch(`https://www.oprotect.com/api/index.php?action=getQuotePrice&${query}`, {
                     method: 'get',
                 }).then(function(response) {
                     return response.json();
               }).then(this.onEstimateLoaded)
                 .finally(() => {
                       this.setState({ isLoading: false });
                 });
           }
           catch (error) {
                 Alert.alert("Error", "Error loading booking Estimate");
                 console.error(error);
                 this.setState({ isLoading: false });
           }
      }


      onEstimateLoaded = (result) =>{
            if(result.status=== '1'){
                  /*Alert.alert("Registeration Successfull", "Your registeration is successfull");*/
                  if(result.data){
                        this.setState({estimateLoaded: true, newEstimate: result.data.agent_amount});
                  }
            }
            else{
                  //Alert.alert("Registeration Error", result.message);
            }
      }



      callSendQuotation = async () => {
            this.setState({isLoading: true});
		try{
                  this.quotationItem.mem_uid=this.state.user.mem_uid;
                  this.quotationItem.prebooking_id=this.state.booking.booking_id;
                  this.quotationItem.day_rate=this.state.agentHourlyRates.dayRate;
                  this.quotationItem.night_rate=this.state.agentHourlyRates.nightRate;
                  this.quotationItem.sunday_day_rate=this.state.agentHourlyRates.sundayDayRate;
                  this.quotationItem.sunday_night_rate=this.state.agentHourlyRates.sundayNightRate;
                  this.quotationItem.holiday_rate=this.state.agentHourlyRates.holidayRate;
                  this.quotationItem.qt_message=this.state.quotationMessage;
                  this.quotationItem.calculated_price=this.state.newEstimate.total_price;

                 // let item=JSON.stringify(this.quotationItem);


			
			fetch('https://www.oprotect.com/api/index.php?action=addQuotation', {
			    method: 'post',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                      },

			    body: JSON.stringify(this.quotationItem),
			}).then(function(response) {
			    return response.text();
		    }).then(this.onSendQuotationResult)
			.finally(() => {
	                  this.setState({ isLoading: false });
	            });
		}
	    	catch (error) {
			Alert.alert("Error", "Error");
			console.error(error);
                  this.setState({isLoading: false});
	    	}
     }

	onSendQuotationResult = (result) => {
            Alert.alert('response', result);
            this.setState({isLoading: false});
		if (result.status=== '1'){
			Alert.alert("succès", "Votre devis a été envoyé avec succès");
                  this.props.onQuotationSent();
		}
		else{
			Alert.alert("Failed", result.message);
		}
	}



      checkAllRatesFilled=()=>{
            if(this.state.agentHourlyRates.dayRate==='' || this.state.agentHourlyRates.nightRate==='' || this.state.agentHourlyRates.sundayDayRate==='' || this.state.agentHourlyRates.sundayNightRate==='' || this.state.agentHourlyRates.holidayRate===''){
                  return false;
            }
            return true;
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
                  <ScrollView>

                  <View style={styles.bookingCont}>
                        <IconButton name="close" size={24} style={{alignSelf: 'flex-end'}} onPress={()=>{this.props.onClose()}}/>
                      
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
                                            containerStyle={{ marginTop: 15, width: '100%', }}
                                            label={'Message du devis...'}
                                            style={{padding: 0}}
                                            multiline
                                            height={80}
                                            value={this.state.quotationMessage}
                                            onChangeText={value => this.setState({ quotationMessage: value })}
                                          />
                              </View>
                              <View>
                                
                                        <View style={{ flex: 1, width: '100%', marginTop: 10,  backgroundColor: '#CCCCCC', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                              <Text style={{width: '100%', padding: 10, marginBottom: 10, backgroundColor: '#002D4C', color: 'white', fontWeight: 'bold'}}>INDIQUEZ VOS TARIFS HORAIRES</Text>
                                              <QuotePriceInput label='Jour' onRateChanged={(rate)=>{this.hourlyRates.dayRate = rate}} />
                                              <View style={styles.quoteBoxDivider} />
                                              <QuotePriceInput label='Nuit' onRateChanged={(rate)=>{this.hourlyRates.nightRate = rate}} />
                                              <View style={styles.quoteBoxDivider} />
                                              <QuotePriceInput label='Dimanche jour' onRateChanged={(rate)=>{this.hourlyRates.sundayDayRate = rate}}/>
                                              <View style={styles.quoteBoxDivider} />
                                              <QuotePriceInput label='Dimanche nuit' onRateChanged={(rate)=>{this.hourlyRates.sundayNightRate = rate}}/>
                                              <View style={styles.quoteBoxDivider} />
                                              <QuotePriceInput label='Jours fériés' onRateChanged={(rate)=>{this.hourlyRates.holidayRate = rate}}/>

                                              <View style={{width: '100%', padding: 10,}}>
                                                    <Button fullWidth text={'CALCULER'} color={'#00AED8'} type="flat" textStyle={{fontSize: 18,}} radius={8} onPress={()=>{this.loadEstimate()}}  />
                                              </View>
                                        </View>
                              
                              </View>
                            
                            
                              <View >
                                    {estimateLoaded && (
                                          <View style={{marginTop: 10,}}>
                                                <Text style={{fontWeight: 'bold'}}>Prix:</Text>
                                                <View style={styles.quotePriceBox}>
                                                     <Text style={{marginTop: 5}}>{this.getAllGuardTypes(this.state.booking)}</Text>
                                                     <Text style={styles.quotePriceText}>{newEstimate.total_price.toFixed(2)}€</Text>
                                                </View>
                                                <View style={[styles.quoteBoxDivider, {marginTop: 5}]} />

                                                <View style={styles.quotePriceBox}>
                                                     <Text style={{marginTop: 5}}>Commission</Text>
                                                     <Text style={styles.quotePriceText}>-{newEstimate.fees.toFixed(2)}€</Text>
                                                </View>
                                                <View style={styles.quotePriceBox}>
                                                     <Text style={{marginTop: 5}}>Total HT</Text>
                                                     <Text style={styles.quotePriceText}>{newEstimate.total_agent.toFixed(2)}€</Text>
                                                </View>

                                                <View style={styles.quotePriceBox}>
                                                     <Text style={{marginTop: 5}}>TVA</Text>
                                                     <Text style={styles.quotePriceText}>{newEstimate.vat.toFixed(2)}€</Text>
                                                </View>
                                                <View style={[styles.quoteBoxDivider, {marginTop: 5}]} />
                                                <View style={styles.quotePriceBox}>
                                                     <Text style={{marginTop: 5, color: 'blue'}}>Total TTC</Text>
                                                     <Text style={[styles.quotePriceText,{color: 'blue'}]}>{newEstimate.total_amount.toFixed(2)}€ TTC</Text>
                                                </View>

                                                <View style={styles.quotePriceBox}>
                                                     <Text style={{marginTop: 5, color: 'blue', paddingRight: 30}}>Pour cette prestation vous percevrez un montant de {newEstimate.total_amount.toFixed(2)}€</Text>
                                                </View>

                                                <View style={{padding: 10, justifyContent: 'center'}}>
                                                      <Button type="flat" text={'ENVOYER LE DEVIS'} color={'#002D4C'} textStyle={{fontSize: 18,}} radius={8} onPress={()=>{this.callSendQuotation()}} />
                                                </View>
                                          </View>
                                    )}
                            </View>

                      </View>

                      
                      {this.state.isLoading && (
                              <View style={{position:'absolute', zIndex: 100, width: '100%', height: '100%'}}>
                                    <View style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#CCCCCCCC', alignItems: 'center', paddingTop: 20, justifyContent: 'center'}}>
                                          <ProgressCircle color={'#E91E63'} size={24} />
                                    </View>
                              </View>
                        )}
                              
                  </ScrollView>
            );
      }

};

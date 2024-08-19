import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Image, Alert, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {Ripple, Divider, IconButton, Appbar, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';

import UserModel from '../.././models/UserModel';
import {MoreText} from '../reuseable/MoreText';
import styles from '../../.././OProtect.styles.js';

export class MissionsList extends React.Component {
      static propTypes = {
            bookingTypes: PropTypes.string.isRequired,
            itemStyle: PropTypes.object,
            onSendQuoteClicked: PropTypes.func,
            onViewQuoteClicked: PropTypes.func,
            onRefuseMissionClicked: PropTypes.func,
      }

      loggedInUser=null;

      constructor(props) {
            super(props);
            this.state = {
                  isLoading: false,
                  user: props.user,
                  noRecord: false,
                  bookingTypes: props.bookingTypes,
                  bookings:[],
            };

      }


      async componentDidMount() {
            if(this.props.static==true && this.props.bookings){
                  this.setState({bookingTypes: this.props.bookingTypes, bookings: this.props.bookings});
            }
            else{
                  this.reload(this.state.bookingTypes);
            }
      }

      setBookings = (types, bks) =>{
            this.setState({bookingTypes: types, bookings: bks});
      }

      reload = (type)=>{
            this.setState({bookingTypes: type});
            this.loadData(type);
      }



      loadData = async (type) => {
		 // validationResult is undefined if there are no errors
		try{
			this.setState({isLoading: true})

                  let callType="";
                  if(type==1){callType='getOffers';}
                  else if(type==2){callType='getMyQuotes';}
                  else if(type==3){callType='getAgentsBookings';}

                  //alert(callType+', '+this.state.user.mem_uid);
                  

			fetch(`https://www.oprotect.com/api/index.php?action=${callType}&mem_uid=${this.state.user.mem_uid}`, {
			    method: 'get',
			}).then(function(response) {
			    return response.json();
		    }).then(this.onBookingsLoaded)
			.finally(() => {
	                  this.setState({ isLoading: false });
	            });
		}
	    	catch (error) {
			Alert.alert("Error", "Error loading bookings");
			console.error(error);
                  this.setState({ isLoading: false, noRecord: true });
	    	}
     }

	onBookingsLoaded = (result) => {

            this.setState({ isLoading: false });
		if (result.status=== '1'){
			if(result.data){
                        if(result.data.length==0){
                              this.setState({noRecord:true});
                        }
                        else{
                              this.setState({noRecord: false, bookings: result.data});
                        }
                  }
			else{
                        this.setState({noRecord: true});
			}
		}

		else{
			Alert.alert("Error", result.message);
		}
	}



      getBookingTimes(item){
            let hrsFrom = item.hours_number_from;
            if(hrsFrom!=null && hrsFrom.length > 5){
                  hrsFrom=hrsFrom.substring(0, hrsFrom.length-3);
            }

            let hrsTo = item.hours_number_to;
            if(hrsTo!=null && hrsTo.length>5){
                  hrsTo=hrsTo.substring(0, hrsTo.length-3);
            }
            item.booking_hours = "De "+hrsFrom+" à  "+hrsTo;
            return item.booking_hours;
      }

      getAllGuardTypes(item){
            let guardTypes="";
            let guardsArr=[];


            if(item.booking_agents!=null && item.booking_agents.length>0){
                  for(let i=0; i<item.booking_agents.length; i++){
                        if(!guardsArr.includes(item.booking_agents[i].gt_title_fr)){
                              guardsArr.push(item.booking_agents[i].gt_title_fr);
                        }
                  }
                  guardTypes=guardsArr.toString().split(",").join("\n");
            }
            return guardTypes;
      }


      renderItem = ({item}) => {
           return (
                 <View style={[styles.bookingCont, this.props.itemStyle]}>
                        <View style={{width: '100%', flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                              <Text style={{color: '#00AED8', fontWeight: 'bold'}}>{`Booking: ${item.booking_id}`}</Text>
                              {(this.state.bookingTypes==2 || this.state.bookingTypes==3) && (
                                    <Text style={{color: '#00AED8', fontWeight: 'bold'}}>{`Devis: ${item.qt_id}`}</Text>
                              )}
                        </View>
                        {(this.state.bookingTypes==1 || this.state.bookingTypes==2) &&(
                              <View style={styles.bookingItemBtnCont}>
                                    <View style={styles.bookingHeaderButton}>
                                          {this.state.bookingTypes==1 &&(
                                                <Button style={{marginRight: 5}} type='flat' text='Envoyer un devis' color={'#73AA73'} useInputCasing={true} onPress={()=>{if(this.props.onSendQuoteClicked!=null) this.props.onSendQuoteClicked(item)}}/>
                                          )}

                                          {this.state.bookingTypes==2 &&(
                                                <Button style={{marginRight: 5}} type='flat' text='Détails du devis' color={'#3D77B5'} useInputCasing={true} onPress={()=>{if(this.props.onViewQuoteClicked!=null) this.props.onViewQuoteClicked(item)}}/>
                                          )}

                                    </View>
                                    <View style={styles.bookingHeaderButton}>
                                          <Button style={{marginLeft: 5}} type='flat' text='Refuser la mission' color={'#EE4C4C'} useInputCasing={true} onPress={()=>{if(this.props.onRefuseMissionClicked!=null) this.props.onRefuseMissionClicked(item)}}/>
                                    </View>
                              </View>
                        )}


                        <View style={[styles.bookingCont, {padding: 0}]}>
                              {this.state.bookingTypes==3 &&(
                                    <View style={[styles.bookingItemValItem, {marginTop: 10}]}>
                                          <Text style={styles.bookingItemValTitle}>Statut de la réservation</Text>
                                          <View style={styles.bookingItemValValue}>
                                                <Text style={{color: 'green', fontSize: 16}}>accepté</Text>
                                          </View>
                                    </View>
                              )}

                              <View style={styles.bookingDivider}/>
                              <View style={styles.bookingItemValItem}>
                                    <Text style={styles.bookingItemValTitle}>Dates</Text>
                                    <Text style={styles.bookingItemValValue}>{`Du ${item.start_date} Au ${item.end_date}`}</Text>
                              </View>
                              <View style={styles.bookingDivider}/>
                              <View style={styles.bookingItemValItem}>
                                    <Text style={styles.bookingItemValTitle}>Heures</Text>
                                    <Text style={styles.bookingItemValValue}>{this.getBookingTimes(item)}</Text>
                              </View>
                              <View style={styles.bookingDivider}/>
                              <View style={styles.bookingItemValItem}>
                                    <Text style={styles.bookingItemValTitle}>Durée de la mission</Text>
                                    <Text style={styles.bookingItemValValue}>{item.mission_duration} Heures</Text>
                              </View>

                              <View style={styles.bookingDivider}/>
                              <View style={styles.bookingItemValItem}>
                                    <Text style={styles.bookingItemValTitle}>Nombre d'agents</Text>
                                    <Text style={styles.bookingItemValValue}>{item.total_agents}</Text>
                              </View>

                              <View style={styles.bookingDivider}/>
                              <View style={styles.bookingItemValItem}>
                                    <Text style={styles.bookingItemValTitle}>Heures facturées</Text>
                                    <Text style={styles.bookingItemValValue}>{item.total_billed_hrs} Heures</Text>
                              </View>

                              <View style={styles.bookingDivider}/>
                              <View style={styles.bookingItemValItem}>
                                    <Text style={styles.bookingItemValTitle}>Type de sécurité</Text>
                                    <Text style={styles.bookingItemValValue}>{this.getAllGuardTypes(item)}</Text>
                              </View>

                              {this.state.bookingTypes==3 &&(
                                    <View>
                                          <View style={styles.bookingDivider}/>
                                          <View style={styles.bookingItemValItem}>
                                                <Text style={styles.bookingItemValTitle}>Prix TTC</Text>
                                                <Text style={styles.bookingItemValValue}>{item.agent_amount.total_amount.toFixed(2)}€ TTC</Text>
                                          </View>
                                    </View>
                              )}

                              <View style={styles.bookingDivider}/>
                              <View style={styles.bookingItemValItem}>
                                    <Text style={styles.bookingItemValTitle}>Adresse</Text>
                                    <Text style={styles.bookingItemValValue}>{item.location_address}</Text>
                              </View>

                              <View style={styles.bookingDivider}/>
                              <View style={styles.bookingItemValItem}>
                                    <Text style={styles.bookingItemValTitle}>Description</Text>
                                    <View style={styles.bookingItemValValue}>
                                          <MoreText  text={item.mission_description} />
                                    </View>
                              </View>
                        </View>
                 </View>
           );
     }


      render() {
            const{bookingTypes, bookings, noRecord} = this.state;
            return(
                  <View style={styles.container}>
                        <View style={{flex:1, backgroundColor: '#002D4C'}}>
                              { this.state.isLoading===false && (
                                    <View style={{flex:1}}>
                                          {noRecord===true &&(
                                                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                                      <Text style={{color: 'white', fontSize: 24, textAlign: 'center', paddingLeft: 40, paddingRight: 40,}}>{this.state.noRecord && bookingTypes=='1' &&('Vous n’avez pas de demandes de devis  en attente.') || this.state.noRecord && bookingTypes=='2' &&('Vous n’avez pas de devis en attente.')  || this.state.noRecord && bookingTypes=='3' &&('Vous n’avez pas de missions en attente')}</Text>
                                                </View>
                                          )}

                                          {(noRecord==false && this.state.bookings!=null && this.state.bookings.length>0) &&(
                                                <View style={{ flex:1, width: '100%', top: 0, left: 0, flex: 1, paddingTop: 10, paddingLeft: 10, paddingRight: 10, paddingBottom: 2 }} >
                                                      <FlatList
                                                        extraData={this.state}
                                                        data={this.state.bookings}
                                                        keyExtractor = {(list) => {
                                                           return list.booking_id;
                                                        }}
                                                        renderItem={this.renderItem}/>
                                                </View>
                                          )}
                                    </View>
                              )}
                        </View>


				{ this.state.isLoading && (
					<View style={styles.loader}>
					    <ProgressCircle color={'#00AED8'} />
					</View>
				)}
                  </View>
            );
      }
};

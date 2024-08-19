import React from 'react';
import {StyleSheet, Text, View, Image, Alert, ScrollView, TouchableOpacity,} from 'react-native';
import {Ripple, Dialog, BodyText, IconButton, Appbar, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';

import UserModel from '../.././models/UserModel';
import {IconText} from '../reuseable/IconText';
import {MissionsList} from './MissionsList';
import {SendQuote} from './SendQuote';
import {ViewQuote} from './ViewQuote';
import {RefuseMission} from './RefuseMission';
import {OPCalendar} from './../reuseable/OPCalendar';
import {AgentMissionsAndQuotes} from './AgentMissionsAndQuotes';

import styles from '../../.././OProtect.styles.js';

export class MissionsScreen extends React.Component {
      loggedInUser=null;
      bookingList=null;
      calendarView=null;

      //For Calendar
      allQuotations=null;
      allQuotationDates=null;

      constructor(props) {
            super(props);
            this.state = {
                  isLoading: false,
                  page: 'offers',
                  bookingTypes: 1,
                  showSendQuoteDialog: false,
                  showViewQuoteDialog: false,
                  showRefuseMissionDialog: false,
                  showCalendar: false,
                  booking: props.route.params.booking,
                  user: props.route.params.user,
            };
      }

      tabChanged = (el) => {
            if(el.key==4){
                  this.setState({page:el.props.name,  showCalendar: true,});
                  this.loadAllQuotations();
            }
            else{
                  this.setState({bookingTypes: el.key, page:el.props.name, showCalendar: false});
                  if(this.bookingList!=null){
                        this.bookingList.reload(el.key);
                  }
            }
      }

      //For Calendar Only
      loadAllQuotations = () =>{
            this.setState({isLoading: true});
            try{
                  fetch(`https://www.oprotect.com/api/index.php?action=getMyQuotes&mem_uid=${this.state.user.mem_uid}`, {
                        method: 'get',
                  }).then(function(response) {
                        return response.json();
                  }).then((result) => {
                        if (result.status=== '1'){
                              if(result.data){
                                    //Add all quotes dates
                                    this.allQuotations=result.data;
                                    this.allQuotationDates=this.setBookingDays(this.allQuotations, 2);
                                    this.loadAllBookings();
                              }
                        }
                        else{Alert.alert("Error", result.message);}
                  }).finally(() => {
                        this.setState({ isLoading: false });
                  });
            }
           catch (error) {
                 Alert.alert("Error", "Error loading quotations");
                 this.setState({ isLoading: false });
           }
      }

      //For Calendar Only
      loadAllBookings = () =>{
            this.setState({isLoading: true});
            try{
                  fetch(`https://www.oprotect.com/api/index.php?action=getAgentsBookings&mem_uid=${this.state.user.mem_uid}`, {
                        method: 'get',
                  }).then(function(response) {
                        return response.json();
                  }).then((result) => {
                        if (result.status=== '1'){
                              if(result.data){
                                    let allBookingDates=this.setBookingDays(result.data, 3);
                                    this.calendarView.updateBookingAndQuotations(result.data, allBookingDates, this.allQuotations, this.allQuotationDates);
                              }
                        }
                        else{Alert.alert("Error", result.message);}
                  }).finally(() => {
                        this.setState({ isLoading: false });
                  });
            }
           catch (error) {
                 Alert.alert("Error", "Error loading quotations");
                 this.setState({ isLoading: false });
           }
      }



      //This function adds individual dates as key and miliseconds as value for all booking days between start and end date.
      setBookingDays = (data, type) => {
            var allBookingDates=[];

            if (data != null && data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                        let booking = data[i];
                        booking.bookingPhase=type;
                        let startStr = booking.start_date;
                        let endStr = booking.end_date;
                        if (startStr.includes(" ")) {startStr = startStr.split(" ")[0];}
                        if (endStr.includes(" ")) {endStr = endStr.split(" ")[0];}

                        let startDate;
                        let endDate;

                        let startArr = startStr.split("/");
                        if (startArr.length == 3) {startDate = new Date(startArr[2], startArr[1]-1, startArr[0], 0, 0, 0);}

                        let endArr = endStr.split("/");
                        if (endArr.length == 3) {endDate = new Date(endArr[2], endArr[1]-1, endArr[0], 0, 0, 0);}
                        booking.allBookingDays=this.getAllBookingDays(startDate, endDate, allBookingDates);

                  }
            }
            return allBookingDates;
      }

      getAllBookingDays = (startDate, endDate, datesArr) => {
            const allDaysOfBooking={};
            while (startDate <= endDate) {
                  let key=new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toJSON().slice(0,10);
                  if(!datesArr.includes(key)){
                        datesArr.push(key);
                  }

                  allDaysOfBooking[key]=startDate.getTime();
                  startDate.setDate(startDate.getDate()+1);
            }
            return allDaysOfBooking;
      }

      onCalendarDateClicked = (cellData, bookings, quotations) => {
            let bks = [];
            let qts = [];

            //Date has bookings and quotations
            if(cellData.hasBookings && cellData.hasQuotations){
                  bks = this.getBookingsByDate(cellData.dateStr, bookings);
                  qts = this.getBookingsByDate(cellData.dateStr, quotations);
            }

            //Date has only bookings
            else if(cellData.hasBookings && !cellData.hasQuotations){
                  bks = this.getBookingsByDate(cellData.dateStr, bookings);
                  qts=[];
            }
            //Date has only quotations.
            else if(!cellData.hasBookings && cellData.hasQuotations){
                  qts = this.getBookingsByDate(cellData.dateStr, quotations);
                  bks=[];
            }
            this.setState({calendarBookings: bks, calendarQuotations: qts, showQuotationsAndBookingsDialog: true});
      }

      getBookingsByDate = (dateStr, bookings) => {
            const bks=[];
            for(let i=0; i<bookings.length; i++){
                  if(Object.keys(bookings[i].allBookingDays).includes(dateStr)){
                        bks.push(bookings[i]);
                  }
            }

            return bks;
      }






      render() {
            const {allQuotations, allQuotationDates, allBookings, allBookingDates} = this.state;
            return(
                  <View style={{flex:1, backgroundColor: '#002D4C'}}>
                        <View style={styles.mainHeader}>
                              <Text style={{color: 'white', fontSize: 22,}}>MISSIONS</Text>
                              <IconButton style={{position: 'absolute', left: 0, top: 3 }} name="keyboard-arrow-left"  size={42} color={'white'} onPress={()=>this.props.navigation.goBack()}  />
                        </View>

                        <View style={{flex: 1, backgroundColor: '#002D4C'}}>
                              {this.state.showCalendar==false &&(
                                    <MissionsList ref={bookingList => {this.bookingList = bookingList}} {...this.props}
                                          bookingTypes={this.state.bookingTypes}
                                          user={this.state.user}
                                          onSendQuoteClicked={(booking)=>{this.setState({selectedBooking: booking, showSendQuoteDialog: true});}}
                                          onViewQuoteClicked={(booking)=>{this.setState({selectedBooking: booking, showViewQuoteDialog: true});}}
                                          onRefuseMissionClicked={(booking)=>{this.setState({selectedBooking: booking, showRefuseMissionDialog: true});}}
                                           />
                              )}

                              {this.state.showCalendar==true &&(
                                    <View style={{ flex:1, width: '100%', marginTop: 10}}>
                                          <OPCalendar ref={cal => {this.calendarView = cal}}
                                                quotations={allQuotations}
                                                quotationDates={allQuotationDates}
                                                bookings={allBookings}
                                                bookingDates={allBookingDates}
                                                onDateClicked={this.onCalendarDateClicked}
                                           />
                                    </View>
                              )}
                        </View>

                        <View style={{ height: 70, justifyContent: 'flex-end', backgroundColor: 'white'}}>
                              <Tabs selected={this.state.page} style={{backgroundColor:'white'}}  selectedStyle={{color:'red'}} onSelect={this.tabChanged}>
                                     <IconText name='offers' key='1'  label={'Appel d\'offre'} icon={'description'} selectedColor={'#002D4C'} textStyles={{fontSize: 11 }} />
                                     <IconText name='quotes' key='2'  label={'Mes devis'} icon={'contact-mail'} selectedColor={'#002D4C'} textStyles={{fontSize: 11} } />
                                     <IconText name='missions' key='3'  label={'Mes missions'} icon={'security'} selectedColor={'#002D4C'} textStyles={{fontSize: 11  }} />
                                     <IconText name='calendar' key='4'  label={'Calendrier'} icon={'date-range'} selectedColor={'#002D4C'} textStyles={{fontSize: 11 }} />
                               </Tabs>
                        </View>


                        {this.state.showQuotationsAndBookingsDialog &&(
                              <View style={[styles.dialogCont, {paddingTop: 30, paddingBottom: 30, paddingLeft: 10, paddingRight: 10}]}>
                                    <AgentMissionsAndQuotes
                                    bookings={this.state.calendarBookings}
                                    quotations={this.state.calendarQuotations}
                                    onClose={()=>this.setState({showQuotationsAndBookingsDialog: false})}
                                    onViewQuoteClicked={(booking)=>{this.setState({selectedBooking: booking, showViewQuoteDialog: true});}}
                                    onRefuseMissionClicked={(booking)=>{this.setState({selectedBooking: booking, showRefuseMissionDialog: true});}}
                                    />
                              </View>
                        )}


                        {this.state.showSendQuoteDialog &&(
                              <View style={styles.dialogCont}>
                                    <SendQuote user={this.state.user} booking={this.state.selectedBooking} onClose={()=>this.setState({showSendQuoteDialog: false})} onQuotationSent={()=>{this.setState({bookingTypes: 2, showSendQuoteDialog: false, page: 'quotes'}); this.bookingList.reload(2);}}/>
                              </View>
                        )}

                        {this.state.showViewQuoteDialog &&(
                              <View style={styles.dialogCont}>
                                    <ViewQuote user={this.state.user} booking={this.state.selectedBooking} onClose={()=>this.setState({showViewQuoteDialog: false})} />
                              </View>
                        )}

                        {this.state.showRefuseMissionDialog &&(
                              <View style={styles.dialogCont}>
                                    <RefuseMission user={this.state.user} booking={this.state.selectedBooking} onClose={()=>this.setState({showRefuseMissionDialog: false, showQuotationsAndBookingsDialog: false})}  onMissionRefused={()=> {this.setState({showRefuseMissionDialog: false}); this.bookingList.reload(this.state.bookingTypes);}}/>
                              </View>
                        )}



                        { this.state.isLoading && (
					<View style={styles.loader}>
					    <ProgressCircle color={'#00AED8'} />
					</View>
				)}

                  </View>
            );
      }
};

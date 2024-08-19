import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import {IconButton, Button, Icon} from 'material-bread';
import styles from '../../.././OProtect.styles.js';

export class OPCalendar extends React.Component {
      static propTypes = {
            onDateClicked: PropTypes.func,
      }


      dayNames = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
      monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      today = new Date();

      constructor(props) {
            super(props);
            this.state = {
                  isLoading: true,
                  activeDate: new Date(),
                  quotations: props.quotations,
                  quotationDates: props.quotationDates,
                  bookings: props.bookings,
                  bookingDates: props.bookingDates,
            };
      }

      updateBookingAndQuotations(bks, bkDates, qts, qtDates){
            this.setState({bookings: bks, bookingDates: bkDates, quotations: qts, quotationDates: qtDates});
      }

      generateMatrix() {
            var matrix = [];
            var year = this.state.activeDate.getFullYear();
            var month = this.state.activeDate.getMonth();
            var firstDay = new Date(year, month, 1).getDay();

            var maxDays = this.nDays[month];
            if (month == 1) { // February
                  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                        maxDays += 1;
                  }
            }

            var day = 1;

            for (var row = 1; row < 7; row++) {
                  matrix[row] = [];
                  for (var col = 0; col < 7; col++) {
                        matrix[row][col] = null;
                        if (row == 1 && col >= firstDay) {
                              // Fill in rows only after the first day of the month
                              //matrix[row][col] = counter++;
                              this._makeCell(matrix, row, col, year, month+1, day);
                              day++;
                        }
                        else if (row > 1 && day <= maxDays) {
                              // Fill in rows only if the counter's not greater than
                              // the number of days in the month
                              //matrix[row][col] = counter++;
                              this._makeCell(matrix, row, col, year, month+1, day);
                              day++;

                        }
                  }
            }

            return matrix;
      }

      _makeCell = (mat, r, c, year, month, day) => {
            let cellData={day: day};
            if(month < 10){month='0'+month;}
            if(day < 10){day='0'+day;}

            const dateStr=year+'-'+month+'-'+day;
            cellData['dateStr']=dateStr;
            if(this.state.quotationDates!=null && this.state.quotationDates.includes(dateStr)){
                  cellData['hasQuotations']=true;
            }

            if(this.state.bookingDates!=null && this.state.bookingDates.includes(dateStr)){
                  cellData['hasBookings']=true;
            }

            mat[r][c] = cellData;
      }

      _onPress = (item) => {
            /*this.setState(() => {
                  if (!item.match && item != -1) {
                        this.state.activeDate.setDate(item);
                        return this.state;
                  }
            });*/

            if(item!=null && (item.hasBookings || item.hasQuotations)){
                  if(this.props.onDateClicked!=null){
                        this.props.onDateClicked(item, this.state.bookings, this.state.quotations);
                  }
            }



      };

      changeMonth = (n) => {
            this.setState(() => {
                  this.state.activeDate.setMonth(
                        this.state.activeDate.getMonth() + n
                  )
                  return this.state;
            });
      }

      render() {
            var matrix = this.generateMatrix();
            var rows = [];
            rows = matrix.map((row, rowIndex) => {
                  var rowItems = row.map((item, colIndex) => {
                        return (
                              <TouchableOpacity style={{alignItems: 'center'}} onPress={() => this._onPress(item)}>
                                    <View style={{borderWidth: (item!=null && item.day == this.state.activeDate.getDate() && this.state.activeDate.getMonth()==this.today.getMonth() && this.state.activeDate.getFullYear() == this.today.getFullYear()) ? 3: 0, borderColor: '#00AED8', borderRadius: 100, width: 38, height: 38}} />
                                    <View style={{position: 'absolute', backgroundColor: (item!=null && item.hasBookings) ? '#73AA73' : '#FFFFFF00', borderRadius: 100, width: 38, height: 38}} />
                                    <Text style={{position: 'absolute',  height: 18, textAlign: 'center', marginTop: 8, color: (item!=null && item.hasBookings) ? '#FFF' : '#000'}}>{item != null ? item.day : ''}</Text>
                                    <View style={{width: 11, height: 11, marginTop: 3, backgroundColor: (item!=null && item.hasQuotations) ? '#00AED8' : 'white', borderRadius: 100,}}/>
                              </TouchableOpacity>
                        );
                  });
                  return (
                        <View
                        style={{
                              flex: 1,
                              flexDirection: 'row',
                              padding: 10,
                              justifyContent: 'space-around',

                        }}>
                        {rowItems}
                        </View>
                  );
            });


            const {allBookings, bookingDates} = this.state;

            return (
                  <View style={styles.calendarCont}>
                        <View style={styles.calendarHeader}>
                              <TouchableOpacity style={styles.calendarNextMonth} type={'flat'} radius={100} onPress={()=> this.changeMonth(-1)}>
                                        <Icon name="arrow-back" size={24} color={'white'}/>
                              </TouchableOpacity>

                              <Text style={styles.calendarMonthTitle}>{this.monthNames[this.state.activeDate.getMonth()]} {this.state.activeDate.getFullYear()}</Text>

                              <TouchableOpacity style={styles.calendarNextMonth} type={'flat'} radius={100} onPress={()=> this.changeMonth(1)}>
                                        <Icon name="arrow-forward" size={24} color={'white'}/>
                              </TouchableOpacity>


                        </View>

                        <View style={styles.calendarDayNamesBar}>
                              {this.dayNames.map((item, index) => {return <Text style={styles.calendarDayName}>{item}</Text>})}
                        </View>
                        <View style={{flex:1,}}>
                              {rows}
                        </View>

                  </View>
            );
      }
}

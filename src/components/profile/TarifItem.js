import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text,TextInput,  View, Alert, Keyboard} from 'react-native';
import {Ripple, Button, IconButton} from 'material-bread';

import styles from '../../.././OProtect.styles.js';

export class TarifItem extends React.Component {
      txtField=null;
      initialText='';
      itemNewData={};

      static propTypes = {
            text: PropTypes.string.isRequired,
            onEditFinish: PropTypes.func,
      }

      constructor(props) {
            super(props);
            this.state = {
                  item: props.item,
                  editable: false,
                  originalItem: {...props.item},
            };

      }

      resetItemNewData = ()=>{
            this.setState({editable: false, item: this.state.originalItem});
      }

      updateNewValues =  () => {
            this.setState({editable: false});
            let newItem=Object.assign({}, this.state.item);
            newItem.mem_uid=this.props.mem_uid;

            if(this.props.onTarifRatesChanged!=undefined){
                  this.props.onTarifRatesChanged(newItem);
            }
      }

      rateChanged = (field, rate) => {
            let newItem=Object.assign({}, this.state.item);
            newItem[field]=rate;
            this.setState({item: newItem});
      }




      render = () => {
            const {item, editable} = this.state;

            return (
                  <View style={styles.tarifCont}>
                        {item && (
                              <View style={{backgroundColor: '#CCCCCC', }}>
                                    <View style={{width: '100%', flex:1, backgroundColor: '#00AED8', padding: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                                          <Text style={[styles.text_primary_color, {color: 'white', fontWeight: 'bold'}]}>{item.gt_title_fr}</Text>
                                          {!editable &&(
                                                <IconButton style={{position: 'absolute', top: 5, right: 10}}  name={'edit'} color={'white'} size={24} onPress={()=> this.setState({editable: true})}/>
                                          )}

                                          {editable &&(
                                                <View style={{flexDirection: 'row', position: 'absolute', top: 5, right: 10}}>

                                                      <IconButton  name={'close'} color={'white'} size={24} onPress={this.resetItemNewData}/>
                                                      <IconButton  name={'done'} color={'white'} size={24} onPress={this.updateNewValues}/>

                                                </View>
                                          )}
                                    </View>

                                    <View style={{marginTop: 10, marginBottom: 10}}>


                                          <View style={styles.quoteRateBox}>
                                               <Text style={{marginTop: 5}}>Jour</Text>
                                               <View style={{flexDirection: 'row'}}>
                                                      <TextInput editable={editable} value={item.prc_day_rate} onChangeText={(val) =>{this.rateChanged('prc_day_rate', val)}} keyboardType='decimal-pad' placeholder='0.00' style={[styles.quoteRateInput, {borderColor: '#777777'}]}/>
                                                      <Text style={styles.quoteRateCurrencyText}>€</Text>
                                               </View>
                                          </View>

                                          <View style={styles.quoteBoxDivider} />
                                          <View style={styles.quoteRateBox}>
                                               <Text style={{marginTop: 5}}>Nuit</Text>
                                               <View style={{flexDirection: 'row'}}>
                                                      <TextInput editable={editable} value={item.prc_night_rate} onChangeText={(val) =>{this.rateChanged('prc_night_rate', val)}} keyboardType='decimal-pad' placeholder='0.00' style={[styles.quoteRateInput, {borderColor: '#777777'}]}/>
                                                      <Text style={styles.quoteRateCurrencyText}>€</Text>
                                               </View>
                                          </View>

                                          <View style={styles.quoteBoxDivider} />
                                          <View style={styles.quoteRateBox}>
                                               <Text style={{marginTop: 5}}>Dimanche jour</Text>
                                               <View style={{flexDirection: 'row'}}>
                                                      <TextInput editable={editable} value={item.prc_sunday_rate} onChangeText={(val) =>{this.rateChanged('prc_sunday_rate', val)}} keyboardType='decimal-pad' placeholder='0.00' style={[styles.quoteRateInput, {borderColor: '#777777'}]}/>
                                                      <Text style={styles.quoteRateCurrencyText}>€</Text>
                                               </View>
                                          </View>
                                          <View style={styles.quoteBoxDivider} />
                                          <View style={styles.quoteRateBox}>
                                               <Text style={{marginTop: 5}}>Dimanche nuit</Text>
                                               <View style={{flexDirection: 'row'}}>
                                                      <TextInput editable={editable} value={item.prc_sunday_night_rate} onChangeText={(val) =>{this.rateChanged('prc_sunday_night_rate', val)}} keyboardType='decimal-pad' placeholder='0.00' style={[styles.quoteRateInput, {borderColor: '#777777'}]}/>
                                                      <Text style={styles.quoteRateCurrencyText}>€</Text>
                                               </View>
                                          </View>

                                          <View style={styles.quoteBoxDivider} />
                                          <View style={styles.quoteRateBox}>
                                               <Text style={{marginTop: 5}}>Jours fériés</Text>
                                               <View style={{flexDirection: 'row'}}>
                                                      <TextInput editable={editable} value={item.prc_holiday_rate} onChangeText={(val) =>{this.rateChanged('prc_holiday_rate', val)}} keyboardType='decimal-pad' placeholder='0.00' style={[styles.quoteRateInput, {borderColor: '#777777'}]}/>
                                                      <Text style={styles.quoteRateCurrencyText}>€</Text>
                                               </View>
                                          </View>
                                    </View>
                              </View>
                        )}
                  </View>
            );
      }
}

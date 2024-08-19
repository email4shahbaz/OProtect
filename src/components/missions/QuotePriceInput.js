import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, View,} from 'react-native';

import styles from '../../.././OProtect.styles.js';


export class QuotePriceInput extends React.Component {
      static propTypes = {
            label: PropTypes.string.isRequired,
            value: PropTypes.number,
            onRateChanged: PropTypes.func,
            editable: PropTypes.bool,
      }

      constructor(props) {
            super(props);
            this.state = {
                  isEmpty: true,
            };
      }

      render() {
            const{isEmpty} = this.state;
            return(
                  <View style={styles.quoteRateBox}>
                       <Text style={{marginTop: 5}}>{this.props.label}</Text>
                       <View style={{flexDirection: 'row'}}>
                              <TextInput editable={this.props.editable} value={this.props.value} onChangeText={(val) =>{this.props.onRateChanged(val); this.setState({isEmpty: val=='' ? true: false})}} keyboardType='decimal-pad' placeholder='0.00' style={styles.quoteRateInput}/>
                              <Text style={styles.quoteRateCurrencyText}>€</Text>
                       </View>
                  </View>
            );
      }

};

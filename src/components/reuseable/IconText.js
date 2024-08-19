import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Ripple, Icon} from 'material-bread';


export class IconText extends React.Component {
      static propTypes = {
            label: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
            selectedColor: PropTypes.string.isRequired,


            textStyles: PropTypes.oneOfType([
                  PropTypes.array,
                  PropTypes.number,
                  PropTypes.shape({}),
            ]).isRequired,
      }


      render = () => {
            const { label, icon, selectedColor, textStyles, selected} = this.props;


            return (
                  <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 8, borderBottomColor: selected ? '#00AED8': '#FFFFFF'}}>
                        <Icon name={icon} size={(icon=='' ? 0: 28)} color={selected ? selectedColor: '#777777'} />
                        <Text style={[textStyles, {color: selected ? selectedColor: '#777777', marginBottom: 10}]}>{label}</Text>
                  </View>
            );
      }
}

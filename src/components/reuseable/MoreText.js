import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Button} from 'material-bread';


export class MoreText extends React.Component {
      constructor(props) {
            super(props);
            this.state = {
                  expanded: false,
                  moreLabel: 'plus...',
            };

      }


      static propTypes = {
            text: PropTypes.string.isRequired,
            textStyles: PropTypes.oneOfType([
                  PropTypes.array,
                  PropTypes.number,
                  PropTypes.shape({}),
            ]).isRequired,
      }

      moreClicked = ()=>{
            this.setState({expanded: !this.state.expanded, moreLabel: this.state.expanded ? 'plus...': 'moins...'});
      }


      render = () => {
            const { text, textStyles} = this.props;

            return (
                  <View>
                        <View>
                              <Text style={textStyles} numberOfLines={this.state.expanded ? 0:1}>{text}</Text>
                        </View>

                        {text!=null && text.length > 30 &&(
                              <View style={styles.MoreCont}>
                                    <Button onPress={()=> this.moreClicked()}  type="text" text={this.state.moreLabel} style={styles.btnMore} useInputCasing={true} />
                              </View>
                        )}
                  </View>
            );
      }
}


const styles = StyleSheet.create({
      MoreCont:{flex:1, width: '100%', alignItems: 'flex-end'},
      btnMore:{color: 'blue'},
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';


class DrawerHeader extends React.Component {

  handleOnIconClick=()=> {
    if(this.props.onIconClick!=null){
        this.props.onIconClick();
    }
  }

  render() {
    return (
      <View style={styles.header}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.trigger} onPress={this.handleOnIconClick}>
              {this.props.iconType=='hamburger' && (
                  <Image Image style={styles.icon}
                    source={require('../.././images/icon_drawer.png')}
                  />
              )}

              {this.props.iconType=='back' && (
                  <Image style={styles.icon}
                    source={require('../.././images/icon_drawer_back.png')}
                  />
              )}
              </TouchableOpacity>

              <Text style={styles.headerTitle}>{this.props.title}</Text>
              </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  header: {
    paddingTop: 5,
    paddingLeft: 10,
    height: 40,
    backgroundColor: '#092C73'
  },

  container:{
    flexDirection: 'row',
  },

  icon:{
    width: 28,
    height: 28,
  },

  headerTitle:{
    paddingLeft: 20,
    fontSize: 18,
    color: 'white',
  }


});

export default DrawerHeader;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import { ListItem} from 'react-native-elements';
import {Searchfield, Icon} from 'material-bread';


export default class SearchList extends React.Component {
     filteredData = [];

     constructor(props) {
       super(props);
      //Alert.alert("Hello", this.props.route.params.type);
       this.state = {
              items: this.props.data,
              value: "",
              isLoading: false,
        };
        this.filteredData=this.props.data;

     }

     searchFilterFunction = (text) => {
        this.setState({
            value: text,
        });

        const newData = this.filteredData.filter(item => {
            const itemData = item[this.props.searchField].toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
      });

      this.setState({
        items: newData,
      });
    };


  renderItem = ({item}) => {
    return (
      <TouchableOpacity >
        <View style={styles.row}>
          <Icon name="location-arrow" size={12} type="font-awesome" reverse  color="#4F8EF7" />
          <Text style={styles.nameTxt}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
      return(
        <View style={{ flex: 1 }}>


                <Searchfield
                    color={'#FFC21A'}
                    value={this.state.value}
                    style={{borderRadius: 10, height: 50}}
                    onChangeText={text => this.searchFilterFunction(text)}
                    onCloseIcon={() => this.setState({value: ''})}

                  />

              <FlatList
                data={this.state.items}
                renderItem={this.props.renderItem ? this.props.renderItem : this.renderItem}
                keyExtractor={item => item.id}

              />
        </View>

        )
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DCDCDC',
    },
    row: {
      padding:8,
      marginTop:1,
      marginBottom:1,
      backgroundColor: 'white',
      flexDirection: 'row',
    },


  });

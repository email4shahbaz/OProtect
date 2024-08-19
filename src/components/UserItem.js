/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React from 'react';
 import {
    StyleSheet,
    Text,
    View,
    Alert,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Button,


} from 'react-native';


export class UserItem extends React.Component {
     constructor(props) {
       super(props);
       this.state = {
            user: props.user,
          };

    }

  render() {
     return(
           <View>
            <Text style={styles.todoText}>{this.state.user.email}}</Text>
          </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#afafaf',
    width: '80%',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 20,
    fontSize: 20,
  },
  todoItem: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  todoText: {
    borderColor: '#afafaf',
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    minWidth: '50%',
    textAlign: 'center',
  },
});

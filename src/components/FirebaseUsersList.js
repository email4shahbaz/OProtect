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
    FlatList,
    Button,


} from 'react-native';


import {db} from '../././config';

import {UserItem} from '.././components/UserItem';
import UserModel from '.././models/UserModel';





export class UsersList extends React.Component {
     constructor(props) {
       super(props);

      //Alert.alert("Hello", this.props.route.params.type);


       this.state = {
            users: {},
            userEmail: 'email4shahbaz@gmail.com',
            userFName: 'Shahbaz',
            userLName: 'Ali',
          };
     }

     componentDidMount() {


       db.ref('/users').on('value', querySnapShot => {
             let data = querySnapShot.val() ? querySnapShot.val() : {};
             let users = {...data};
             this.setState({
               users: users,
             });
           });
     }

     addNewUser() {
        db.ref('/users').push({
          email: this.state.userEmail,
          first_name: this.state.userFName,
          last_name: this.state.userLName,
        });
        Alert.alert('Action!', 'A new user was created');

      }

      logOut = () =>{
        Alert.alert("Hi", "Hello");
      }


      render() {

    let userKeys = Object.keys(this.state.users);

     return(

       <ScrollView
         style={styles.container}
         contentContainerStyle={styles.contentContainerStyle}>

         <Button title="Logout"
         color="green"
         onPress={this.logOut}/>

         <TextInput
           placeholder="Enter Email"
           value={this.state.userEmail}
           style={styles.textInput}
           onChangeText={e => {
             this.setState({
               userEmail: e,
             });

           }}

         />
         <TextInput
           placeholder="Enter First Name"
           value={this.state.userFName}
           style={styles.textInput}
           onChangeText={e => {
             this.setState({
               userFName: e,
             });
           }}

         />

         <TextInput
           placeholder="Enter Last Name"
           value={this.state.userLName}
           style={styles.textInput}
           onChangeText={e => {
             this.setState({
               userLName: e,
             });
           }}

         />


         <Button
           title="Add new To do item"
           onPress={this.addNewUser.bind(this)}
           color="lightgreen"
         />

         <View>
            {userKeys.length > 0 ? (
              userKeys.map(key => (
                <UserItem user={this.state.users[key]}  />
              ))
            ) : (
                  <Text>No todo item</Text>
            )}
          </View>
       </ScrollView>


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
    marginVertical: 5,
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

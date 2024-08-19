/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View, Alert, Image, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Button, FlatList, Modal, Platform, PermissionsAndroid} from 'react-native';
import {Ripple, ProgressCircle, Appbar} from 'material-bread';

import UserModel from '../.././models/UserModel';
import LinearGradient from 'react-native-linear-gradient';
import styles from './../../../OProtect.styles.js';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

export class DeliveryLists extends React.Component {
    loggedInUser=null;
     constructor(props) {
       super(props);
      //Alert.alert("Hello", this.props.route.params.type);
       this.state = {
              deliveryLists: [],
              isLoading: false,
              creatingPDF: false,
              user: null,
              selectedList: null,


        };
     }

      async componentDidMount() {
          this._unsubscribe = this.props.navigation.addListener('focus', () => {
                this.checkUserLogin();
          });
      }

      componentWillUnmount() {
        this._unsubscribe();
      }

     checkUserLogin() {
         if(this.loggedInUser==null){
           UserModel.require(UserModel);
           UserModel.restore().then((userModel) => {
                 //User already exists in local storage
                 if (userModel!== null) {
                      this.loggedInUser = userModel;
                      this.setState({user: userModel});
                      this.loadDeliveryLists();
                 }
             }).catch((error) => {
             });
         }
         else{
               this.loadDeliveryLists();
         }
     };


     loadDeliveryLists=()=>{

           this.setState({isLoading: true})
           var d = new Date();
            var today = [
              d.getFullYear(),
              ('0' + (d.getMonth() + 1)).slice(-2),
              ('0' + d.getDate()).slice(-2)
            ].join('-');

            //Alert.alert(date);

            fetch('http://www.helpline-app.com/api/index.php?action=get_delivery_list&mem_uid='+this.loggedInUser.getMem_uid()+'&dl_date='+today ,{
                  method: 'get',
            }).
            then(response => {
                  return response.json();
            }).then(this.deliveriesListLoaded)
            .finally(() => {
                  this.setState({ isLoading: false });
            });

     }

     deliveriesListLoaded = (result) => {
           if (result.status=== '1'){
                this.setState({deliveryLists: result.data});
           }
           else{
                 Alert.alert("Signin Failed", result.message);
           }

     }


     deliveryListClicked = (item) =>{
           this.props.navigation.navigate("deliveryList", {delivery: item});
           //Alert.alert("delivery", item.dl_title);
     }



     askPermission() {
         var that = this;
         async function requestExternalWritePermission() {
           try {
             const granted = await PermissionsAndroid.request(
               PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
               {
                 title: 'OProtect App External Storage Write Permission',
                 message:
                   'OProtect App needs access to Storage data in your SD Card ',
               }
             );
             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
               //If WRITE_EXTERNAL_STORAGE Permission is granted
               //changing the state to show Create PDF option
               that.createPDF();
             } else {
               alert('WRITE_EXTERNAL_STORAGE permission denied');
             }
           } catch (err) {
             alert('Write permission err', err);
             console.warn(err);
           }
         }
         //Calling the External Write permission function
         if (Platform.OS === 'android') {
               requestExternalWritePermission();
         } else {
           this.createPDF();
         }
        }

       async createPDF() {
             this.setState({creatingPDF: true});
             const {
               user,
               selectedList,
             } = this.state;

             let html = `<div style="padding: 50px; margin: 50px;">
             <div style="text-align: center; width: 100%; padding: 30px; font-weight: 'bold';  font-size: 120px;">Delivery List</div>
             <div style="text-align: center; width: 100%; padding: 30px; font-size: 80px; background-color: #237DE3;">${user.getUser_full_name()}-${selectedList.dl_date}</div>
             `;


             let list = selectedList.list.data;
             let records = `<table style="border-spacing: 0; width: 100%, border: 1px solid black;margin-top: 50px;">
                            <tr style="width: 100%; font-size: 40px;">
                              <th>Sr. #</th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>ID Card #</th>
                              <th>Area</th>
                              <th>Address</th>
                              <th>Status</th>
                         </tr>`;


             for (let i = 0; i < list.length; i++) {
                  records+=` <tr style="width: 100%; font-size: 36px;">
                                    <td style="padding: 20px;  border: 1px solid black; width: 4%; text-align: center;">${(i+1)}</td>
                                    <td style="padding: 20px;  border: 1px solid black; width: 30%;">${list[i].donee_name}</td>
                                    <td style="padding: 20px;  border: 1px solid black; width: 10%;">${list[i].donee_phone}</td>
                                    <td style="padding: 20px;  border: 1px solid black; width: 15%; text-align: center;">${list[i].donee_cnic}</td>
                                    <td style="padding: 20px;  border: 1px solid black; width: 10%; text-align: center;">${list[i].donee_area}</td>
                                    <td style="padding: 20px;  border: 1px solid black; width: 20%;">${list[i].donee_address}</td>
                                    <td style="padding: 20px;  border: 1px solid black; width: 12%; text-align: center; background-color: ${list[i].dstatus_id=='3' && ('#FFA500') || list[i].dstatus_id=='4' && ('#1B6D1B') || list[i].dstatus_id=='5' && ('#FF0000')}">${list[i].dstatus_name}</td>
                            </tr>
                        `;
              }

              html=html+records+"</table></div>";

              //console.log(html);
              //return;



         let timestamp=new Date().getTime();

         const options = {
           //Content to print
           html,
           //File Name
           fileName: this.loggedInUser.getUser_full_name()+" ("+this.state.selectedList.dl_date+") "+ timestamp,
           //File directory
           directory: 'docs',
           width: 2480,
           height: 3508,
         };
         let file = await RNHTMLtoPDF.convert(options);

         this.setState({creatingPDF: false});
//         console.log(file.filePath);
         //alert("PDF file created at: "+file.filePath);
         Share.open({
             title: "My Delivery List!",
             message: "See my delivery list attached:",
             url: `file://${file.filePath}`,
             subject: `Delivery List (${this.state.selectedList.dl_date}) from ${this.loggedInUser.getUser_full_name()}`,
           });

       }




     renderItem = ({item}) => {
          return (

                <View>
                      <Ripple onPress={()=>{this.deliveryListClicked(item)}}>
                              <View style={styles.dlists_box}>
                                    <View>
                                          <Image style={{width: 48, height: 48, marginRight: 20, }} source={require("../.././images/icon_delivery.png")} />
                                    </View>
                                    <View style={styles.dlists_boxContent}>
                                        <Text style={styles.dlists_date}>{item.dl_date}</Text>
                                        <Text style={styles.dlists_title}>{item.dl_title}</Text>
                                    </View>
                                    <Text style={item.dl_completed_rec==0 && (styles.dlists_started) || item.dl_completed_rec==item.dl_total_rec && (styles.dlists_completed) ||  item.dl_completed_rec > 0 && (styles.dlists_half)}>{item.dl_completed_rec}/{item.dl_total_rec}</Text>
                              </View>
                        </Ripple>

                        <TouchableOpacity style={{position: 'absolute', right: 10, top: 50}} onPress={()=>{this.setState({selectedList: item}); this.askPermission()}}>
                              <Image style={{width: 36, height: 36, marginTop: 10,}} source={require("../.././images/icon_pdf.png")} />
                        </TouchableOpacity>

                </View>
          );
    }

    toggleDrawer = () => {
         this.props.navigation.openDrawer();//this.props.navigationProps.toggleDrawer();
    };


    render() {
      const { modalVisible, phoneNumber} = this.state;
        return(
            <LinearGradient colors={['#172169', '#2693FF', '#2693FF']} style={styles.container}>
                  <Appbar  barType={'normal'} title={'My Delivery Lists'} navigation={'arrow-back'} color={'#092C73'} onNavigation={()=>this.props.navigation.goBack()}    />


                        { this.state.isLoading===false && (
                            <View style={{ flex: 1, padding: 10 }} >
                              <FlatList
                                extraData={this.state}
                                data={this.state.deliveryLists}
                                keyExtractor = {(list) => {
                                   return list.dl_id;
                                }}
                                renderItem={this.renderItem}/>
                            </View>
                            )}


                      { this.state.isLoading===true && (
                          <View style={styles.loader}>
                              <ProgressCircle color={'#E91E63'} />
                          </View>
                      )}

                      { this.state.creatingPDF===true && (
                        <View style={styles.loader}>
                             <ProgressCircle color={'#E91E63'} />
                        </View>
                    )}
            </LinearGradient>
    );
  }
};

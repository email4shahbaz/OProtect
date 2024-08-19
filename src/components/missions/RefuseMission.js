import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {TextField, Select, Button, IconButton, BodyText, ProgressCircle} from 'material-bread';

import UserModel from '../.././models/UserModel';
import styles from '../../.././OProtect.styles.js';


export class RefuseMission extends React.Component {
      static propTypes = {
            booking: PropTypes.object.isRequired,
            onClose: PropTypes.func,
            onMissionRefused: PropTypes.func,
      }

      constructor(props) {
            super(props);
            this.state = {
                  user: props.user,
                  booking: props.booking,
                  isLoading: false,
                  refuseReasonId: 0,
                  refuseReasons: [],
            };
      }

      componentDidMount(){
            this.loadRefuseReasons();
      }

      loadRefuseReasons = async () => {
		 // validationResult is undefined if there are no errors
		try{
			this.setState({isLoading: true})
			fetch("https://www.oprotect.com/api/index.php?action=getCancelReasonLov", {
			    method: 'get',
			}).then(function(response) {
			    return response.json();
		    }).then(this.onRefuseReasonsLoaded)
			.finally(() => {
	                  this.setState({ isLoading: false });
	            });
		}
	    	catch (error) {
			Alert.alert("Error", "Error loading refuse reasons");
                  this.setState({ isLoading: false });
	    	}
     }

	onRefuseReasonsLoaded = (result) => {
            this.setState({ isLoading: false });
		if (result.status=== '1'){
			if(result.data){
                        let reasons=[];
                        for(let i=0; i<result.data.length; i++){
                              reasons.push({id: result.data[i].cr_id, name: result.data[i].cr_title});
                        }
                        this.setState({refuseReasons: reasons, selectedRefuseReason: reasons[0].name, refuseReasonId: reasons[0].id});

                  }
		}
		else{
			Alert.alert("Error", result.message);
		}
	}



      refuseMission = async () => {
            try{
                  this.setState({isLoading: true})
                  let params={mem_uid: this.state.user.mem_uid, customer_id: this.state.booking.mem_uid, prebooking_id: this.state.booking.booking_id, cr_id: this.state.refuseReasonId};

                  fetch('https://www.oprotect.com/api/index.php?action=refuse_booking', {
                      method: 'post',
                      body: JSON.stringify(params),
                  }).then(function(response) {
                      return response.json();
               }).then(this.onMissionRefused)
                  .finally(() => {
                        this.setState({ isLoading: false });
                  });
            }
            catch (error) {
                  Alert.alert("Error", "Error calling refuse mission");
                  console.error(error);
            }
     }

	onMissionRefused = (result) => {
            this.setState({ isLoading: false });
		if (result.status=== '1'){
                  this.props.onMissionRefused();
		}
		else{
			Alert.alert("Error", result.message);
		}
	}



      render() {
            const{booking, isLoading, estimateLoaded, newEstimate} = this.state;
            return(
                  <View style={{width: '100%', backgroundColor: 'white', borderRadius: 8, marginTop: 50}}>
                        <IconButton name="close" size={24} style={{alignSelf: 'flex-end'}} onPress={()=>{this.props.onClose()}}/>
                        <View style={{marginTop: -10}}>
                              <Text style={{fontSize: 18, paddingLeft: 10, paddingRight: 30,}}>Vous êtes sur le point de refuser la réservation?</Text>
                              <View style={{width: '100%', padding: 10,}}>
                                    <Select
                                           type={'outlined'}
                                           label={'Motif de refus'}
                                           menuItems={this.state.refuseReasons}
                                           onSelect={value => this.setState({ selectedRefuseReason: value.name, refuseReasonId: value.id })}
                                           selectedItem={this.state.selectedRefuseReason}
                                         />
                              </View>

                              <View style={{width: '100%', padding: 10,}}>
                                    <Button fullWidth text={'Suivant'} color={'#3d77b5'} type="flat" useInputCasing={true} textStyle={{fontSize: 18,}} radius={8} onPress={()=>{this.refuseMission()}}  />
                              </View>

                        </View>


				{ this.state.isLoading && (
					<View style={styles.loader}>
					    <ProgressCircle color={'#E91E63'} />
					</View>
				)}
                  </View>
            );
      }

};

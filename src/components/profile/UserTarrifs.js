import React, {useEffect, useCallback, useState} from 'react';
import {StyleSheet, FlatList, Text, View, Image, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import {IconButton, Dialog, BodyText, Icon, Heading, Subtitle, Button, ProgressCircle} from 'material-bread';
import Tabs from 'react-native-tabs';

import UserModel from '../.././models/UserModel';
import {TarifItem} from './TarifItem';
import {EditableTextInput} from '../reuseable/EditableTextInput';
import BankForm from './BankForm';



import styles from '../../.././OProtect.styles.js';

//To use store's state and actions in this component
import {useDispatch, useSelector} from 'react-redux';
import {loadAgentTarrif, saveTarifRates} from '../../../src/store/appstate';



const UserTarrifs = () =>{

      const dispatch = useDispatch();
      const appstate = useSelector(state=>state.appstate);

      const [showBankForm, setShowBankForm] = useState(false);

      //Component didMount
      useEffect(() => {
            dispatch(loadAgentTarrif(appstate.user.mem_uid));
      }, [dispatch])


      return(
            <View style={{flex:1, backgroundColor: 'white', margin: 15, borderRadius: 10}}>
                  {appstate.agentTarrifs && (
                        <FlatList

                          data={appstate.agentTarrifs}
                          keyExtractor = {(list) => {
                             return list.prc_id;
                          }}
                          renderItem={(item)=>{return (<TarifItem item={item.item} mem_uid={appstate.user.mem_uid} onTarifRatesChanged={(item)=>dispatch(saveTarifRates(item))} />);}}/>
                  )}

            </View>
      );
}

export default UserTarrifs;

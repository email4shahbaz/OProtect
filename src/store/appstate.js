import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Alert, AsyncStorage} from 'react-native';






export const login = ({ username, password }) => async dispatch => {
      try {
            // const res = await api.post('/api/auth/login/', { username, password })
            dispatch(loginSuccess({username}));
      } catch (e) {
            return console.error(e.message);
      }
}
export const logout = () => async dispatch => {
      try {
            // const res = await api.post('/api/auth/logout/')
            return dispatch(logoutSuccess())
      } catch (e) {
            return console.error(e.message);
      }
}


export const updateUser = (data) => async dispatch => {
      try {
            return dispatch(userUpdated(data));
      } catch (e) {
            return console.error(e.message);
      }
}

export const changeUserDetails = (data) => async dispatch => {
      //Alert.alert(data.payload);
      try {
            return dispatch(userDetailChanged(data));
      } catch (e) {
            return console.error(e.message);
      }
}


export const saveUserData = (userData) => async () => {
      try {
          await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
      catch (error) {
        // Error saving data
      }
}

export const readUserData = () =>async (dispatch, getState) => {
  try {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
        // We have data!!
        // Alert.alert(value);
        dispatch(userDataFound(JSON.parse(value)));
    }
  } catch (error) {
    // Error retrieving data
  }
};


export const loadUserDetails = (mem_uid) => async (dispatch, getState) => {
      dispatch(loading(true));

      try{
            fetch(`https://www.oprotect.com/api/index.php?action=get_user_profile&mem_uid=${mem_uid}`, {
                  method: 'get',
            }).then(function(response) {
                  return response.json();
            }).then(function(result){
                  dispatch(loading(false));
                  if (result.status=== '1' && result.data){

                         dispatch(saveUserData(result.data));
                         dispatch(userUpdated(result.data));


                        /*UserModel.require(UserModel);
                        //result.data.logged_in=true;
                        let userModel = new UserModel();
                        //userModel.populateFromState(result.data);
                        //userModel.setLogged_in(true);
                        userModel.store("UserModel").then(() => {
                            Alert.alert("Saved");
                              //dispatch(loading(false));
                             // dispatch(userUpdated(userModel));
                        }).catch((error) => {
                              //dispatch(loading(false));
                              Alert.alert("Error Storage", "User details could not be saved in local db.");
                        });*/
                  }
            });
      }
      catch (error) {
            dispatch(loading(false));
            Alert.alert("Error", "Error loading user details");
      }
}


export const loadUserDocuments = (mem_uid) => async (dispatch, getState) => {
      dispatch(loading(true));

      try{
            fetch(`https://www.oprotect.com/api/index.php?action=get_user_documents&mem_uid=${mem_uid}`, {
                  method: 'get',
            }).then(function(response) {
                  return response.json();
            }).then(function(result){
                  dispatch(loading(false));
                  if (result.status=== '1' && result.data){
                        dispatch(userDocumentsLoaded(result.data));
                  }
            });
      }
      catch (error) {
            dispatch(loading(false));
            Alert.alert("Error", "Error loading user documents");
      }
}

export const loadAgentTarrif = (mem_uid) => async (dispatch, getState) => {
      dispatch(loading(true));

      try{
            fetch(`https://www.oprotect.com/api/index.php?action=getAgentRates&mem_uid=${mem_uid}`, {
                  method: 'get',
            }).then(function(response) {
                  return response.json();
            }).then(function(result){
                  dispatch(loading(false));
                  if (result.status=== '1' && result.data){
                        dispatch(agentTarifLoaded(result.data));
                  }
            });
      }
      catch (error) {
            dispatch(loading(false));
            Alert.alert("Error", "Error loading user documents");
      }
}


export const saveUserDetails = (obj) => async (dispatch, getState) => {
      dispatch(loading(true));
      try{
            const user = Object.assign({}, getState().appstate.user);
            user[obj.field]=obj.value;

            fetch(`https://www.oprotect.com/api/index.php?action=update_profile`, {
                  method: 'post',
                  body: JSON.stringify({data: user}),
            }).then(function(response) {
                  try{
                        let json=response.json();
                        return json;
                  }

                  catch(err){
                        dispatch(loading(false));
                        Alert.alert(err.toString());
                  }
            }).then(function(result){
                  dispatch(loading(false));

                  if (result.status=== '1'){
                          dispatch(saveUserData(user));
                          dispatch(userUpdated(user));
                  }
            });
      }
      catch (error) {
            dispatch(loading(false));
            Alert.alert("Error", "Error loading saving user details");
      }
}


export const saveBankDetails = (obj) => async (dispatch, getState) => {
      dispatch(loading(true));
      try{
            fetch(`https://www.oprotect.com/api/index.php?action=add_update_bank_details`, {
                  method: 'post',
                  body: JSON.stringify(obj),
            }).then(function(response) {
                  try{
                        let json=response.json();
                        return json;
                  }

                  catch(err){
                        dispatch(loading(false));
                        Alert.alert(err.toString());
                  }
            }).then(function(result){
                  dispatch(loading(false));
                  if (result.status=== '1'){
                        Alert.alert("Success", "Bank Details Updated");
                  }
                  else{
                        Alert.alert("Failed", result.message);
                  }
            });
      }
      catch (error) {
            dispatch(loading(false));
            Alert.alert("Error", "Error loading saving user details");
      }
}

export const saveTarifRates = (obj) => async (dispatch, getState) => {
      dispatch(loading(true));
      try{
            fetch(`https://www.oprotect.com/api/index.php?action=updateAgentRates`, {
                  method: 'post',
                  body: JSON.stringify(obj),
            }).then(function(response) {
                  try{
                        let json=response.json();
                        return json;
                  }

                  catch(err){
                        dispatch(loading(false));
                        Alert.alert(err.toString());
                  }
            }).then(function(result){
                  dispatch(loading(false));
                  if (result.status=== '1'){
                        Alert.alert("Success", "Tarif Rates Updated");
                  }
                  else{
                        Alert.alert("Failed", result.message);
                  }
            });
      }
      catch (error) {
            dispatch(loading(false));
            Alert.alert("Error", "Error loading saving user details");
      }
}

export const requestImagePicker = (data) => async dispatch => {
      try {
            return dispatch(imagePickerRequested(data));
      } catch (e) {
            return console.error(e.message);
      }
}

export const requestDocumentPicker = (data) => async dispatch => {
      try {
            return dispatch(documentPickerRequested(data));
      } catch (e) {
            return console.error(e.message);
      }
}

export const requestAddressPicker = (data) => async dispatch => {
      try {
            return dispatch(addressPickerRequested(data));
      } catch (e) {
            return console.error(e.message);
      }
}


export const requestCreatePdf = (data) => async dispatch => {
      try {
            return dispatch(createPdfRequested(data));
      } catch (e) {
            return console.error(e.message);
      }
}


export const uploadImage = (data) => async dispatch => {
      dispatch(loading(true));
      try{
                var body = new FormData();
                body.append('file', {
                       uri: data.uri, // your file path string
                       name: 'my_photo.jpg',
                       type: data.fileType,
                 });

                 body.append('mem_uid', data.mem_uid);

                 if(data.type=='cmp_logo'){
                       body.append('logo', '1');
                       body.append('cmp_id', data.cmp_id);
                 }


                 fetch("https://www.oprotect.com/api/index.php?action=uploadPhoto",{
                        method: 'POST',
                        headers:{'Accept': 'application/json', "Content-Type": "multipart/form-data", },
                        body : body,
                   })

                   .then(function (response) {
                        try{
                             let json=response.json();
                             return json;
                        }

                        catch(err){
                             dispatch(loading(false));
                             Alert.alert(err.toString());
                        }
                   }).then(function(result){
                         dispatch(loading(false));
                         if (result.status=== '1'){
                               if(result.mem_img_th!=undefined){
                                    dispatch(imageUploaded({type: data.type, url: result.mem_img_th}));
                               }
                         }
                   })
                  .catch(function (error) {
                        console.log(error.response)
                  });
      }
      catch (error) {
            dispatch(loading(false));
            Alert.alert("Error", "Error uploading Image");
      }
}


export const uploadDocument = (data) => async dispatch => {
      dispatch(loading(true));
      try{
                var body = new FormData();
                body.append('mem_uid', data.mem_uid);
                body.append('ud_id', data.ud_id);

                body.append(data.type, {
                       uri: data.uri, // your file path string
                       name: data.mem_uid+'_'+data.type,
                       type: data.fileType,
                 });


                 fetch("https://www.oprotect.com/api/index.php?action=add_update_documents",{
                        method: 'POST',
                        headers:{'Accept': 'application/json', "Content-Type": "multipart/form-data", },
                        body : body,
                   })

                   .then(function (response) {
                        try{
                             let json=response.json();
                             return json;
                        }

                        catch(err){
                             dispatch(loading(false));
                             Alert.alert(err.toString());
                        }
                   }).then(function(result){
                         dispatch(loading(false));
                         if (result.status=== '1'){
                              dispatch(loadUserDocuments(data.mem_uid));
                         }
                   })
                  .catch(function (error) {
                        console.log(error);
                        console.log(error.response)
                  });
      }
      catch (error) {
            dispatch(loading(false));
            Alert.alert("Error", "Error uploading Image");
      }
}







// Slice
const slice = createSlice({
      name: 'appstate',
      initialState: {
            userDetailsLoaded: false,
            user: {},
            userDocuments: [],
            userDocId: 0,
            loading: false,
            imagePickerRequested: false,
            documentPickerRequested: false,
            imagePickerType: '',
            documentType: '',

            addressPickerRequested: false,
            addressPickerType: '',
            agentTarrifs: null,

            createPdfRequested: false,
      },
      reducers: {

            loading: (state, action) =>{
                  state.loading = action.payload;
            },

            loginSuccess: (state, action) => {
                  state.user = action.payload;
            },
            logoutSuccess: (state, action) =>  {
                  state.user = null;
            },

            userDataFound: (state, action) => {
                state.user = action.payload;
            },

            userUpdated: (state, action) => {
                  let newUser=action.payload;
                  newUser['logged_in']=true;
                  state.user=newUser;
                  state.userDetailsLoaded = true;

                  //Alert.alert(state.userDetailsLoaded ? "Yes": "No");
            },

            userDetailChanged: (state, action) => {
                  let user=state.user;
                  let newUser=Object.assign({}, user);

                  let field = action.payload.field;
                  newUser[field]=action.payload.value;
                  state.user=newUser;
            },

            imagePickerRequested: (state, action) => {
                  state.imagePickerType = action.payload.type;
                  state.imagePickerRequested = action.payload.value;
            },

            documentPickerRequested: (state, action) => {
                  state.documentType = action.payload.type;
                  state.documentPickerRequested = action.payload.value;
            },

            addressPickerRequested: (state, action) => {
                  state.addressPickerRequested = action.payload.value;
                  state.addressPickerType = action.payload.type;
            },
            imageUploaded: (state, action) => {
                  let user=state.user;
                  let newUser=Object.assign({}, user);;
                  if(action.payload.type=='profile'){
                        newUser.mem_photo = action.payload.url;
                  }
                  else if(action.payload.type=='cmp_logo'){
                        newUser.cmp_logo = action.payload.url;
                  }
                state.user=newUser;
            },

            userDocumentsLoaded: (state, action) =>{
                  state.userDocuments = action.payload[0];
                  state.userDocId = action.payload[0].ud_id;
            },

            agentTarifLoaded: (state, action) =>{
                  state.agentTarrifs = action.payload;
            },

            createPdfRequested: (state, action) =>{
                  state.documentType = action.payload.type;
                  state.createPdfRequested = action.payload.value;
            }
      },
});
export default slice.reducer;

// Actions
const { loading, loginSuccess, logoutSuccess, userDataFound, userUpdated, userDetailChanged, imagePickerRequested, documentPickerRequested, imageUploaded, addressPickerRequested, userDocumentsLoaded, agentTarifLoaded, createPdfRequested} = slice.actions;

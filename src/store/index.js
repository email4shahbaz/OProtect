import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {combineReducers}  from 'redux';
import appstate from './appstate';

const reducer = combineReducers({appstate,});
const store = configureStore({reducer,
      middleware: getDefaultMiddleware({
          serializableCheck: {
            // Ignore these action types
            ignoredActions: ['appstate/agentTarifLoaded', 'appstate/userDocumentsLoaded', 'appstate/addressPickerRequested', 'appstate/imagePickerRequested', 'appstate/imageUploaded', 'appstate/loading', 'appstate/userDetailChanged', 'appstate/userUpdated', 'appstate/getUserDetails/pending', 'appstate/getUserDetails/fulfilled', 'appstate/saveUserDetails/pending', 'appstate/saveUserDetails/fulfilled'],
            // Ignore these field paths in all actions
            ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            // Ignore these paths in the state
            ignoredPaths: ['items.dates']
          }
        })
});
export default store;

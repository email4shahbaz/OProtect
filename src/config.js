import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCcDgaifWtlNEYKX0r-VXaJ9DXyZXGnn3M",//AIzaSyA3fQFWw5boTY5DdXbB8fa_f7JdGlLw-8g",
  authDomain: "oprotect-b0f2e.firebaseio.com",
  databaseURL: "https://oprotect-b0f2e.firebaseio.com",
  projectId: "oprotect-b0f2e",
  storageBucket: "oprotect-b0f2e.appspot.com",
  messagingSenderId: "268002081242",
  appId: "1:268002081242:android:76b66e7a1dc7de6047a8e3",
  measurementId: "G-7ZZYKCQEQ6"
 };





 const app = firebase.initializeApp(firebaseConfig);
 export const db = app.database();

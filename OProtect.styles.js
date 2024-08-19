import { StyleSheet } from 'react-native';
import {Colors} from './Colors.js';

const styles = StyleSheet.create({
      container: {
           flex: 1,
           //justifyContent: 'center',
           //alignItems: 'center',
           backgroundColor: '#FFFFFF',
     },

     mainContainer:{flex:1, backgroundColor: Colors.mainDarkBlue,},
     mainHeader:{width: '100%', alignItems: 'center', padding: 8, backgroundColor:  Colors.mainDarkBlue, marginTop: 10},

     contentContainerStyle: {
           alignItems: 'center',
           padding: 10,
     },

     mainBg: {
           flex: 1,
           width: '100%',
           padding: 20,
           //justifyContent: 'center',
           alignItems: 'flex-start',
     },

     mainBgHome:{
           flex: 1,
            width: '100%',

           alignItems: 'center',
     },

     whiteBg: {
           flex: 1,
           flexDirection: 'column',
           alignItems: 'center',
           backgroundColor: '#FFFFFF',
           width: '100%',
           padding: 30,
           borderRadius: 15,
     },



     txtHeading:{
           color:"#002D4C",
           fontSize: 20,
           marginBottom: 10,
           textAlign:'center',
     },

     inputContainer: {
           borderColor: '#A9A9A9',
           backgroundColor: '#ffffff',
           borderWidth: 1,
           width:'100%',
           height:40,
           marginTop: 5,
           flexDirection: 'row',
           alignItems:'center',

     },


     text_primary_color:{color: '#002D4C'},
     text_secondary_color:{color: '#00AED8'},

     //LOGIN SCREEN
     login_heading:{fontSize: 28, marginTop: 30},
     login_sub_heading:{fontSize: 18, marginTop: 10},
     login_label:{fontSize: 16, marginTop: 30},



     signup_inputContainer: {
           borderColor: '#A9A9A9',
           backgroundColor: '#ffffff',
           borderRadius:100,
           borderWidth: 2,
           marginBottom: 10,
           width:'96%',
           height:50,
           flexDirection: 'row',
           alignItems:'center',

     },
     inputs:{
           height:45,
           marginLeft:16,
           borderBottomColor: '#FFFFFF',
           flex:1,
     },

     inputIcon:{marginRight: 10},

     buttonCont:{flex: 1, padding: 20, flexDirection: 'row', position: 'absolute', bottom:  0,},
     button:{paddingLeft: 30, paddingRight:30, paddingTop: 25, paddingBottom: 25, margin: 10, },

     buttonText: {
     fontSize: 24,
     fontFamily: 'Gill Sans',
     width: '100%',
     textAlign: 'center',
     margin: 10,
     color: '#ffffff',
     backgroundColor: 'transparent',
     },

     loader:{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 10000,
      backgroundColor: 'rgba(0, 0, 0, .35)',
      justifyContent: 'center',
      alignItems: 'center'
     },

     area_row: {
         padding:5,
         marginBottom:1,
         backgroundColor: 'white',
         flexDirection: 'row',
       },


       area_name: {
         marginTop:10,
         marginLeft:10,
         fontSize: 16,
    },

    //BOOKINGs
    bookingCont:{ flex: 1, borderRadius: 8, backgroundColor: 'white', width: '100%', padding: 10, marginBottom: 10,},
    bookingItemBtnCont:{ flex:1, marginTop: 10, flexDirection: 'row', justifyContent: 'center'},
    bookingHeaderButton:{flex:1},
    bookingDivider:{width: '100%', height: 1, marginTop: 10, marginBottom: 10, backgroundColor: 'grey'},
    bookingItemValItem:{ flexDirection: 'row', },
    bookingItemValItemQuote: {marginTop: 1, marginBottom: 1,},
    bookingItemValTitle:{flex: 2, fontWeight: 'bold'},
    bookingItemValValue:{flex: 2.5},
    quoteItemValTitle:{flex: 2, fontWeight: 'bold'},
    quoteItemValValue:{flex: 5,},

    //Tarrifs
    tarifCont:{ flex: 1,  width: '100%', padding: 10, },

    quoteRateBox:{width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10, paddingRight: 10, paddingTop: 2, paddingBottom: 5,},
    quoteRateInput:{ width: 65, fontSize: 18, textAlign: 'right', paddingLeft: 10, paddingTop: 0, paddingBottom: 0, height: 28, backgroundColor: 'white', borderWidth: 1, borderColor: 'grey', alignSelf: 'flex-end'},
    quoteRateCurrencyText: {fontSize: 16, marginLeft: 5, marginTop:2},
    quoteBoxDivider: {backgroundColor: 'grey', height: 1, width: '100%', marginTop: 3, marginBottom: 5, padding: 0},

    quotePriceBox:{width: '100%', flexDirection: 'row', justifyContent: 'space-between',},
    quotePriceText: {fontSize: 14, marginLeft: 5, marginTop:2},
    dialogCont: {position: 'absolute', flex:1,  backgroundColor: '#000000CC', width: '100%', height: '100%', zIndex: 100, padding: 30},


    //calendar
   calendarCont: {flex:1, borderRadius: 5, backgroundColor: 'white', marginTop: 5, marginLeft: 20, marginRight: 20, marginBottom: 2},
   calendarHeader: {width: '100%', flexDirection: 'row', justifyContent: 'space-between',  paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10},
   calendarNextMonth: {width: 30, height: 30, borderRadius: 100, backgroundColor: '#00AED8', alignItems: 'center', justifyContent: 'center'},
   calendarNextArrow: {alignSelf: 'center', marginTop: 3,},
   calendarMonthTitle: {fontSize: 20, fontWeight: 'bold'},
   calendarDayNamesBar:{flexDirection: 'row', width: '100%', backgroundColor: '#00AED8', justifyContent: 'space-around'},
   calendarDayName:{color: 'white', padding: 5, fontSize: 16},


   //Profile

   //Profile Document
   documentRow: {flexDirection: 'row', alignItems: 'center'},
   docTitle: {width: '25%', fontWeight: 'bold'},
   docValueRow: {flex: 1, borderRadius: 5, padding: 10,},
   docValueText: {color: 'blue', textDecorationLine: 'underline', marginRight: 30,  margin: 0, padding: 0},
   docEditIcon: {position: 'absolute', right: 0, top: 14},





    btnDelivered:{backgroundColor: 'green', padding: 10, borderRadius: 10, color: 'white', fontSize: 18, width: 150, textAlign:'center', marginBottom: 10},
    btnReadyToDeliver:{backgroundColor: 'orange'},
    btnRejected:{backgroundColor: 'red'},



  box: {
    padding:15,
    marginTop:5,
    marginBottom:5,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  boxContent: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft:0,
  },
  date:{ fontSize:18, color:"blue", },
  title:{fontSize:18,color:"#151515", },
  phone:{fontSize:14,color:"green", },
  buttons:{flexDirection: 'row',},
  userlist_icon: { height:25, flexDirection: 'row',  justifyContent: 'center',  alignItems: 'center',  borderRadius:10,  width:40,  marginRight:5, marginTop:5, },



  buttonReadyToDeliver: { flexDirection: 'row',   justifyContent: 'center',  alignItems: 'center', borderRadius:100,  width:46, height: 46, backgroundColor: 'orange', marginRight: 2},
  buttonDelivered: { flexDirection: 'row',   justifyContent: 'center',  alignItems: 'center', borderRadius:100,  width:46, height: 46, backgroundColor: 'green', marginRight: 2},
  buttonDeliveryRejected: { flexDirection: 'row',   justifyContent: 'center',  alignItems: 'center', borderRadius:100,  width:46, height: 46, backgroundColor: 'red', marginRight: 2},



  iconDelivery:{width:25, height:25,},
  dlist_icon:{width:15, height:15,},

  profile: {
    backgroundColor: "#1E90FF",
  },
  message: {
    backgroundColor: "#228B22",
  },
  sms: {
    backgroundColor: "#006DD9",
  },



  modelBg: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
     marginTop: 22,

  },


  modalView: {
    margin: 20,
    backgroundColor: "#33aa55",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  modalProfile:{
       backgroundColor: "#FFC21A",
 },

  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 15,
    textAlign: "center"
  },

  welcome_container: {flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', flexDirection: 'column', padding: 40, },
  welcome_logo: {width: 175, height: 175, },
  welcome_heading: {fontSize: 42, padding: 30, fontWeight: 'bold'},
  welcome_slogan: {backgroundColor: '#FFC21A', borderRadius: 15, padding: 40},
  welcome_sloganTxt: {color: '#FFFFFF', textAlign: 'center', fontSize: 18},




  dlist_buttons: {marginTop: 10, flexDirection:'row'},
  dlist_button:{padding: 5, width: 36, height: 28, borderRadius: 5, marginRight: 10, alignItems: 'center'},

   dlists_box: {
     padding:15,
     marginTop:5,
     marginBottom: 5,
     borderRadius: 10,
     backgroundColor: 'white',
     flexDirection: 'row',
     minHeight: 100,
   },
   dlists_boxContent: {
     flex:1,
     flexDirection: 'column',
     alignItems: 'flex-start',
     marginLeft: 10,
   },
   dlists_date:{ fontSize:18, color:"blue" },
   dlists_title:{fontSize:18, color:"#151515"},
   dlists_phone:{fontSize:16, color:"green",},
   dlists_started:{marginRight: 0, backgroundColor: '#1B6D1B', borderRadius: 8, height: 30, padding: 5, color: 'white' },
   dlists_half:{marginRight: 0, backgroundColor: 'orange', borderRadius: 8, height: 30, padding: 5, color: 'white' },
   dlists_completed:{marginRight: 0, backgroundColor: 'green', borderRadius: 8, height: 30, padding: 5, color: 'white' },

});

export default styles;

import * as firebase from "firebase";
import "@firebase/auth";
var firebaseConfig = {
  apiKey: "AIzaSyDa5BINSpVo4SasALNaZ8CbmXmMJOQZORI",
  authDomain: "services-72908.firebaseapp.com",
  databaseURL: "https://services-72908.firebaseio.com",
  projectId: "services-72908",
  storageBucket: "services-72908.appspot.com",
  messagingSenderId: "287376725533",
  appId: "1:287376725533:web:e980de492f7d3971e6d8f4",
  measurementId: "G-T45YZ4652P",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;

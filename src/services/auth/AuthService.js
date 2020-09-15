import * as firebase from "firebase";
import "@firebase/auth";
import AsyncStorage from "@react-native-community/async-storage";
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
export var database = firebase.database();
export const logout = async () => {
  console.log("************ LOGGED USER ************* ");
  console.log(firebase.auth().currentUser);
  firebase
    .auth()
    .signOut()
    .then(async () => {
      console.log("User logged out");
      await AsyncStorage.removeItem("@loggedUser");
      await AsyncStorage.removeItem("@forms");
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const checkAlreadyUser = (cellNo) =>
  new Promise((resolve, reject) => {
    database
      .ref("/userData")
      .orderByChild("cellNo")
      .equalTo(cellNo)
      .once("value", (snapshot) => {
        if (snapshot.val()) {
          resolve(snapshot.val());
        } else {
          reject();
        }
      });
  });

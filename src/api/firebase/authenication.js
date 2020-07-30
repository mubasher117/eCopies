import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import { Notifications } from "expo";
import { Permissions } from "expo-permissions";
import { exp } from "react-native-reanimated";
const firebaseConfig = {
  apiKey: "AIzaSyDa5BINSpVo4SasALNaZ8CbmXmMJOQZORI",
  authDomain: "services-72908.firebaseapp.com",
  databaseURL: "https://services-72908.firebaseio.com",
  projectId: "services-72908",
  storageBucket: "services-72908.appspot.com",
  messagingSenderId: "287376725533",
  appId: "1:287376725533:web:e980de492f7d3971e6d8f4",
  measurementId: "G-T45YZ4652P",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var database = firebase.database();

export const login = async() => {
  firebase
    .auth()
    .signInWithEmailAndPassword("testemail@gmail.com", "123456789")
    .then((user) => {
      console.log(user.user.uid);
      alert("Login Successfully");
      registerPushNotifications(user)
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      alert("Login failed");
      // ...
    });

};

export const register = async() => {
  firebase
    .auth()
    .createUserWithEmailAndPassword('test3@gmail.com', '123456789')
    .then((user) => {
      console.log(user.user.uid);
      alert("Registered Successfully");
      registerPushNotifications(user);
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      alert("Registration failed");
      // ...
    });
}
export const checkSignedIn = async() => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User Signed In")
    } else {
      console.log("User not signed in")
    }
  });
}
export const logout = async() => {
  firebase
    .auth()
    .signOut()
    .then(function () {
     console.log("User logged out")
    })
    .catch(function (error) {
      console.log(error)
    });
}
const registerPushNotifications = async (user) => {
  console.log(user.user.uid)
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    var updates = {}
    updates['/ExpoToken'] = token;
    database.ref("userData/").child(user.user.uid).update(updates, (data) => {
      console.log(data)
    })
};
export function addForm(json, callbackfn) {
  database.ref("testForm/456").set(json, callbackfn);
}

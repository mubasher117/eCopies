import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import store from "../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";
import User from "../../models/User";
import { db } from "../../services/auth/AuthService";
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

export var database = firebase.database();

export const login = (cellNo, password) =>
  new Promise((resolve, reject) => {
    console.log("IN LOGIN");

    firebase
      .auth()
      .signInWithPhoneNumber(cellNo, password)
      .then((res) => console.log(res));
  });

export const register = async (userInputDetails, callBackFn) => {
  // firebase
  //   .auth()
  //   .createUserWithEmailAndPassword(
  //     userInputDetails.email,
  //     userInputDetails.password
  //   )
  //   .then((user) => {
  //     callBackFn("success", user.user.uid);
  //     let userDetails = {
  //       id: user.user.uid,
  //       ...userInputDetails,
  //     };
  //     //registerUserInDb(userDetails, callBackFn); // Creates other information in db for that user
  //     var additionalDetails = {
  //       id: user.user.uid,
  //       name: userDetails.name,
  //       cellNo: userDetails.cellNo,
  //       address: userDetails.address,
  //       balance: 0,
  //     };
  //     addAddtionalUserDetails(
  //       additionalDetails,
  //       userInputDetails.email,
  //       userInputDetails.password,
  //       null
  //     );
  //   })
  //   .catch(function (error) {
  //     // Handle Errors here.
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     console.log(error);
  //     callBackFn("error", errorMessage);
  //     // ...
  //   });
};
export const checkSignedIn = async () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User Signed In");
      return true;
    } else {
      console.log("User not signed in");
      return false;
    }
  });
};
export const logout = async () => {
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
export const registerForPushNotificationsAsync = async (userID) => {
  const { existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }
  console.log("Permission ", finalStatus);
  // Get the token that uniquely identifies this device
  await Notifications.getExpoPushTokenAsync().then((token) => {
    var updates = {};
    updates["/expoToken"] = token.data;
    firebase
      .database()
      .ref("/userData/" + userID)
      .update(updates)
      .then(() => {});
  });

  // POST the token to our backend so we can use it to send pushes from there

  //call the push notification
};

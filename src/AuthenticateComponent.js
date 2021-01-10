import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Secondary } from "./constants/colors";
import * as firebase from "firebase/app";
import { centerScreen } from "./styles/General";
import "firebase/auth";
import { makeUserActive } from "./api/firebase/authenication";
import {
  registerForPushNotificationsAsync,
  getUserData,
} from "./api/firebase/authenication";
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
const AuthenticationComponent = (props) => {
  const auth = async () => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user.uid);
        getUserData(user.uid);
        registerForPushNotificationsAsync(user.uid);
        makeUserActive(user.uid);
        props.navigation.navigate("main");
      } else {
        props.navigation.navigate("auth");
      }
    });
  };
  useEffect(() => {
    auth();
  }, []);
  return (
    <View style={centerScreen}>
      <ActivityIndicator size="large" color={Secondary} />
    </View>
  );
};
export default AuthenticationComponent;

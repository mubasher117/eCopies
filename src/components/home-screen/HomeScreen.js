import React, {useEffect} from 'react';
import Background from '../child-components/Background';
import Logo from '../child-components/Logo';
import Header from '../child-components/Header';
import Paragraph from '../child-components/Paragraph';
import AsyncStorage from "@react-native-community/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Keyboard,
  Picker,
} from "react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
} from "@ant-design/react-native";
import {
  getUserData,
  registerForPushNotificationsAsync,
} from "../../api/firebase/authenication";
const { height, width } = Dimensions.get("window");
import * as firebase from "firebase";
export default function HomeScreen(props){
let getUserId = () =>
  new Promise(async (resolve, reject) => {
    let storedUser = await AsyncStorage.getItem("@loggedUser");
    try {
      storedUser = JSON.parse(storedUser);
    } catch (error) {
      console.log("Error in parsing userId ");
    }
    if (storedUser) {
      console.log("STORED ID FOUND:   ", storedUser.user.uid);
      getUserData(storedUser);
      registerForPushNotificationsAsync(storedUser.user.uid);
      resolve();
    }
  });
useEffect(() => {
    // var user = firebase.auth().currentUser;
    // console.log("USER AUTH");
    // console.log(user);
    // if (user){
    //   props.navigation.navigate("CopyFormHomePage");
    // }
    setTimeout(() => {getUserId().then(() => {
                      props.navigation.navigate("CopyFormHomePage");
                    });}, 500)
  
}, [props]);
  return (
    <View style={styles.container}>
      <Logo />
      <Header>Fast Services</Header>
      <Paragraph>We deliver at your doorstep.</Paragraph>
      <View style={{width:'90%'}}>
        <Button
          style={styles.button}
          type="primary"
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        >
          Login
        </Button>
        <Button
          style={styles.button}
          type="primary"
          onPress={() => {
            props.navigation.navigate("Register");
          }}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Secondary,
    borderWidth: 0,
    marginBottom: 10,
  },
});

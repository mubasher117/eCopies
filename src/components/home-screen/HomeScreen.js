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
const { height, width } = Dimensions.get("window");
import * as firebase from "firebase";
export default function HomeScreen(props){
useEffect(() => {
    // var user = firebase.auth().currentUser;
    // console.log("USER AUTH");
    // console.log(user);
    // if (user){
    //   props.navigation.navigate("CopyFormHomePage");
    // }
    // setTimeout(() => {getUserId().then(() => {
    //                   props.navigation.navigate("CopyFormHomePage");
    //                 });}, 500)
  
});
  return (
    <View style={styles.container}>
      <Logo />
      <Header>eCopies</Header>
      <Paragraph>Certified copies at doorstep.</Paragraph>
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

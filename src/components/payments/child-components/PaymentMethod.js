import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
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
  Image,
  TouchableHighlight,
  Modal
} from "react-native";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
  Icon,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../../constants/colors";
import {
  Portal,
  Text as RnpText,
  Button as RnpButton,
  Provider,
} from "react-native-paper";
import Header from "../../header/Header";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");

export default function PaymentMethod(props) {
  let index = 0;
  useEffect(() => {
    return () => {};
  }, []);
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const applicationSteps = [
    { title: "Personal", title2: "" },
    { title: "Case", title2: "" },
    { title: "Docs", title2: "" },
  ];
  const containerPress = () => {
    console.log("pressed");
    props.onPressMethod();
  };
  return (
    <TouchableHighlight
      elevation={10}
      style={[
        Platform.OS == "ios" ? styles.containerIOS : styles.container,
        { width: props.width },
      ]}
      onPress={containerPress}
    >
      <View style={{ width: "100%" , flexDirection:'row'}}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={props.source} />
        </View>
        <View style={styles.descriptionContainer}>
          <View style={styles.methodNameContainer}>
            <Text style={styles.methodName}>{props.methodName}</Text>
          </View>
          <View style={styles.accountNoContainer}>
            <Text>{props.accNo}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Icon name={"arrow-right"} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
  },
  containerIOS: {
    backgroundColor: PrimaryLight,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",

    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  imageContainer: {
    height: 70,
    justifyContent: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  descriptionContainer: {
    marginLeft: 10,
    flexWrap: "wrap",
  },
  methodName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    margin: 15,
  },
  accountNoContainer: {
    width: 160,
  },
});

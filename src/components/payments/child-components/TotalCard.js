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
} from "react-native";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../../constants/colors";
import { TextInput, Chip } from "react-native-paper";
import Header from "../../header/Header";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");

// Displays the balance of the user
export default function TotalCard(props) {
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
  return (
    <View
      elevation={10}
      style={[
        Platform.OS == "ios" ? styles.containerIOS : styles.container,
        { width: props.width },
      ]}
    >
      <View style={styles.totalLabelContainer}>
        <Text style={styles.totalLabel}>Pending Payment</Text>
      </View>
      <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmount}>Rs. {props.total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  containerIOS: {
    backgroundColor: PrimaryLight,
    width: "85%",
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
  totalLabelContainer: {
    marginTop: 25,
    marginBottom: 10,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  totalAmountContainer: {
    marginBottom: 30,
  },
  totalAmount: {
    color: Secondary,
    fontWeight: "bold",
    fontSize: 40,
  },
});

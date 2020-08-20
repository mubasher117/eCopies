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
  TouchableOpacity,
} from "react-native";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
  Tabs,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import { TextInput, Chip } from "react-native-paper";
import Header from "../header/Header";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");

export default function OrderStatusCard(props) {
  useEffect(() => {
    return () => {};
  }, []);
  // Function to be passed to Header
  const goBackFn = () => {
    props.navigation.navigate("Orders");
  };
  const tabs = [{ title: "Orders" }, { title: "Urgent" }];
  return (
    <View style={styles.centeredView}>
      <TouchableOpacity style={styles.infoContainer} onPress={props.seeDetails}>
        <View style={styles.orderHeader}>
          <Text style={{ color: "white" }}>
            Order#{"   "}
            <Text style={{ fontWeight: "bold", color: "white" }}>
              {props.order.orderNo}
            </Text>
          </Text>
        </View>
        <View style={styles.orderContainer}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Copy Form</Text>
          <View style={styles.orderDetails}>
            <Text>Status: </Text>
            <Text
              style={{
                fontWeight: "bold",
                color: Secondary,
                width: "45%",
              }}
            >
              {props.order.status}
            </Text>
          </View>
          <View style={styles.orderDetails}>
            <Text style={{ maxWidth: "50%" }}>Ordered on: </Text>
            <Text style={{ width: "45%" }}>
              {new Date(props.order.createdOn).toDateString()}
            </Text>
          </View>
          <View style={styles.orderDetails}>
            <Text>Ordered Total: </Text>
            <Text style={{ fontWeight: "bold", width: "45%" }}>
              Rs. {props.order.totalAmount}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  orderNoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    margin: 10,
  },
  infoContainer: {
    width: "100%",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "silver",
    borderRadius: 5,
  },
  orderHeader: {
    borderBottomColor: "silver",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Secondary,
    paddingRight: 20,
    paddingLeft: 20,
  },
  orderContainer: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

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
  Image,
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

export default function OrderDetails(props) {
  const details = props.navigation.getParam("details", "N/A");
  const previousScreen = props.navigation.getParam("screen", "Orders");
  useEffect(() => {
    return () => {};
  }, []);
  // Function to be passed to Header
  const goBackFn = () => {
    props.navigation.navigate(previousScreen);
  };
  const tabs = [{ title: "Orders" }, { title: "Urgent" }];
  return (
    <View style={styles.container}>
      <Header title="Details" backbutton goBackFn={goBackFn} />
      <ScrollView>
        <View style={styles.centeredView}>
          <Text style={styles.orderNo}>Order# {details.orderNo}</Text>
          <View style={styles.orderDetails}>
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: 16,
                backgroundColor: Secondary,
                padding: 10,
                borderRadius: 15,
              }}
            >
              {details.status}
            </Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.entity}>
              <Text style={styles.label}>Case No: </Text>
              {details.caseNo}
            </Text>
            <Text style={styles.entity}>
              <Text style={styles.label}>Date of decision: </Text>
            </Text>
            <Text style={styles.entity}>{details.decisionDate}</Text>
            <View style={styles.loopContainer}>
              <Text style={styles.entity}>
                <Text style={styles.label}>Judges: </Text>
              </Text>
              {details.judges.map((judge, index) => {
                return (
                  <Text style={styles.entity}>
                    {index + 1}- {judge}
                  </Text>
                );
              })}
            </View>
            <View style={styles.loopContainer}>
              <Text style={styles.entity}>
                <Text style={styles.label}>Documents Required: </Text>
              </Text>
              {details.documentDetails.map((document, index) => {
                return (
                  <Text style={styles.entity}>
                    {index + 1}- {document}
                  </Text>
                );
              })}
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{ fontSize: 16 }}>Order Total:</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Rs. {details.totalAmount}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  orderNo: {
    fontSize: 24,
    fontWeight: "bold",
  },
  entity: {
    fontSize: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: Secondary,
    borderWidth: 0,
    marginBottom: 10,
    marginTop: 30,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
  loopContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  detailsContainer: {
    width: "90%",
    backgroundColor: "#E1EEE1",
    padding: "3%",
    borderRadius: 10,
  },
});

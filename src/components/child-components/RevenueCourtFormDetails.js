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
import AsyncStorage from "@react-native-community/async-storage";
const { height, width } = Dimensions.get("window");
// Display words against db values
const displayDictionary = {
  copyForm: "Copy Form",
  highCourt: "High Court",
  revenueCourt: "Revenue Court",
};

export default function RevenueCourtFormDetails(props) {
  return (
    <View style={styles.detailsContainer}>
      {props.screen != "MyOrders" && (
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            margin: 0,
          }}
          onPress={() => props.removeOrder(props.index)}
        >
          <Image
            style={styles.modalQuit}
            source={require("../../../assets/images/static/quit.png")}
          />
        </TouchableOpacity>
      )}
      <View style={styles.orderInformation}>
        <Text style={styles.orderType}>Form {props.index + 1}</Text>
        <Text style={styles.orderCourt}>
          {displayDictionary[props.form.court]}
        </Text>
      </View>
      <View style={styles.entityContainer}>
        <Text style={styles.label}>Town: </Text>
        <Text style={styles.entityValue}>{props.form.town}</Text>
      </View>
      <View style={styles.entityContainer}>
        <Text style={styles.label}>Document Number: </Text>
        <Text style={styles.entityValue}>{props.form.documentNo}</Text>
      </View>
      <View style={styles.entityContainer}>
        <Text style={styles.label}>Bahi Number: </Text>
        <Text style={styles.entityValue}>{props.form.bahiNo}</Text>
      </View>
      <View style={styles.entityContainer}>
        <Text style={styles.label}>Volume: </Text>
        <Text style={styles.entityValue}>{props.form.volume}</Text>
      </View>
      <View style={styles.entityContainer}>
        <Text style={styles.label}>Date of register: </Text>
        <Text style={styles.entityValue}>{props.form.registerDate}</Text>
      </View>
      <View style={styles.entityContainer}>
        <Text style={styles.label}>Form Fee: </Text>
        <Text style={styles.entityValue}>Rs. {props.form.formFee}</Text>
      </View>
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
  orderInformation: {
    marginBottom: 15,
  },
  orderType: {
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  orderCourt: {
    alignSelf: "center",
    fontWeight: "bold",
  },
  entityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entity: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    width: "45%",
  },
  entityValue: {
    fontSize: 16,
    width: "45%",
  },
  caseEntitiesContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  caseEntity: {
    fontSize: 16,
    textAlign: "center",
  },
  vs: {
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 5,
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
    padding: 10,
  },
  loopLabel: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsContainer: {
    width: "90%",
    backgroundColor: "#E1EEE1",
    padding: "3%",
    marginTop: 30,
  },
  status: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
    backgroundColor: Secondary,
    padding: 10,
    borderRadius: 15,
  },
  modalQuit: {
    width: 30,
    height: 30,
  },
});

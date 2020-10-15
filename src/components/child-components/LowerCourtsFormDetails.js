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
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";

const { height, width } = Dimensions.get("window");

const formDetailsFields = [
  { field: "category", displayName: "Category" },
  { field: "judge", displayName: "Judge" },
  { field: "policeStation", displayName: "Police Station" },
  { field: "firNo", displayName: "Fir No" },
  { field: "plaintiff", displayName: "Plaintiff" },
  { field: "defendant", displayName: "Defendant" },
  { field: "decisionDate", displayName: "Decision Date" },
  { field: "formFee", displayName: "Form Fee" },
];

// Display Form Fields
const FormValues = ({ field, value }) => {
  // If value is present then display it
  if (value) {
    return (
      <View style={styles.entityContainer}>
        <Text style={styles.label}>{field} : </Text>
        {field == "Form Fee" ? (
          <Text style={styles.entityValue}>Rs. {value}</Text>
        ) : (
          <Text style={styles.entityValue}>{value}</Text>
        )}
      </View>
    );
  } else {
    return <View />;
  }
};
export default function LowerCourtsFormDetails(props) {
  return (
    <View style={styles.detailsContainer}>
      {props.screen == "SubmitDetails" && (
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            margin: 0,
            marginBottom: 10,
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
        <Text style={styles.orderCourt}>{props.form.court}</Text>
      </View>
      {formDetailsFields.map((value, index) => {
        return (
          <FormValues
            key={index}
            field={value.displayName}
            value={props.form[value.field]}
          />
        );
      })}
      <View style={styles.loopContainer}>
        <Text style={styles.loopLabel}>Documents Required</Text>
        {props.form.documentDetails.map((document, index) => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.entity, { width: "45%" }]}>
                {index + 1}- {document.type}
                {": "}
              </Text>
              <Text style={{ width: "45%" }}>
                {document.type == "Order Dated" || document.type == "Petition"
                  ? new Date(document.value).toDateString()
                  : document.value}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    width: "90%",
    backgroundColor: "#E1EEE1",
    padding: "3%",
    marginTop: 30,
  },
  modalQuit: {
    width: 30,
    height: 30,
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
  entityValue: {
    fontSize: 16,
    width: "45%",
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
});

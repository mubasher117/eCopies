import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  BackHandler,
} from "react-native";
import { Chip, Button as PaperButton } from "react-native-paper";
import OptionButtons from "../../components/child-components/OptionButtons";
import SectionTitle from "../../components/child-components/SectionTitle";
import Header from "../../components/header/Header";
import store from "../../redux/store";
import { Button } from "@ant-design/react-native";
import { Secondary, PrimaryText } from "../../constants/colors";
export default function DeliveryDetails(props) {
  const [isUrgent, setIsUrgent] = useState(false);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    new Date().toDateString()
  );
  useEffect(() => {
    // Setting inital expected date
    let expectedDate = calculateExpectedDeliveryDate(false);
    setExpectedDeliveryDate(expectedDate);
  }, []);
  const _hanleNext = () => {
    store.dispatch({ type: "setUrgent", payload: isUrgent });
    props.navigation.navigate("SubmitDetails");
  };
  const calculateExpectedDeliveryDate = (isUrgent) => {
    let date = new Date();
    // No days expected to be taken for the process
    let processTime = 5;
    if (isUrgent) {
      processTime = 3;
    }
    let expectedDate = date.setDate(new Date().getDate() + processTime);
    // if expected delivery day is Sunday
    if (new Date(expectedDate).getDay() == 0) {
      console.log("IS sunday")
      expectedDate = date.setDate(new Date().getDate() + processTime + 1);
    }
    expectedDate = new Date(expectedDate).toDateString();
    return expectedDate;
  };
  const _handleDeliveryType = (isUrgent) => {
    setIsUrgent(isUrgent);
    let expectedDate = calculateExpectedDeliveryDate(isUrgent);
    setExpectedDeliveryDate(expectedDate);
  };
  const addForm = () => {
    props.navigation.navigate("CopyFormHomePage");
  };
  return (
    <>
      <Header title={"Copy Form"} />
      <View style={styles.container}>
        <SectionTitle title="Delivery Details" />
        <View style={{ flex: 1 }}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Type</Text>
            {/* <Text style={styles.label}>تاریخ فیصلہ</Text> */}
          </View>
          <OptionButtons
            option1="Normal"
            option2="Urgent"
            _handleOption1={() => _handleDeliveryType(false)}
            _handleOption2={() => _handleDeliveryType(true)}
          />
          {isUrgent ? (
            <View style={styles.urgentMessageContainer}>
              <Text style={styles.urgentMessage}>
                * Your document would be delivered on the next day of order with
                some additional charges.
              </Text>
            </View>
          ) : (
            // Changed color of text instead of hiding it. Because hiding/showing was changing positions of other components
            <View style={styles.urgentMessageContainer}>
              <Text style={[styles.urgentMessage, { color: "white" }]}>
                * Your document would be delivered on the next day of order with
                some additional charges.
              </Text>
            </View>
          )}
          <View style={styles.infoContainer}>
            <View style={[styles.labelContainer, { flexDirection: "column" }]}>
              <Text style={styles.label}>Expected Delivery Date</Text>
              <Text style={styles.label}>ترسیل کی متوقع تاریخ</Text>
            </View>
            <View style={styles.valueContainer}>
              <Chip
                style={styles.expectedDeliveryDate}
                textStyle={styles.expectedDeliveryDateText}
              >
                {expectedDeliveryDate}
              </Chip>
            </View>
          </View>
          <View style={styles.btnAddFormContainer}>
            <PaperButton
              color={Secondary}
              icon="plus"
              mode="contained"
              onPress={addForm}
              style={{ height: 50, justifyContent: "center" }}
            >
              Add More Copy Form
            </PaperButton>
          </View>
        </View>
        <View style={styles.btnNextContainer}>
          <Button style={styles.btnNext} type="primary" onPress={_hanleNext}>
            Next
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    flex: 1,
  },
  btnNextContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  btnNext: {
    width: "50%",
    height: 50,
    backgroundColor: Secondary,
    borderWidth: 0,
  },
  labelContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expectedDeliveryDate: {
    alignItems: "center",
    borderRadius: 5,
  },
  expectedDeliveryDateText: {
    color: PrimaryText,
    fontSize: 16,
    padding: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  btnAddFormContainer: {
    marginTop: 40,
  },
  urgentMessage: {
    color: "red",
  },
});

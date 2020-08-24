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
// Display words against db values
const displayDictionary = {
  copyForm : 'Copy Form',
  highCourt: 'High Court'
}
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
          <View
            style={[
              styles.detailsContainer,
              {
                borderRadius: 10,
              },
            ]}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 16 }}>Order Total:</Text>
              <Text style={{ fontWeight: "bold", fontSize: 18, width: "45%" }}>
                Rs. {details.totalAmount}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 16 }}>Ordered on:</Text>
              <Text style={{ fontSize: 18, width: "45%" }}>
                {new Date(details.createdOn).toDateString()}
              </Text>
            </View>
            {details.progress.postDetails ? (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 16 }}>Tracking Id:</Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 18,
                    alignSelf: "center",
                  }}
                >
                  {details.progress.postDetails.trackingId}
                </Text>
              </View>
            ) : (
              <View />
            )}
          </View>
          {details.forms.map((form, index) => {
            return (
              <View style={styles.detailsContainer}>
                <View style={styles.orderInformation}>
                  <Text style={styles.orderType}>
                    {displayDictionary[details.orderType.name]} {index + 1}
                  </Text>
                </View>
                <View style={styles.entityContainer}>
                  <Text style={styles.label}>Case No: </Text>
                  <Text style={styles.entityValue}>{form.caseNo}</Text>
                </View>
                <View style={styles.entityContainer}>
                  <Text style={styles.label}>Date of decision: </Text>
                  <Text style={styles.entityValue}>{form.decisionDate}</Text>
                </View>
                <View style={styles.caseEntitiesContainer}>
                  <Text style={styles.caseEntity}>{form.plaintiff}</Text>
                  <Text style={styles.vs}>VS</Text>
                  <Text style={styles.caseEntity}>{form.defendant}</Text>
                </View>
                <View style={styles.loopContainer}>
                  <Text style={styles.loopLabel}>Judges</Text>
                  {form.judges.map((judge, index) => {
                    return (
                      <Text style={styles.entity}>
                        {index + 1}- {judge}
                      </Text>
                    );
                  })}
                </View>
                <View style={styles.loopContainer}>
                  <Text style={styles.loopLabel}>Documents Required</Text>

                  {form.documentDetails.map((document, index) => {
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
                          {document.type == "Order Dated" ||
                          document.type == "Petition"
                            ? new Date(document.value).toDateString()
                            : document.value}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ width: 10, height: 150 }} />
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
    alignSelf: "flex-end",
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
});

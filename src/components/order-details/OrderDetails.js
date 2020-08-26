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
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
// Display words against db values
const displayDictionary = {
  copyForm: "Copy Form",
  highCourt: "High Court",
  revenueCourt: "Revenue Court",
};

function RevenueCourtFormDetails(props) {
  return <View></View>;
}

export default function OrderDetails(props) {
  const details = props.navigation.getParam("details", "N/A");
  const previousScreen = props.navigation.getParam("screen", "Orders");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    return () => {};
  }, []);
  // Function to be passed to Header
  const goBackFn = () => {
    props.navigation.navigate(previousScreen);
  };
  const removeFormFromStorage = () =>
    new Promise(async (resolve, reject) => {
      const jsonValue = JSON.stringify(details.forms);
      await AsyncStorage.setItem("@forms", jsonValue);
      resolve();
    });
  const removeOrder = async (index) => {
    let previousTotal = details.totalAmount;
    let totalOfSingleForm = previousTotal / details.forms.length;
    let totalAfterFormDelete = details.totalAmount - totalOfSingleForm;
    console.log(totalAfterFormDelete);
    details.forms.splice(index, 1);
    details.totalAmount = totalAfterFormDelete;
    props.navigation.setParams("details", {details});
    removeFormFromStorage().then(() => {
      if (details.forms.length == 0){
        props.navigation.navigate("CopyFormHomePage");
      }
      else{
        setRefresh(1);
      }
    });
  };
  return (
    <View style={styles.container}>
      <Header title="Details" backbutton goBackFn={goBackFn} />
      <ScrollView>
        <View style={styles.centeredView}>
          {/* If navigated from Submit Order screen */}
          {props.navigation.getParam("screen") != "SubmitDetails" && (
            <View style={styles.centeredView}>
              <Text style={styles.orderNo}>Order# {details.orderNo}</Text>
              <View style={styles.orderDetails}>
                <Text style={styles.status}>{details.status}</Text>
              </View>
            </View>
          )}
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
              <Text style={{ fontSize: 16 }}>Total Copy Forms:</Text>
              <Text style={{ fontWeight: "bold", fontSize: 18, width: "45%" }}>
                {details.forms.length}
              </Text>
            </View>
            {props.navigation.getParam("screen") != "SubmitDetails" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 16 }}>Ordered on:</Text>
                <Text style={{ fontSize: 18, width: "45%" }}>
                  {new Date(details.createdOn).toDateString()}
                </Text>
              </View>
            )}
            {props.navigation.getParam("screen") != "SubmitDetails" &&
              (details.progress.postDetails ? (
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
              ))}
          </View>
          {details.forms.map((form, index) => {
            if (form.court == "highCourt") {
              return (
                <View style={styles.detailsContainer}>
                  {props.navigation.getParam("screen") == "SubmitDetails" && (
                    <TouchableOpacity
                      style={{
                        alignSelf: "flex-end",
                        margin: 0,
                        marginBottom: 10,
                      }}
                      onPress={() => removeOrder(index)}
                    >
                      <Image
                        style={styles.modalQuit}
                        source={require("../../../assets/images/static/quit.png")}
                      />
                    </TouchableOpacity>
                  )}
                  <View style={styles.orderInformation}>
                    <Text style={styles.orderType}>
                      {displayDictionary[details.orderType.name]} {index + 1}
                    </Text>
                    <Text style={styles.orderCourt}>
                      {displayDictionary[form.court]}
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
            } else {
              return (
                <View style={styles.detailsContainer}>
                  {props.navigation.getParam("screen") == "SubmitDetails" && (
                    <TouchableOpacity
                      style={{
                        alignSelf: "flex-end",
                        margin: 0,
                        marginBottom: 10,
                      }}
                      onPress={() => removeOrder(index)}
                    >
                      <Image
                        style={styles.modalQuit}
                        source={require("../../../assets/images/static/quit.png")}
                      />
                    </TouchableOpacity>
                  )}
                  <View style={styles.orderInformation}>
                    <Text style={styles.orderType}>
                      {displayDictionary[details.orderType.name]} {index + 1}
                    </Text>
                    <Text style={styles.orderCourt}>
                      {displayDictionary[form.court]}
                    </Text>
                  </View>
                  <View style={styles.entityContainer}>
                    <Text style={styles.label}>Town: </Text>
                    <Text style={styles.entityValue}>{form.town}</Text>
                  </View>
                  <View style={styles.entityContainer}>
                    <Text style={styles.label}>Document Number: </Text>
                    <Text style={styles.entityValue}>{form.documentNo}</Text>
                  </View>
                  <View style={styles.entityContainer}>
                    <Text style={styles.label}>Bahi Number: </Text>
                    <Text style={styles.entityValue}>{form.bahiNo}</Text>
                  </View>
                  <View style={styles.entityContainer}>
                    <Text style={styles.label}>Volume: </Text>
                    <Text style={styles.entityValue}>{form.volume}</Text>
                  </View>
                  <View style={styles.entityContainer}>
                    <Text style={styles.label}>Date of register: </Text>
                    <Text style={styles.entityValue}>{form.registerDate}</Text>
                  </View>
                </View>
              );
            }
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

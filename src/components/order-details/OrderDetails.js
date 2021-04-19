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
  Modal,
  BackHandler,
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
import { Chip, Button as PaperButton } from "react-native-paper";
import Header from "../header/Header";
import AsyncStorage from "@react-native-community/async-storage";
import HighCourtFormDetails from "../child-components/HighCourtFormDetails";
import RevenueCourtFormDetails from "../child-components/RevenueCourtFormDetails";
import LowerCourtsFormDetails from "../child-components/LowerCourtsFormDetails";
const { height, width } = Dimensions.get("window");
export default function OrderDetails(props) {
  const details = props.navigation.getParam("details", "N/A");
  const previousScreen = props.navigation.getParam("screen", "Orders");
  const [refresh, setRefresh] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [formIndex, setFormIndex] = useState(0);
  useEffect(() => {
    //Back Handler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    });
    const onBlurScreen = props.navigation.addListener("didBlur", () => {
      console.log("UNFOCUSED");
      backHandler.remove();
    });
    return () => {
      unsubscribe;
      onBlurScreen;
      backHandler.remove();
    };
  }, []);

  const backAction = async() => {
    var previousScreen = await AsyncStorage.getItem("currentScreen");
    if (!previousScreen){
      previousScreen = "Orders"
    }
    props.navigation.navigate(previousScreen);
    return true;
  };
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
    props.navigation.setParams("details", { details });
    removeFormFromStorage().then(() => {
      if (details.forms.length == 0) {
        props.navigation.navigate("CopyFormHomePage");
      } else {
        setRefresh(1);
      }
    });
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
  };

  const showModal = (index) => {
    setFormIndex(index);
    setIsModalVisible(true);
    setcontainerOpacity(0.2);
  };
  const deleteForm = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
    removeOrder(formIndex);
  };
  const addForm = () => {
    props.navigation.navigate("CopyFormHomePage");
  };

  return (
    <View style={styles.container}>
      <Header title="Details" backbutton goBackFn={goBackFn} />
      {/*Delete form modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          //alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredViewModal}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Do you want to delete this form?
            </Text>
            {/* <Text style={styles.modalText}>
              کیا آپ ایک اور نقل فارم لینا چاہتے ہیں؟
            </Text> */}
            <View style={styles.modalButtonsContainer}>
              <Button
                style={styles.buttonModalNo}
                type="primary"
                onPress={hideModal}
              >
                <Text style={{ color: Secondary }}>No</Text>
              </Button>
              <Button
                style={styles.buttonModalYes}
                type="primary"
                onPress={deleteForm}
              >
                Yes
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={[styles.centeredView, { opacity: containerOpacity }]}>
          {/* If navigated from Submit Order screen */}
          {props.navigation.getParam("screen") == "MyOrders" && (
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
            {props.navigation.getParam("screen") == "MyOrders" && (
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
            {props.navigation.getParam("screen") == "MyOrders" &&
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
          <PaperButton
            color={Secondary}
            icon="plus"
            mode="contained"
            onPress={addForm}
            style={styles.formOptionsButton}
          >
            Add More Copy Form
          </PaperButton>
          {details.forms.map((form, index) => {
            if (form.court == "High Court" || form.court == "Supreme Court") {
              return (
                <HighCourtFormDetails
                  removeOrder={showModal}
                  index={index}
                  screen={props.navigation.getParam("screen")}
                  form={form}
                  orderType={details.orderType.name}
                />
              );
            } else if (form.court == "revenueCourt") {
              return (
                <RevenueCourtFormDetails
                  removeOrder={showModal}
                  index={index}
                  screen={props.navigation.getParam("screen")}
                  form={form}
                  orderType={details.orderType.name}
                />
              );
            } else {
              return (
                <LowerCourtsFormDetails
                  form={form}
                  orderType={details.orderType.name}
                  index={index}
                  removeOrder={showModal}
                  screen={props.navigation.getParam("screen")}
                />
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
  centeredViewModal: {
    flex: 1,
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
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  modalTextBold: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  modalSubtext: {
    fontSize: 12,
    color: "grey",
    marginTop: -10,
  },
  buttonModalYes: {
    width: "40%",
    height: 45,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
  },
  buttonModalNo: {
    width: "40%",
    height: 45,
    backgroundColor: "#E6E6E6",
    borderWidth: 0,
    alignSelf: "flex-end",
  },
  formOptionsButton: {
    height: 40,
    justifyContent: "center",
    borderRadius: 0,
    marginTop: 25
  },
});

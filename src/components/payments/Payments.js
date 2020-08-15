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
  Alert,
  TouchableHighlight,
  Image,
  Modal,
} from "react-native";
import { Button, ActivityIndicator, Steps } from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import { Checkbox } from "react-native-paper";
import {
  addForm,
  login,
  register,
  checkSignedIn,
  logout,
} from "../../api/firebase/authenication";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../header/Header";
import ModalPicker from "react-native-modal-picker";
import TotalCard from "./child-components/TotalCard";
import PaymentMethod from "./child-components/PaymentMethod";
import store from "../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";
//import Modal, { SlideAnimation, ModalContent } from "react-native-modals";
import { database } from "../../api/firebase/authenication";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
const paymentMethods = [
  {
    source: require("../../../assets/images/static/hbl.png"),
    methodName: "HBL",
    accNo: "148953134243117",
    accTitle: "Fast Services",
  },
  {
    source: require("../../../assets/images/static/standardchartered-icon.png"),
    methodName: "Standard Chartered",
    accNo: "47554478787878848",
    accTitle: "Fast Services",
  },
  {
    source: require("../../../assets/images/static/easypaisa-icon.png"),
    methodName: "Easypaisa",
    accNo: "03134243117",
  },
  {
    source: require("../../../assets/images/static/jazzcash.png"),
    methodName: "Jazz Cash",
    accNo: "03134243117",
  },
];
function Payments(props) {
  var val = "";
  let index = 0;
  const districts = [
    {
      key: index++,
      section: true,
      label: "Districts",
    },
    { key: index++, label: "Lahore" },
    {
      key: index++,
      label: "Faisalabad",
    },
    {
      key: index++,
      label: "Sheikhupura",
    },
  ];
  const [showLoading, setshowLoading] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);

  // Retrieve user id from storage
  let getUserId = () =>
    new Promise(async (resolve, reject) => {
      // retrieving user data
      let storedUser = await AsyncStorage.getItem("@loggedUser");
      try {
        storedUser = JSON.parse(storedUser);
      } catch (error) {
        console.log("Error in parsing userId ");
      }
      let storedUserId = storedUser.user.uid;
      resolve(storedUserId);
    });
  useEffect(() => {
    // Get user's balance from firebase
    getUserId().then((userId) => {
      console.log("STORED USER ID in Payments:  ", userId);
      database
        .ref("userData/" + userId + "/balance")
        .on("value", (snapshot) => {
          console.log(snapshot.val());
          setTotalPayment(snapshot.val());
        });
    });
  }, [totalPayment]);
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const applicationSteps = [
    { title: "Info", title2: "" },
    { title: "Payments", title2: "" },
  ];
  const onPressMethod = (method, acc, title) => {
    setPaymentMethod(method);
    setAccountNo(acc);
    setAccountTitle(title);
    showModal();
  };
  const showModal = () => {
    setisModalVisible(true);
    setcontainerOpacity(0.05);
    console.log(isModalVisible);
  };
  const hideModal = () => {
    setisModalVisible(false);
    setcontainerOpacity(1);
    console.log(isModalVisible);
  };

  return (
    <SafeAreaView style={[styles.container, { opacity: containerOpacity }]}>
      <Header title="Payments" openDrawerFn={openDrawerFn} />
      {/* <Modal
        visible={isModalVisible}
        onTouchOutside={() => {
          setisModalVisible(false);
        }}
        useNativeDriver={true}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
      >
        <ModalContent>
          <View style={{ width: "85%", height: 200 }}>
            <Text>
              Please transfer the amount equivalent to charges to the bank
              account with the following details
            </Text>
            <Text>1245454545</Text>
            <View style={{ flexDirection: "row" }}>
              <Button onPress={hideModal}>Close</Button>
              <Button onPress={hideModal}>Verify</Button>
            </View>
          </View>
        </ModalContent>
      </Modal> */}
      {/*Modal Start*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please transfer amount equivalent to Rs.{" "}
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {totalPayment}
              </Text>{" "}
              to{" "}
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {paymentMethod}
              </Text>{" "}
              account with following details.
            </Text>
            {accountTitle ? (
              <View>
                <Text>Account Title:</Text>

                <Text style={styles.modalAccNo}>{accountTitle}</Text>
              </View>
            ) : (
              <View />
            )}
            <Text>Account Number:</Text>
            <Text style={styles.modalAccNo}>{accountNo}</Text>
            {/* <View
              style={{
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Checkbox
                status={isPaid ? "checked" : "unchecked"}
                onPress={() => {
                  setIsPaid(!isPaid);
                }}
                color={Secondary}
              />
              <Text>I have paid on above details.</Text>
            </View> */}
            <Button
              style={styles.buttonModalClose}
              type="primary"
              onPress={hideModal}
            >
              OK
            </Button>
          </View>
        </View>
      </Modal>

      {/*Modal End*/}
      {/* 
      <View style={styles.stepsContainer}>
        <Steps size="small" current={0} direction="horizontal">
          {applicationSteps.map((item, index) => (
            <Step
              key={index}
              title={
                <View style={{ marginTop: 10 }}>
                  <Text>{item.title}</Text>
                  <Text>{item.title2}</Text>
                </View>
              }
              status={item.status}
            />
          ))}
        </Steps>
      </View> */}
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            width: "100%",
            marginTop: 20,
          }}
        >
          <TotalCard total={totalPayment} width={"85%"} />
          <View style={styles.paymentLabelContainer}>
            <Image
              style={styles.paymentLabelImage}
              source={require("../../../assets/images/static/payment.png")}
            />
            <Text style={styles.paymentLabel}>Payment Methods</Text>
          </View>

          <View style={styles.divider} />
          {paymentMethods.map((method, index) => {
            return (
              <PaymentMethod
                key={index}
                width={"85%"}
                source={method.source}
                methodName={method.methodName}
                accNo={method.accNo}
                onPressMethod={() =>
                  onPressMethod(
                    method.methodName,
                    method.accNo,
                    method.accTitle
                  )
                }
              />
            );
          })}

          <View
            style={{
              margin: 30,
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
              width: "85%",
            }}
          >
            <Button
              style={styles.home}
              type="primary"
              onPress={() => {
                props.navigation.navigate("CopyForm");
              }}
            >
              Add Payment Details
            </Button>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: 200,
          }}
        />
      </ScrollView>

      <ActivityIndicator
        animating={showLoading}
        toast
        size="large"
        text="Submitting..."
      />
    </SafeAreaView>
  );
}
export default Payments;
const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
  home: {
    width: "100%",
    height: 70,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
  },
  stepsContainer: {
    width: "120%",
    alignItems: "center",
    marginTop: 20,
  },
  paymentLabelContainer: {
    flex: 1,
    flexDirection: "row",
    width: "85%",
    marginTop: 30,
    marginLeft: 30,
  },
  paymentLabelImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  paymentLabel: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 8,
    marginLeft: 0,
  },
  divider: {
    width: "85%",
    height: 1,
    backgroundColor: PrimaryText,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    marginBottom: 15,
  },
  modalTextBold: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalAccNo: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  buttonModalClose: {
    width: "30%",
    height: 45,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
  },
});

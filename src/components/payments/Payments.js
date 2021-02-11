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
import TotalCard from "./child-components/TotalCard";
import PaymentMethod from "./child-components/PaymentMethod";
import store from "../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";

import Modal from "../child-components/Modal";
//import Modal, { SlideAnimation, ModalContent } from "react-native-modals";
import { database } from "../../api/firebase/authenication";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
const paymentMethods = [
  {
    source: require("../../../assets/images/static/cash-on-delivery.png"),
    methodName: "Cash on Delivery",
    accNo: "Pay at delivery time",
    modalMessage: "Please pay charges to delivery guy when documents are delivered.",
  },
  // {
  //   source: require("../../../assets/images/static/easypaisa-icon.png"),
  //   methodName: "Easypaisa",
  //   accNo: "03134243117",
  // },
  // {
  //   source: require("../../../assets/images/static/abl.jpg"),
  //   methodName: "Allied Bank Limited",
  //   accNo: "148953134243117",
  //   accTitle: "eCopies",
  // },
  // {
  //   source: require("../../../assets/images/static/hbl.png"),
  //   methodName: "HBL",
  //   accNo: "148953134243117",
  //   accTitle: "Law Eservices",
  // },
  // {
  //   source: require("../../../assets/images/static/standardchartered-icon.png"),
  //   methodName: "Standard Chartered",
  //   accNo: "47554478787878848",
  //   accTitle: "Law Eservices",
  // },
  // {
  //   source: require("../../../assets/images/static/jazzcash.png"),
  //   methodName: "Jazz Cash",
  //   accNo: "03134243117",
  // },
];
function Payments(props) {
  const [containerOpacity, setcontainerOpacity] = useState(0.3);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [totalPayment, setTotalPayment] = useState(0);
  const [isPendingPayment, setPendingPayment] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // retrieving user data
    let state = store.getState();
    let user = state.userReducer.user;
    database.ref("userData/" + user.id + "/balance").on("value", (snapshot) => {
      console.log(snapshot.val());
      setTotalPayment(snapshot.val());
      setLoading(false);
      setcontainerOpacity(1);
    });
  }, []);
  // Show pending payment modal
  const showPendingPaymentModal = () => {
    setPendingPayment(true);
    setcontainerOpacity(0.05);
    console.log(isModalVisible);
  };
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
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
    setPendingPayment(false);
    setcontainerOpacity(1);
    console.log(isModalVisible);
  };

  return (
    <SafeAreaView style={[styles.container, { opacity: containerOpacity }]}>
      <Header title="Payments" openDrawerFn={openDrawerFn} />
      <Modal
        visible={isModalVisible}
        text={modalMessage}
        // urduText="براۓ مہربانی مزید نقل فارم کے لیے اپنے واجبات ادا کریں۔"
        buttonOkText="OK"
        hideModal={hideModal}
        handleOkay={hideModal}
      />

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
          {/* <View style={styles.patmentNoteContainer}>
            <Text style={styles.paymentNoteHeader}>How to pay?</Text>
            <Text style={styles.paymentNote}>
              Please pay the pending amount at delivery time to the delivery
              guy.
            </Text>
          </View> */}
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
                onPressMethod={() => {
                  onPressMethod(
                    method.methodName,
                    method.accNo,
                    method.accTitle
                  );
                  setModalMessage(method.modalMessage);
                }}
              />
            );
          })}
        </View>
        <View
          style={{
            width: "100%",
            height: 200,
          }}
        />
      </ScrollView>

      <ActivityIndicator animating={isLoading} toast size="large" />
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
  patmentNoteContainer: {
    width: "85%",
    marginTop: 20,
  },
  paymentNoteHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  paymentNote: {
    fontSize: 14,
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
    width: "100%",
    height: 40,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
    marginTop: 30,
  },
});

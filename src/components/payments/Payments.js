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
  Modal
} from "react-native";
import {
  Button,
  ActivityIndicator,
  Steps,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import {Checkbox } from "react-native-paper";
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
//import Modal, { SlideAnimation, ModalContent } from "react-native-modals";

const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
export default function Payments(props) {
  var val = "";
  let index = 0;
  const districts = [
    { key: index++, section: true, label: "Districts" },
    { key: index++, label: "Lahore" },
    { key: index++, label: "Faisalabad" },
    { key: index++, label: "Sheikhupura" },
  ];
  const [showLoading, setshowLoading] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [accountTitle, setAccountTitle] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);
  const goBackFn = () => props.navigation.navigate("CopyFormDocs");
  const paymentMethods = [
    {
      source: require("../../../assets/images/static/easypaisa-icon.png"),
      methodName: "Easypaisa",
      accNo: "03134243117",
    },
    {
      source: require("../../../assets/images/static/hbl.png"),
      methodName: "HBL",
      accNo: "148953134243117",
      accTitle: "Fast Services"
    },
  ];
  const applicationSteps = [
    { title: "Info", title2: "" },
    { title: "Payments", title2: "" },
  ];
  var descriptionMain = "";
  var descriptionSecondary = "";
  const onPressMethod = (method, acc, title) => {
    setPaymentMethod(method);
    setAccountNo(acc);
    setAccountTitle(title);
    showModal()
  };
  const showModal = () => {
    setisModalVisible(true);
    setcontainerOpacity(0.05)
    console.log(isModalVisible);
  };
  const hideModal = () => {
    setisModalVisible(false);
    setcontainerOpacity(1);
    console.log(isModalVisible)
  }

  return (
    <SafeAreaView style={[styles.container, { opacity: containerOpacity }]}>
      <Header title="Payments" backbutton goBackFn={goBackFn} />
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
              Please transfer the amount equivalent to charges to{" "}
              {paymentMethod}
              account
            </Text>
            {accountTitle ? <Text>Account Title:</Text> : <View />}
            <Text style={styles.modalAccNo}>{accountTitle}</Text>
            <Text>Account Number:</Text>
            <Text style={styles.modalAccNo}>{accountNo}</Text>
            <Checkbox
              status={isPaid ? "checked" : "unchecked"}
              onPress={() => {
                setIsPaid(!isPaid);
              }}
              color={Secondary}
            />
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
      </View>
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            width: "100%",
          }}
        >
          <TotalCard total={2200} width={"85%"} />
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
              width: "90%",
            }}
          >
            <Button
              style={styles.next}
              type="primary"
              onPress={() => {
                props.navigation.navigate("CopyFormDocs");
              }}
            >
              Next
            </Button>
          </View>
        </View>
        <View style={{ width: "100%", height: 200 }} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
  sectionContainer: {
    width: "90%",
  },
  sectionTitleContainer: {
    borderBottomColor: PrimaryText,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  sctionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: PrimaryText,
  },
  labelContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  valueContainer: {
    marginTop: 10,
  },
  value: {
    marginLeft: "-5%",
    padding: 10,
    borderBottomWidth: 2,
  },
  inputLabel: {
    width: 100,
  },
  vs: {
    textAlign: "center",
    marginTop: 25,
  },
  inputContainer: {
    marginTop: 20,
  },
  listItem: {
    height: 80,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
  },
  labelText: {
    fontSize: 18,
  },
  next: {
    width: "40%",
    height: 50,
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
    textAlign: "center",
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
    height: 40,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
  },
});

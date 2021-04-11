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
  List,
  Modal,
  Image,
  BackHandler,
} from "react-native";
import {
  InputItem,
  Tag,
  ActivityIndicator,
  Steps,
  Button,
} from "@ant-design/react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../../constants/colors";
import {
  TextInput,
  FAB,
  Switch,
  Checkbox,
  Button as PaperButton,
  Chip,
} from "react-native-paper";
import {
  addForm,
  login,
  register,
  checkSignedIn,
  logout,
} from "../../../api/firebase/authenication";
import AsyncStorage from "@react-native-community/async-storage";
import Header from "../../header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { database } from "../../../api/firebase/authenication";
import { cellNoValidator, addressValidator } from "../../core/utils";
const { height, width } = Dimensions.get("window");
import { getFormPrices } from "../../../api/firebase/backend";
import store from "../../../redux/store";
import OptionButtons from "../../child-components/OptionButtons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { color, not } from "react-native-reanimated";
export default function SubmitDetails(props) {
  const [showLoading, setshowLoading] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [cellNo, setCellNo] = useState({ error: "", value: "" });
  const [address, setAddress] = useState({ error: "", value: "" });
  const [totalForms, setTotalForms] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    new Date().toDateString()
  );
  const [forms, setForms] = useState();
  const [formsPrices, setFormPrices] = useState();
  const [showWaiting, setWaiting] = useState(false);
  useEffect(() => {
    // retrieving user data
    let state = store.getState();
    let user = state.userReducer.user;
    setAddress({ value: user.address, error: "" });
    setCellNo({ value: user.cellNo, error: "" });
    _handleForms();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    let expectedDate = calculateExpectedDeliveryDate(false);
    setExpectedDeliveryDate(expectedDate);
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let user = state.userReducer.user;
      setAddress({ value: user.address, error: "" });
      setCellNo({ value: user.cellNo, error: "" });
      setIsUrgent(false);
      _handleForms();

      console.log(
        "********************* IN HANDLER ISURGENT**********************"
      );
      console.log("isUrgent:     ", isUrgent);
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
  const backAction = () => {
    console.log("IN BACK HANDLER");
    _handlePrevious();
    return true;
  };
  const _handleForms = async () => {
    setWaiting(true);
    getFormPrices().then(async (priceData) => {
      setFormPrices(priceData);
      let loadedForms;
      try {
        const formsJson = await AsyncStorage.getItem("@forms");
        formsJson != null
          ? (loadedForms = JSON.parse(formsJson))
          : console.log("Error");
      } catch (e) {
        // error reading value
      }
      setForms(loadedForms);
      setTotalForms(loadedForms.length ? loadedForms.length : 0);
      console.log(
        "********************* IN FUNCTION ISURGENT**********************"
      );
      console.log("isUrgent:     ", isUrgent);
      calculateOrderTotal(loadedForms, isUrgent, priceData);
    });
  };
  const calculateOrderTotal = async (inpForms, isUrgent, prices) => {
    setWaiting(true);
    var totalAmount = 0;
    if (inpForms) {
      inpForms.map((form, index) => {
        try {
          if (isUrgent) {
            totalAmount = totalAmount + parseInt(prices[form.court].urgent);
            form["formFee"] = parseInt(prices[form.court].urgent);
          } else {
            totalAmount = totalAmount + parseInt(prices[form.court].normal);
            form["formFee"] = parseInt(prices[form.court].normal);
          }
        } catch (error) {
          if (isUrgent) {
            totalAmount = totalAmount + parseInt(prices["Lower Courts"].urgent);
            form["formFee"] = parseInt(prices["Lower Courts"].urgent);
          } else {
            totalAmount = totalAmount + parseInt(prices["Lower Courts"].normal);
            form["formFee"] = parseInt(prices["Lower Courts"].normal);
          }
        }
      });
    }
    setOrderTotal(totalAmount);
    setWaiting(false);
  };
  const calculateExpectedDeliveryDate = (isUrgent) => {
    let date = new Date();
    // No days expected to be taken for the process
    let processTime = 6;
    if (isUrgent) {
      processTime = 3;
    }
    let expectedDate = date.setDate(new Date().getDate() + processTime);
    // if expected delivery day is Sunday
    if (new Date(expectedDate).getDay() == 0) {
      console.log("IS sunday");
      expectedDate = date.setDate(new Date().getDate() + processTime + 1);
    }
    expectedDate = new Date(expectedDate).toDateString();
    return expectedDate;
  };
  const _handleDeliveryType = (isUrgentOrder) => {
    setIsUrgent(isUrgentOrder);
    let expectedDate = calculateExpectedDeliveryDate(isUrgentOrder);
    setExpectedDeliveryDate(expectedDate);
    calculateOrderTotal(forms, isUrgentOrder, formsPrices);
  };
  const _handlePrevious = () => {
    props.navigation.navigate("CopyFormHomePage");
  };
  // Callback function after adding order
  const addFormCallBack = async (error) => {
    if (error) {
      setshowLoading(false);
      alert("adding failed");
      showModal();
    } else {
      setshowLoading(false);
      showModal();
      await AsyncStorage.removeItem("@caseDetails");
      await AsyncStorage.removeItem("@caseDetails2");
      await AsyncStorage.removeItem("@forms");
    }
  };
  // Returns random number between 70000000 and 99999999
  function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }
  // Submits details to firebase
  let timerId;
  const _submit_throttle = (func, delay) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func();
    }, delay);
  };
  const onSubmit = () => {
    setshowLoading(true);
    setcontainerOpacity(0.3);
    _submit_throttle(_handleSubmit, 5000);
  };
  const _handleSubmit = async () => {
    console.log("submitted");
    var isNotValidAddress = addressValidator(address.value);
    if (isNotValidAddress) {
      setAddress({ ...address, error: isNotValidAddress });
    } else {
      //Geerates an order no ranging between the parameters
      var orderNo = getRandomArbitrary(1000000, 9999999);
      let state = store.getState();
      // retrieving user data
      let user = state.userReducer.user;
      // Final details ready to be posted
      let orderDetails = {
        applicantName: user.name,
        cellNo: cellNo.value,
        address: address.value,
        forms: forms,
        isUrgent: isUrgent,
        status: "Pending",
        progress: {
          pending: Date.now(),
        },
        customerId: user.id,
        createdOn: Date.now(),
        orderNo: orderNo,
        totalAmount: orderTotal,
        orderType: {
          name: "copyForm",
        },
      };
      console.log("******************* FINAL FORM **********************")
      console.log(orderDetails)
      addForm(orderDetails, addFormCallBack);
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
    setcontainerOpacity(0.05);
    console.log(isModalVisible);
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
    props.navigation.navigate("Payments");
  };
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  // Passes the current order details to Order Details page
  const _handleReview = async () => {
    let order = {
      totalAmount: orderTotal,
      forms: forms,
      orderType: { name: "copyForm" },
    };
    await AsyncStorage.setItem("currentScreen", "SubmitDetails");
    props.navigation.navigate("OrderDetails", {
      details: order,
      screen: "SubmitDetails",
    });
  };
  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          height: height,
          flex: 1,
          opacity: containerOpacity,
        }}
        keyboardShouldPersistTaps="always"
      >
        <Header
          title="Delivery Details"
          backbutton
          goBackFn={_handlePrevious}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            // alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* <Text style={styles.modalText}>
              Your details have been submitted. Please make a payment of Rs.
              <Text style={{ fontWeight: "bold" }}>{orderTotal}</Text> through
              Easypaisa to account#{" "}
              <Text style={{ fontWeight: "bold" }}>03134243117</Text>
            </Text>
            <Text style={styles.modalText}>
              آپ کی تفصیلات جمع کر لی گئی ہیں۔ ایزی پیسہ کے اکاؤنٹ نمبر
              <Text style={{ fontWeight: "bold" }}> 03134243117 </Text> میں{" "}
              <Text style={{ fontWeight: "bold" }}>{orderTotal}</Text> .Rs جمع
              کروائیں۔
            </Text> */}
              <Text style={styles.modalText}>
                Your details have been submitted. Amount would be charged at
                delivery time.
              </Text>
              <Text style={styles.modalText}>
                آپ کی تفصیلات جمع کر لی گئی ہیں. ترسیل کے وقت رقم وصول کی جائے
                گی.
              </Text>
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
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.innerContainer}>
            <View style={[styles.labelContainer, { marginTop: 0 }]}>
              <Text style={styles.label}>Select One</Text>
              {/* <Text style={styles.label}>تاریخ فیصلہ</Text> */}
            </View>
            <OptionButtons
              option1="Normal"
              option2="Urgent"
              _handleOption1={() => _handleDeliveryType(false)}
              _handleOption2={() => _handleDeliveryType(true)}
              active={isUrgent}
            />
            <View style={styles.urgentMessageContainer}>
              <Text
                style={{
                  fontSize: 9,
                  color: isUrgent ? "red" : "white",
                }}
              >
                * Your document would be delivered within 3 days of order with
                some additional charges.
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Expected Delivery Date</Text>
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
            <View style={styles.labelContainer}>
              <Text style={[styles.label, { fontSize: 20 }]}>
                Order Summary
              </Text>
              <TouchableOpacity
                onPress={_handleReview}
                style={styles.editContainer}
              >
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryCell}>Total Copy Forms</Text>
                <Text style={styles.summaryCell}>{totalForms}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryCell}>Order Total</Text>
                <Text style={styles.summaryCell}>{orderTotal}</Text>
              </View>
            </View>
            <View style={styles.deliveryInfoContainer}>
              <Text style={styles.label}>Delivery Details</Text>
              <View style={styles.addressContainer}>
                <Image
                  style={{ height: 20, width: 20, marginRight: 10 }}
                  source={require("../../../../assets/images/static/phone.png")}
                />
                <TextInput
                  style={{
                    width: "85%",
                    borderColor: "gray",
                    height: 40,
                  }}
                  placeholder="Enter Cell Number"
                  onChangeText={(text) => setCellNo({ ...cellNo, value: text })}
                  value={cellNo.value}
                  disabled
                />
              </View>
              <Text style={styles.error}>{cellNo.error}</Text>
              <View style={styles.addressContainer}>
                <Image
                  style={{ height: 25, width: 25, marginRight: 5 }}
                  source={require("../../../../assets/images/static/location.png")}
                />
                <TextInput
                  style={{
                    width: "85%",
                    borderColor: "gray",
                  }}
                  placeholder="Enter address"
                  onChangeText={(text) =>
                    setAddress({ ...address, value: text })
                  }
                  value={address.value}
                  numberOfLines={2}
                  multiline={true}
                  maxLength={100}
                />
              </View>
            </View>
            <Text style={styles.error}>{address.error}</Text>
          </View>
        </ScrollView>

        <View style={styles.submitContainer}>
          <Button style={styles.submit} type="primary" onPress={onSubmit}>
            <Text>SUBMIT</Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>

      <ActivityIndicator
        animating={showLoading}
        toast
        size="large"
        text="Submitting..."
      />
      <ActivityIndicator animating={showWaiting} toast size="small" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
  innerContainer: {
    width: "90%",
    alignSelf: "center",
  },
  sectionContainer: {
    width: "90%",
  },
  sectionTitleContainer: {
    borderBottomColor: PrimaryText,
    borderBottomWidth: 1,
  },
  sctionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: PrimaryText,
  },
  labelContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  labelUrgent: {
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 5,
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
  fab: {
    alignSelf: "flex-end",
    backgroundColor: Secondary,
    marginRight: 16,
    marginTop: 10,
    right: 20,
    bottom: 0,
  },
  submitContainer: {
    flex: 1,
    alignSelf: "flex-end",
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  submit: {
    width: "90%",
    minHeight: 60,
    backgroundColor: "#f44336",
    borderWidth: 0,
    alignSelf: "center",
  },
  reviewContainer: {
    margin: 5,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
  },
  review: {
    width: "50%",
    height: 35,
    backgroundColor: Secondary,
    borderWidth: 0,
    borderRadius: 30,
    alignSelf: "center",
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
    fontSize: 16,
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
  urgentMessage: {
    color: "red",
    fontSize: 11,
  },
  documemntsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginTop: 10,
  },
  deliveryInfoContainer: {
    marginTop: 20,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
  },
  error: {
    color: "red",
    marginLeft: "10%",
  },
  editContainer: {
    backgroundColor: Secondary,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  edit: {
    color: "white",
    fontSize: 14,
  },
  summaryContainer: {
    // backgroundColor: Secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Secondary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  summaryCell: {
    // color: "white",
  },

  expectedDeliveryDate: {
    alignItems: "center",
    borderRadius: 5,
  },
  expectedDeliveryDateText: {
    color: PrimaryText,
    fontSize: 12,
  },
});

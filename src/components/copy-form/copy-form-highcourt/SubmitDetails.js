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
} from "react-native";
import {
  InputItem,
  Tag,
  ActivityIndicator,
  Steps,
  Button
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
import { TextInput, FAB, Switch, Checkbox, Button as PaperButton } from "react-native-paper";
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

import store from "../../../redux/store";

export default function SubmitDetails(props) {
  const [showLoading, setshowLoading] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [switchMode, setSwitchMode] = useState(false);
  const [paymentObject, setpaymentObject] = useState();
  const [orderTotal, setOrderTotal] = useState(0);
  const [cellNo, setCellNo] = useState({ error: "", value: "" });
  const [address, setAddress] = useState({ error: "", value: "" });
  useEffect(() => {
    database.ref("prices/copyForm").once("value", (snapshot) => {
      setpaymentObject(snapshot.val());
    });
    // retrieving user data
    let state = store.getState();
    let user = state.userReducer.user;
    setAddress({value: user.address, error: ""});
    setCellNo({ value: user.cellNo, error: "" });
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let user = state.userReducer.user;
      setAddress({ value: user.address, error: "" });
      setCellNo({ value: user.cellNo, error: "" });
    });
    return () => unsubscribe;
  }, []);
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
  const onSubmit = async () => {
    var isNotValidCellNo = cellNoValidator(cellNo.value);
    var isNotValidAddress = addressValidator(address.value);
    if (isNotValidCellNo || isNotValidAddress){
      setCellNo({ ...cellNo, error: isNotValidCellNo });
      setAddress({...address, error:isNotValidAddress})
    }
    else{
    var totalAmount = 0;
    setshowLoading(true);
    setcontainerOpacity(0.3);
    //Geerates an order no ranging between the parameters
    var orderNo = getRandomArbitrary(1000000, 9999999);
    // Retrieving forms from storage
    let forms;
    try {
      const formsJson = await AsyncStorage.getItem("@forms");
      formsJson != null
        ? (forms = JSON.parse(formsJson))
        : console.log("Error");
    } catch (e) {
      // error reading value
    }
    totalAmount = switchMode
      ? paymentObject.urgentFee * forms.length
      : paymentObject.normalFee * forms.length;
    // retrieving user data
    let state = store.getState();
    let user = state.userReducer.user;
    // Final details ready to be posted
    let orderDetails = {
      applicantName: user.name,
      cellNo: cellNo.value,
      address: address.value,
      forms: forms,
      isUrgent: switchMode,
      status: "Pending",
      progress: {
        pending: Date.now(),
      },
      customerId: user.id,
      createdOn: Date.now(),
      orderNo: orderNo,
      totalAmount: totalAmount,
      orderType: {
        name: "copyForm",
      },
    };
    console.log(orderDetails);
    addForm(orderDetails, addFormCallBack);
    setOrderTotal(totalAmount);
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
    props.navigation.navigate("Payments", { isUrgent: switchMode });
  };
  const toggleSwitch = () => {
    setSwitchMode(!switchMode);
  };
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  // Passes the current order details to Order Details page
  const reviewOrder = async() => {
    let forms;
    try {
      const formsJson = await AsyncStorage.getItem("@forms");
      formsJson != null
        ? (forms = JSON.parse(formsJson))
        : console.log("Error");
    } catch (e) {
      // error reading value
    }
    console.log(forms)
    let order = {
      totalAmount: switchMode
        ? paymentObject.urgentFee * forms.length
        : paymentObject.normalFee * forms.length,
      forms: forms,
      orderType: { name: "copyForm" },
    };
    props.navigation.navigate("OrderDetails", {
      details: order,
      screen: "SubmitDetails",
    });
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title="Copy Form" openDrawerFn={openDrawerFn} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
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
        <View
          style={{
            alignItems: "center",
            opacity: containerOpacity,
            marginTop: 15,
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Submit Details</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                {/* <Text>
                  Copy form would be delivered within 2 days. If you want to get
                  it today, then please tap on the urgent button.
                </Text>
                <Text>
                  نقل فارم 2 دن میں فراہم کیا جائے گا۔ اگر آپ اسے ابھی حاصل کرنا
                  چاہتے ہیں تو برائے مہربانی نیچے بٹن دبائیں۔
                </Text> */}
                {/* <Text style={styles.label}>فوری طور پر درکار</Text> */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.labelUrgent}>Urgently Required</Text>
                  <Switch
                    value={switchMode}
                    onChange={toggleSwitch}
                    color={Secondary}
                    style={{
                      marginTop: 0,
                      marginRight: 15,
                      transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                    }}
                  />
                </View>
                {switchMode ? (
                  <View style={styles.urgentMessageContainer}>
                    <Text style={styles.urgentMessage}>
                      * Your document will be delivered within 24 hours with
                      additional charges.
                    </Text>
                  </View>
                ) : (
                  <View />
                )}
                {/* <Text>{forms.length} 0</Text> */}
              </View>
            </View>
          </View>

          {/* <Text>Do you want to submit another copy form?</Text>
          <FAB
            style={styles.fab}
            small
            icon="plus"
            onPress={() => props.navigation.navigate("CopyFormCase")}
            color={"white"}
          /> */}
          <View style={{ width: 10, height: 50 }} />
          {/* <View style={styles.reviewContainer}>
            <Button
              style={styles.review}
              type="primary"
              onPress={() => props.navigation.navigate("CopyFormHomePage")}
            >
              <Text>Another Form</Text>
            </Button>
          </View> */}

          <PaperButton
            color={Secondary}
            icon="eye"
            mode="contained"
            onPress={reviewOrder}
          >
            Review Order
          </PaperButton>
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
                onChangeText={(text) => setAddress({ ...address, value: text })}
                value={address.value}
                numberOfLines={2}
                multiline={true}
                maxLength={50}
              />
            </View>
            <Text style={styles.error}>{address.error}</Text>
          </View>
          {/* <View style={styles.reviewContainer}>
            
            <Button style={styles.review} type="primary">
              <Text style={{ fontSize: 12 }}>Review Order</Text>
            </Button>
          </View> */}

          <View style={styles.submitContainer}>
            <Button style={styles.submit} type="primary" onPress={onSubmit}>
              <Text>SUBMIT</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
      <ActivityIndicator
        animating={showLoading}
        toast
        size="large"
        text="Submitting..."
      />
    </KeyboardAwareScrollView>
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
  labelUrgent: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    padding:15,
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
    marginTop: height - 590,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
  },
  submit: {
    width: "100%",
    minHeight: 60,
    backgroundColor: "#f44336",
    borderWidth: 0,
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
});

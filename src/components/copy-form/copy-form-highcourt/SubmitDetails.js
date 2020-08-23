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
} from "react-native";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
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
import { TextInput, FAB, Switch, Checkbox } from "react-native-paper";
import {
  addForm,
  login,
  register,
  checkSignedIn,
  logout,
} from "../../../api/firebase/authenication";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { database } from "../../../api/firebase/authenication";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");

import store from "../../../redux/store";

export default function SubmitDetails(props) {
  var val = "";
  let index = 0;
  const districts = [
    { key: index++, section: true, label: "Districts" },
    { key: index++, label: "Lahore" },
    { key: index++, label: "Faisalabad" },
    { key: index++, label: "Sheikhupura" },
  ];
  const [showLoading, setshowLoading] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVisibleFab, setIsVisibleFab] = useState(true);
  const [switchMode, setSwitchMode] = useState(false);
  const [documemnts, setdocumemnts] = useState([{ key: 1, value: "" }]);
  const [isDocumemnt, setDocumemnt] = useState(false);
  const [isPetition, setPetition] = useState(false);
  const [isOrderDated, setOrderDated] = useState(false);
  const [isSOW, setSOW] = useState(false);
  const [paymentObject, setpaymentObject] = useState();
  const [forms, setForms] = useState([]);
  const getForms = async () => {
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
    console.log("FORMS:",forms)
    return forms;
  };
  useEffect(() => {
    database.ref("prices/copyForm").once("value", (snapshot) => {
      setpaymentObject(snapshot.val());
      setForms(getForms());
    });
  }, []);
  // Callback function after adding order
  const addFormCallBack = async (error) => {
    if (error) {
      setshowLoading(false);
      setScroll(true);
      alert("adding failed");
      showModal();
    } else {
      setshowLoading(false);
      setScroll(true);
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
    setshowLoading(true);
    setScroll(false);
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
    // Array to store order details to be saved in db
    var documentDetails = [];
    // Adding checked documents in array
    if (isDocumemnt) {
      documentDetails.push("Document");
    }
    if (isPetition) {
      documentDetails.push("Petition");
    }
    if (isSOW) {
      documentDetails.push("Statement of witness");
    }
    if (isOrderDated) {
      documentDetails.push("Order Dated");
    }
    let totalPayment = 0;
    if (switchMode) {
      console.log("total payment", paymentObject.urgentFee, forms.length);
      totalPayment = paymentObject.urgentFee * forms.length;
    } else {
      totalPayment = paymentObject.normalFee * forms.lenght;
      console.log("total payment", paymentObject.urgentFee, forms.length);
    }
    // Adding document details in array
    // documemnts.map((doc) => documentDetails.push(doc.value));
    console.log("calculations:  ", paymentObject.urgentFee * forms.length);
    console.log(totalPayment);
    // retrieving user data
    let state = store.getState();
    let user = state.userReducer.user;
    let storedUser = await AsyncStorage.getItem("@loggedUser");
    try {
      storedUser = JSON.parse(storedUser);
    } catch (error) {
      console.log("Error in parsing userId ");
    }
    let storedUserId = storedUser.user.uid;
    // Final details ready to be posted
    let orderDetails = {
      applicantName: user.name,
      cellNo: user.cellNo,
      address: user.address,
      forms: forms,
      isUrgent: switchMode,
      status: "Pending",
      progress: {
        pending: new Date().toString(),
      },
      customerId: storedUserId,
      createdOn: new Date().toString(),
      orderNo: orderNo,
      totalAmount: switchMode
        ? paymentObject.urgentFee * forms.length
        : paymentObject.normalFee * forms.length,
      orderType: {
        name: "copyForm",
        court: "highCourt",
      },
    };
    addForm(orderDetails, addFormCallBack);
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
  return (
    <KeyboardAwareScrollView>
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
              Your details have been submitted.
            </Text>
            <Text style={styles.modalText}>
              آپ کی تفصیلات جمع کر لی گئی ہیں۔
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

      <ScrollView scrollEnabled={scroll}>
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
                <Text>
                  Copy form would be delivered within 2 days. If you want to get
                  it today, then please tap on the urgent button.
                </Text>
                <Text>
                  نقل فارم 2 دن میں فراہم کیا جائے گا۔ اگر آپ اسے ابھی حاصل کرنا
                  چاہتے ہیں تو برائے مہربانی نیچے بٹن دبائیں۔
                </Text>
                {/* <Text style={styles.label}>فوری طور پر درکار</Text> */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                  }}
                >
                  <Text style={styles.label}>Urgently Required</Text>
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

          <View style={styles.submitContainer}>
            <Button style={styles.submit} type="primary" onPress={onSubmit}>
              <Text>Submit</Text>
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
  fab: {
    position: "absolute",
    backgroundColor: Secondary,
    marginRight: 16,
    marginTop: 30,
    right: 0,
    bottom: 0,
  },
  submitContainer: {
    margin: 30,
    flex: 1,
    marginTop: height - 450,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
  },
  submit: {
    width: "100%",
    minHeight: 60,
    backgroundColor: Secondary,
    borderWidth: 0,
  },
  stepsContainer: {
    width: "120%",
    alignItems: "center",
    marginTop: 20,
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
});

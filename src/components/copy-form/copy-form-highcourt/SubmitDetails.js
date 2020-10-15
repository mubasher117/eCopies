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
  BackHandler
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
export default function SubmitDetails(props) {
  const [showLoading, setshowLoading] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [cellNo, setCellNo] = useState({ error: "", value: "" });
  const [address, setAddress] = useState({ error: "", value: "" });
  useEffect(() => {
    // retrieving user data
    let state = store.getState();
    let user = state.userReducer.user;
    setAddress({ value: user.address, error: "" });
    setCellNo({ value: user.cellNo, error: "" });
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let user = state.userReducer.user;
      setAddress({ value: user.address, error: "" });
      setCellNo({ value: user.cellNo, error: "" });
      BackHandler.addEventListener("hardwareBackPress", backAction);
    });
    const onBlurScreen = props.navigation.addListener("didBlur", () => {
      console.log("UNFOCUSED");
      backHandler.remove();
    });
    return () => {unsubscribe;
    onBlurScreen;
    backHandler.remove();}
  }, []);
  const backAction = () => {
    console.log("IN BACK HANDLER");
    _handlePrevious();
    return true;
  };
  const _handlePrevious = () => {
    props.navigation.navigate("DeliveryDetails");
  }
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
  const onSubmit = () => {
    getFormPrices().then((prices) => {
      console.log("PRICES:   ", prices);
      _handleRemainingSubmit(prices);
    });
  };
  const _handleRemainingSubmit = async (prices) => {
    var isNotValidAddress = addressValidator(address.value);
    if (isNotValidAddress) {
      setAddress({ ...address, error: isNotValidAddress });
    } else {
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
      let state = store.getState();
      // retrieving user data
      let user = state.userReducer.user;
      let isUrgent = state.ordersReducer.isUrgent;
      // Calculating fee per form and total amount
      var totalAmount = 0;
      if (forms) {
        forms.map((form, index) => {
          try {
            if (isUrgent) {
              console.log(prices);
              totalAmount = totalAmount + parseInt(prices[form.court].urgent);
              form["formFee"] = parseInt(prices[form.court].urgent);
            } else {
              totalAmount = totalAmount + parseInt(prices[form.court].normal);
              form["formFee"] = parseInt(prices[form.court].normal);
            }
          } catch (error) {
            if (isUrgent) {
              console.log(prices);
              totalAmount =
                totalAmount + parseInt(prices["Lower Courts"].urgent);
              form["formFee"] = parseInt(prices["Lower Courts"].urgent);
            } else {
              totalAmount =
                totalAmount + parseInt(prices["Lower Courts"].normal);
              form["formFee"] = parseInt(prices["Lower Courts"].normal);
            }
          }
        });
      }
      console.log("ORDER TOTAL:   ", totalAmount);

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
    props.navigation.navigate("Payments");
  };
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  // Passes the current order details to Order Details page
  const reviewOrder = () => {
    getFormPrices().then((prices) => {
      console.log("PRICES:   ", prices);
      _handleRemainingReview(prices);
    });
  };
  const _handleRemainingReview = async (prices) => {
    var orderTotal = 0;
    let forms;
    let state = store.getState();
    let isUrgent = state.ordersReducer.isUrgent;
    try {
      const formsJson = await AsyncStorage.getItem("@forms");
      formsJson != null
        ? (forms = JSON.parse(formsJson))
        : console.log("Error");
    } catch (e) {
      // error reading value
    }
    console.log(forms);
    // Calculating fee per form and total amount
    if (forms) {
      forms.map((form, index) => {
        try {
          if (isUrgent) {
            console.log(prices);
            orderTotal = orderTotal + parseInt(prices[form.court].urgent);
            form["formFee"] = parseInt(prices[form.court].urgent);
          } else {
            orderTotal = orderTotal + parseInt(prices[form.court].normal);
            form["formFee"] = parseInt(prices[form.court].normal);
          }
        } catch (error) {
          if (isUrgent) {
            console.log(prices);
            orderTotal = orderTotal + parseInt(prices["Lower Courts"].urgent);
            form["formFee"] = parseInt(prices["Lower Courts"].urgent);
          } else {
            orderTotal = orderTotal + parseInt(prices["Lower Courts"].normal);
            form["formFee"] = parseInt(prices["Lower Courts"].normal);
          }
        }
      });
    }
    console.log("ORDER TOTAL:   ", orderTotal);
    let order = {
      totalAmount: orderTotal,
      forms: forms,
      orderType: { name: "copyForm" },
    };
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
        <Header title="Copy Form" backbutton goBackFn={_handlePrevious} />
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
                  {/* <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text style={styles.labelUrgent}>Urgently Required</Text>

                  <Switch
                    value={isUrgent}
                    onChange={toggleSwitch}
                    color={Secondary}
                    style={{
                      marginTop: 0,
                      marginRight: 15,
                      transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                    }}
                  />
                </View> */}

                  {/* <Text>{forms.length} 0</Text> */}
                </View>
              </View>
            </View>
            <View style={{ width: 10, height: 50 }} />

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
                  onChangeText={(text) =>
                    setAddress({ ...address, value: text })
                  }
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
    </>
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
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 15,
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
    alignSelf:'flex-end',
    alignContent:'center',justifyContent:'center',
    width: "100%",
    marginBottom: 20,
  },
  submit: {
    width: "90%",
    minHeight: 60,
    backgroundColor: "#f44336",
    borderWidth: 0,
    alignSelf:'center',
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

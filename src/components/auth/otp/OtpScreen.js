import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
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
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  InputItem,
  Tag,
  ActivityIndicator,
  Steps,
  Tabs,
  Button,
} from "@ant-design/react-native";
import style from '../../../styles/General';
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../../constants/colors";
import { Chip } from "react-native-paper";
import Header from "../../header/Header";
import store from "../../../redux/store";
import OtpStyles from "../../../styles/OtpScreen";
import firebase from "../../registration/firebase";
import { addAdditionalDetails } from "../../../api/firebase/backend";
import { TouchableHighlight } from "react-native-gesture-handler";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import OtpInputs from "../../child-components/OtpInputs";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
export default function HomPage(props) {
  const inputPin1 = useRef(null);
  const inputPin2 = useRef(null);
  const inputPin3 = useRef(null);
  const inputPin4 = useRef(null);
  const inputPin5 = useRef(null);
  const inputPin6 = useRef(null);
  const [pin1, setPin1] = useState(0);
  const [pin2, setPin2] = useState(0);
  const [pin3, setPin3] = useState(0);
  const [pin4, setPin4] = useState(0);
  const [pin5, setPin5] = useState(0);
  const [pin6, setPin6] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);
  const [error, setError] = useState('')
  const [verificationId, setVerificationId] = useState("");
  const recaptchaVerifier = useRef(null);
  const [otp, setOtp] = useState()
  const [emptyOtpCode, setEmptyOtpCode] =useState(false)
  useEffect(() => {
    let verifId = props.navigation.getParam("verifcationId", "N/A");
    setVerificationId(verifId);  
    const unsubscribe = props.navigation.addListener("didFocus", () => {
    let verifId = props.navigation.getParam("verifcationId", "N/A");
    setVerificationId(verifId); 
    })
    return () => unsubscribe;
  }, [])
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const confirmCode = () => {
    if (!otp){
      setEmptyOtpCode(true);
      return
    }
    setshowLoading(true);
    setcontainerOpacity(0.3);
    // Get user details and verificaiton id from previous screens
    const additionalDetails = props.navigation.getParam(
      "additionalDetails",
      "N/A"
    );
    const previousScreen = props.navigation.getParam("screen", "N/A");
    // Sum up otp code from different input fields
    var otpCode = pin1 + pin2 + pin3 + pin4 + pin5 + pin6;
    otpCode = otpCode.toString();
    console.log("OTP CODE", otpCode);
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      otp
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
        setshowLoading(false);
        setcontainerOpacity(1);
        console.log(previousScreen);
        if (previousScreen == "Register") {
          var userDetails = {
            ...additionalDetails,
            id: result.user?.uid,
          };
          addAdditionalDetails(userDetails);
        }
        // Do something with the results here
        console.warn(result);
      })
      .catch((error) => {
        setshowLoading(false);
        setcontainerOpacity(1);
        console.log(error.message);
        if (error.message.includes("SMS code has expired"))
        {
          setError("* Code has expired. Resend code to try again.");
        }
        else if (error.message.includes("phone auth credential is invalid")){
          setError("* The code you entered is invalid.")
        }
          
      });
  };
  const resendCode = () =>{
    const cellNo = props.navigation.getParam(
    "cellNo",
    "N/A"
  );
  new firebase.auth.PhoneAuthProvider()
    .verifyPhoneNumber(cellNo, recaptchaVerifier.current)
    .then((verificationId) => {
      setVerificationId(verificationId)
    });

  }
  //   const navigateTo = (screen) => {
  //     let state = store.getState();
  //     let user = state.userReducer.user;
  //     database.ref("/userData/" + user.id).once("value", (snapshot) => {
  //       if (snapshot.val().balance == 0) {
  //         console.log(snapshot.val());
  //         props.navigation.navigate(screen);
  //       } else {
  //         showModal();
  //       }
  //     });
  //   };
  const showModal = () => {
    setIsModalVisible(true);
    setcontainerOpacity(0.1);
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
    props.navigation.navigate("Payments");
  };
  const getOtp = (otp) => {
        console.log(otp);
        setOtp(otp)
  }
  return (
    <>
      <View style={[styles.container, { opacity: containerOpacity }]}>
        {/* <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end", margin: -15, marginBottom: 10 }}
              onPress={hideModal}
            >
              <Image
                style={styles.modalQuit}
                source={require("../../../assets/images/static/quit.png")}
              />
            </TouchableOpacity>
            <Text style={styles.modalText}>
              Please pay the remaining dues before submitting another form.
            </Text>
            <Text style={styles.modalText}>
              براۓ مہربانی مزید نقل فارم کے لیے اپنے واجبات ادا کریں۔
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
      </Modal> */}
        <ScrollView keyboardShouldPersistTaps="always">
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebase.app().options}
          />
          <View style={OtpStyles.margin} />
          <View style={styles.optionsContainer}>
            <View style={OtpStyles.textContainer}>
              <Text style={OtpStyles.text}>Enter verification code</Text>
            </View>
            <OtpInputs getOtp={(otp) => getOtp(otp)} changeOtp={() => {setEmptyOtpCode(false);
            setError('')

            }} />
            <View style={style.containerTopBottom}>
              {emptyOtpCode && <Text style={style.error}>*Enter Verification Code</Text>}
              <Text style={style.error}>{error}</Text>
            </View>
            <View style={OtpStyles.btnContainer}>
              <Button
                onPress={confirmCode}
                style={OtpStyles.btnVerify}
                type="primary"
              >
                Verify
              </Button>
            </View>
            <View style={style.rowContainer}>
              <View>
                <Text>Didn't receive the OTP?</Text>
              </View>
              <TouchableOpacity onPress={resendCode}>
                <Text style={OtpStyles.resendCode}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    margin: "7%",
    marginBottom: 0,
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
  modalQuit: {
    width: 30,
    height: 30,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
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

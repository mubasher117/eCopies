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
const DocumentDetails = (props) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.valueContainer}>
        <TextInput
          label={"Document " + props.labelValue.toString()}
          selectionColor={Primary}
          underlineColor={PrimaryText}
          onChange={props.onChange}
        />
      </View>
    </View>
  );
};

export default function CopyFormDocs(props) {
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
  useEffect(() => {
    database.ref("prices/copyForm").once("value", (snapshot) => {
      setpaymentObject(snapshot.val());
    });
  }, [paymentObject]);
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
    }
  };
  // Returns random number between 70000000 and 99999999
  function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
  }

  // Verify unique order number
  const getUniqueOrderNumber = async () => {
    var num = getRandomArbitrary();
    var isSame;
    database
      .ref("/testForm")
      .orderByChild("orderNo")
      .equalTo("60167234")
      .once("value", (snapshot) => {
        console.log("Snapshot", snapshot.val());
        if (snapshot.val()) {
          const userData = snapshot.val();
          console.log("exists!", userData);
          isSame = true;
        } else {
          isSame = false;
        }
      });
    if (!isSame) {
      console.log("ORDER NUMBER:   ", num);
      return num.toString();
    } else {
      console.log("GOT SAME:    ", num);
      //getUniqueOrderNumber()
      return "47444";
    }
  };

  const saveDetails = async() => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
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
    let caseDetails;
    try {
      // Retrieving case details from storage
      const caseDetailsJson = await AsyncStorage.getItem("@caseDetails");
      caseDetailsJson != null
        ? (caseDetails = JSON.parse(caseDetailsJson))
        : console.log("Error");
    } catch (e) {
      // error reading value
    }
    // Retrieving case details 2
    let caseDetails2;
    try {
      // Retrieving case and personal details from storage
      const caseDetails2Json = await AsyncStorage.getItem("@caseDetails2");
      caseDetails2Json != null
        ? (caseDetails2 = JSON.parse(caseDetails2Json))
        : console.log("Error");
    } catch (e) {
      // error reading value
    }
    let copyFormDetails = {
      ...caseDetails,
      ...caseDetails2,
      documentDetails,
    };
    console.log("form : ", copyFormDetails);
    let forms;
    try {
      // Retrieving case and personal details from storage
      const formsJson = await AsyncStorage.getItem("@forms");
      if (formsJson){
        forms = JSON.parse(formsJson);
        forms.push(copyFormDetails)
        const jsonValue = JSON.stringify(forms);
        await AsyncStorage.setItem("@forms", jsonValue);
      }else{
        forms = [copyFormDetails]
        const jsonValue = JSON.stringify(forms);
        await AsyncStorage.setItem("@forms", jsonValue);
      }
    } catch (e) {
      // error reading value
    }  
  }
  const onNext = async () => {
    saveDetails();
    props.navigation.navigate("SubmitDetails");
  };
  const goBackFn = () => {
    props.navigation.navigate("CopyFormCase2");
  };
  const addDoc = () => {
    if (documemnts.length < 3) {
      // Deep Copy of documents
      var tempDocs = Array.from(documemnts);
      tempDocs.push({ key: documemnts.length + 1 });
      setdocumemnts(tempDocs);
    } else {
      setIsVisibleFab(false);
      var tempDocs = Array.from(documemnts);
      tempDocs.push({ key: documemnts.length + 1 });
      setdocumemnts(tempDocs);
    }
  };
  const showModal = () => {
    setIsModalVisible(true);
    setcontainerOpacity(0.05);
    console.log(isModalVisible);
  };
  const submitAnotherForm = () => {
    saveDetails();
    props.navigation.navigate("CopyFormCase");
  };
  const applicationSteps = [
    { title: "Personal", title2: "" },
    { title: "Case", title2: "" },
    { title: "Docs", title2: "" },
  ];

  const getUpdatedDictionaryOnchange = (key, value) => {
    console.log("IN UPDATE");
    let tempDict = Array.from(documemnts);
    const index = tempDict.findIndex((temp) => temp.key == key);
    console.log(index);
    tempDict[index].value = value;
    console.log(tempDict);
    return tempDict;
  };
  const toggleSwitch = () => {
    setSwitchMode(!switchMode);
  };
  return (
    <KeyboardAwareScrollView>
      <Header title="Copy Form" backbutton goBackFn={goBackFn} />
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
              Do you want to submit another copy form?
            </Text>
            <Text style={styles.modalSubtext}>
              If you want copy of another case, press Yes
            </Text>
            <View style={styles.modalButtonsContainer}>
              <Button
                style={styles.buttonModalNo}
                type="primary"
                onPress={onNext}
              >
                <Text style={{color:'black'}}>
                No
                </Text>
              </Button>
              <Button
                style={styles.buttonModalYes}
                type="primary"
                onPress={submitAnotherForm}
              >
                Yes
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      {/* <View style={styles.stepsContainer}>
        <Steps size="small" current={1} direction="horizontal">
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
      {/* <Button
        onPress={() => {
          login();
        }}
      >
        Login
      </Button>
      <Button
        onPress={() => {
          register();
        }}
      >
        Register
      </Button>
      <Button
        onPress={() => {
          checkSignedIn();
        }}
      >
        Check
      </Button>
      <Button
        onPress={() => {
          logout();
        }}
      >
        Log Out
      </Button>
       */}
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
              <Text style={styles.sctionTitle}>Document Details</Text>
            </View>

            <View style={styles.infoContainer}>
              <View
                style={[
                  styles.labelContainer,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.label}>Documents</Text>
                <Text style={styles.label}>کاغزات</Text>
              </View>
            </View>
            {/* {documemnts.map((doc) => {
              return (
                <DocumentDetails
                  key={doc.key}
                  labelValue={doc.key}
                  onChange={(e) =>
                    setdocumemnts(
                      getUpdatedDictionaryOnchange(doc.key, e.nativeEvent.text)
                    )
                  }
                />
              );
            })} */}

            <View style={styles.checkboxContainer}>
              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isDocumemnt ? "checked" : "unchecked"}
                  onPress={() => {
                    setDocumemnt(!isDocumemnt);
                  }}
                  color={Secondary}
                />
                <Text>Document</Text>
              </View>

              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isPetition ? "checked" : "unchecked"}
                  onPress={() => {
                    setPetition(!isPetition);
                  }}
                  color={Secondary}
                />
                <Text>Petition</Text>
              </View>

              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isSOW ? "checked" : "unchecked"}
                  onPress={() => {
                    setSOW(!isSOW);
                  }}
                  color={Secondary}
                />
                <Text>Statement of Witness</Text>
              </View>

              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isOrderDated ? "checked" : "unchecked"}
                  onPress={() => {
                    setOrderDated(!isOrderDated);
                  }}
                  color={Secondary}
                />
                <Text>Order Dated</Text>
              </View>
            </View>

            {/* {isVisibleFab ? (
              <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={addDoc}
                color={"white"}
              />
            ) : (
              <View />
            )} */}
          </View>

          <View style={styles.nextContainer}>
            <Button
              style={styles.next}
              type="primary"
              onPress={showModal}
            >
              <Text>Next</Text>
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
  nextContainer: {
    margin: 30,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
  },
  next: {
    width: "40%",
    height: 50,
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
    width: "30%",
    height: 45,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
  },
  buttonModalNo: {
    width: "30%",
    height: 45,
    backgroundColor: "#E6E6E6",
    borderWidth: 0,
    alignSelf: "flex-end",
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

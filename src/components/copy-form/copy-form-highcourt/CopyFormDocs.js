import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
import { TextInput, FAB, Chip, Switch, Checkbox } from "react-native-paper";
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
const { height, width } = Dimensions.get("window");


export default function CopyFormDocs(props) {
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDocumemnt, setDocumemnt] = useState(false);
  const [isPetition, setPetition] = useState(false);
  const [isOrderDated, setOrderDated] = useState(false);
  const [isSOW, setSOW] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());

  // Retreives previous parts of forms, merge it with this part and saves it.
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

  var decisionDate = date.toDateString().toString();
  const showModal = () => {
    setIsModalVisible(true);
    setcontainerOpacity(0.05);
    console.log(isModalVisible);
  };
  const submitAnotherForm = () => {
    saveDetails();
    props.navigation.navigate("CopyFormCase");
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === "ios");
    setDate(currentDate);
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
                <Text style={{ color: "black" }}>No</Text>
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
      <ScrollView >
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

            <View style={styles.checkboxContainer}>
              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isDocumemnt ? "checked" : "unchecked"}
                  onPress={() => {
                    setDocumemnt(!isDocumemnt);
                  }}
                  color={Secondary}
                />
                <Text style={{ fontSize: 16 }}>Document</Text>
              </View>
              <TextInput
                style={{
                  marginLeft: "10%",
                  height: 40,
                  width: "80%",
                  borderColor: "gray",
                }}
                editable={isDocumemnt}
              />

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
              <TouchableOpacity
                style={styles.valueContainer}
                onPress={() => setShowDate(!showDate)}
                disabled = {!isOrderDated}
              >
                <Chip
                  style={{
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                  textStyle={{
                    color: PrimaryText,
                    fontSize: 12,
                  }}
                >
                  {decisionDate}
                </Chip>
                {showDate && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.nextContainer}>
            <Button style={styles.next} type="primary" onPress={showModal}>
              <Text>Next</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
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
    width: '80%',
    alignSelf: 'center',
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
  infoContainer:{
    marginBottom: 15
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
    marginTop: 15,
  },
  checkboxContainer: {
    marginTop: 10,
  },
});

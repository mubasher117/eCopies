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
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import {
  InputItem,
  Tag,
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
} from "../../../constants/colors";
import AsyncStorage from "@react-native-community/async-storage";
import ModalPicker from "react-native-modal-picker";
import { TextInput, Chip, FAB } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../../components/header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import store from "../../../redux/store";
const { height, width } = Dimensions.get("window");
var index = 0;
const courts = [
  { key: index++, section: true, label: "Select Court", value: "-1" },
  { key: index++, label: "Civil Court", value: "Civil Court" },
  { key: index++, label: "Banking Court", value: "Banking Court" },
  { key: index++, label: "Ravi Court", value: "Ravi Court" },
  { key: index++, label: "Gulberg", value: "Gulberg" },
  { key: index++, label: "Nishter Court", value: "Nishter Court" },
  { key: index++, label: "Aziz Bhatti Court", value: "Aziz Bhatti Court" },
  {
    key: index++,
    label: "Data Gunj Bakhs Court",
    value: "Data Gunj Bakhs Court",
  },
];
export default function SelectCourt(props) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [court, setCourt] = useState("-1");
  const [courtError, setCourtError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);
  var registerDate = date.toDateString().toString();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(!show);
  };
  // Retreives previous parts of forms, merge it with this part and saves it.
  const _handleNext = () => {
    if (court == "-1") {
      setCourtError(true);
    } else {
      console.log(court)
      store.dispatch({ type: "setCurrentFormItem", payload: {court: court} });
      props.navigation.navigate("LowerCourtsForm1");
    }
  }
  const saveDetails = () =>
    new Promise(async (resolve, reject) => {
      let state = store.getState();
      let formDetails = state.ordersReducer.currentForm;
      let copyFormDetails = {
        ...formDetails,
        court: court,
      };
      console.log("form : ", copyFormDetails);
      let forms;
      try {
        // Retrieving previous forms from storage
        const formsJson = await AsyncStorage.getItem("@forms");
        if (formsJson) {
          forms = JSON.parse(formsJson);
          forms.push(copyFormDetails);
          const jsonValue = JSON.stringify(forms);
          await AsyncStorage.setItem("@forms", jsonValue);
        } else {
          forms = [copyFormDetails];
          const jsonValue = JSON.stringify(forms);
          await AsyncStorage.setItem("@forms", jsonValue);
        }
      } catch (e) {
        // error reading value
      }
      // Clear pervious form
      store.dispatch({
        type: "clearForm",
      });
      setCourt("-1");
      resolve();
    });
  // Function triggered on pressing next button
  const onNext = async () => {
    setshowLoading(true);
    setIsModalVisible(false);
    saveDetails().then(async () => {
      setcontainerOpacity(1);
      setshowLoading(false);
      props.navigation.navigate("SubmitDetails");
    });
  };
  const goBackFn = () => {
    props.navigation.navigate("RevenueCopyForm");
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
  };
  const showModal = () => {
    if (court == "-1") {
      setCourtError(true);
    } else {
      setIsModalVisible(true);
      setcontainerOpacity(0.05);
    }
  };
  const submitAnotherForm = () => {
    setshowLoading(true);
    setIsModalVisible(false);
    saveDetails().then(() => {
      setcontainerOpacity(1);
      setshowLoading(false);
      props.navigation.navigate("RevenueCopyForm");
    });
  };
  const courtList = () => {
    return courts.map((x, i) => {
      return <Picker.Item label={x.label} key={i} value={x.value} />;
    });
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title="All Lower Courts" backbutton goBackFn={goBackFn} />
      <View
        style={{
          alignItems: "center",
          opacity: containerOpacity,
          marginTop: 15,
        }}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sctionTitle}>Court Selection</Text>
          </View>
          <View style={styles.infoContainer}>
            <View
              style={[
                styles.labelContainer,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
            >
              <Text style={styles.label}>Courts</Text>
              <Text style={styles.label}>ٹاؤن</Text>
            </View>
            <View
              style={[
                styles.valueContainer,
                {
                  backgroundColor: InputBackground,
                },
              ]}
            >
              {Platform.OS === "ios" ? (
                <ModalPicker
                  data={courts}
                  initValue="Select Court"
                  onChange={(option) => {
                    setCourt(option.value);
                  }}
                />
              ) : (
                <Picker
                  selectedValue={court}
                  style={{
                    height: 50,
                    width: "100%",
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    setCourt(itemValue);
                    setCourtError(false);
                  }}
                >
                  {courtList()}
                </Picker>
              )}
            </View>
            {courtError && (
              <Text style={styles.error}>* Please select one court</Text>
            )}
          </View>

          <View
            style={{
              width: "100%",
              height: 0,
            }}
          />
        </View>
        <View
          style={{
            margin: 30,
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            width: "90%",
          }}
        >
          <Button style={styles.next} type="primary" onPress={_handleNext}>
            Next
          </Button>
        </View>
      </View>
      <ActivityIndicator animating={showLoading} toast size="large" />
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
  fab: {
    position: "absolute",
    backgroundColor: Secondary,
    marginRight: 16,
    marginTop: 30,
    right: 0,
    bottom: 0,
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
  modalQuit: {
    width: 30,
    height: 30,
  },
  error: {
    color: "red",
    marginLeft: 5,
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
    width: "40%",
    height: 45,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
  },
  buttonModalNo: {
    width: "40%",
    height: 45,
    backgroundColor: "#E6E6E6",
    borderWidth: 0,
    alignSelf: "flex-end",
  },
});

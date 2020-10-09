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
  { key: index++, label: "Session Court", value: "Session Court" },
  { key: index++, label: "Banking Court", value: "Banking Court" },
  {
    key: index++,
    label: "Anti Terrorist Court",
    value: "Anti Terrorist Court",
  },
  // {
  //   key: index++,
  //   label: "Anti Corruption Court",
  //   value: "Anti Corruption Court",
  // },
  { key: index++, label: "Magistrate Court", value: "Magistrate Court" },
  { key: index++, label: "NAB Court", value: "NAB Court" },
  { key: index++, label: "Labour Court", value: "Labour Court" },
  { key: index++, label: "Consumer Court", value: "Consumer Court" },
  { key: index++, label: "Drug Court", value: "Drug Court" }
];
export default function SelectCourt(props) {
  const [court, setCourt] = useState("-1");
  const [courtError, setCourtError] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);
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
  const goBackFn = () => {
    props.navigation.navigate("CopyFormHomePage");
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
              <Text style={styles.label}>Court</Text>
              <Text style={styles.label}>عدالت</Text>
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

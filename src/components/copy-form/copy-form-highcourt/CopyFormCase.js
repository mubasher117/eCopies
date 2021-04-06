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
  BackHandler,
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
import { TextInput, Chip, FAB } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import store from "../../../redux/store";
import OptionButtons from "../../../components/child-components/OptionButtons";
import { caseNumberValidator } from "../../core/utils";
const { height, width } = Dimensions.get("window");
export default function CopyFormCase(props) {
  const previousScreen = props.navigation.getParam("screen", "N/A");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [caseNo, setcaseNo] = useState({ value: "", error: "" });
  const [caseNumberPrefix, setCaseNumberPrefix] = useState("WP");
  const [headerTitle, setHeaderTitle] = useState("");
  const [bench, setBench] = useState("Lahore Bench");
  const [caseStatus, setCaseStatus] = useState("Running");
  useEffect(() => {
    let state = store.getState();
    // Getting selected court name to display on header
    let title = state.ordersReducer.currentForm.court;
    console.log(state.ordersReducer.currentForm);
    setHeaderTitle(title);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      setCaseStatus("Running");
      setCaseNumberPrefix("WP")
      let state = store.getState();
      let form = state.ordersReducer.currentForm;
      let title = state.ordersReducer.currentForm.court;
      setHeaderTitle(title);
      setcaseNo(
        form.caseNo
          ? { value: form.caseNo, error: false }
          : { value: "", error: false }
      );
      setDate(form.decisionDate ? new Date(form.decisionDate) : new Date());
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
  }, [props.navigation]);
  const backAction = () => {
    props.navigation.navigate("CopyFormHomePage");
    return true;
  };
  var decisionDate = date.toDateString();
  decisionDate = decisionDate.substring(4, decisionDate.length);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(!show);
  };

  // Function triggered on pressing next button
  const goNext = async () => {
    const caseNumberError = caseNumberValidator(caseNo.value);
    if (caseNumberError) {
      setcaseNo({ value: caseNo.value + "/", error: caseNumberError });
    } else {
      const details = {
        caseNo: caseNumberPrefix + " No. "+ caseNo.value,
        decisionDate: decisionDate,
        court: previousScreen,
        bench: bench,
        caseStatus: caseStatus,
      };
      store.dispatch({ type: "setCurrentFormItem", payload: details });
      props.navigation.navigate("CopyFormCase2");
    }
  };
  // Function to open drawer
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title={headerTitle} openDrawerFn={openDrawerFn} />
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.innerContainer}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Case Information</Text>
            </View>
            {headerTitle == "High Court" && (
              <View
                style={[
                  styles.infoContainer,
                  {
                    marginTop: 20,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.label}>Select Bench</Text>
                </View>
                <Picker
                  selectedValue={bench}
                  style={styles.benchDropdown}
                  onValueChange={(itemValue, itemIndex) => {
                    setBench(itemValue);
                  }}
                >
                  <Picker.Item label="Lahore Bench" value="Lahore Bench" />
                  <Picker.Item
                    label="Rawalpindi Bench"
                    value="Rawalpindi Bench"
                  />
                  <Picker.Item label="Multan Bench" value="Multan Bench" />
                  <Picker.Item
                    label="Bhawalpur Bench"
                    value="Bhawalpur Bench"
                  />
                </Picker>
              </View>
            )}
            <View style={styles.infoContainer}>
              <View style={styles.labelContainerWithTranslation}>
                <Text style={styles.label}>Case Number</Text>
                <Text style={styles.label}>کیس نمبر</Text>
              </View>
              <View style={styles.valueContainerMultiple}>
                {headerTitle == "High Court" && (
                  <Picker
                    selectedValue={caseNumberPrefix}
                    style={styles.pickerSmaller}
                    onValueChange={(itemValue, itemIndex) => {
                      setCaseNumberPrefix(itemValue);
                    }}
                  >
                    <Picker.Item label="WP" value="WP" />
                    <Picker.Item label="CR" value="CR" />
                    <Picker.Item label="Crl.A" value="Crl.A" />
                    <Picker.Item label="Crl.R" value="Crl.R" />
                    <Picker.Item label="RFA" value="RFA" />
                    <Picker.Item label="RSA" value="RSA" />
                    <Picker.Item label="TA" value="TA" />
                  </Picker>
                )}
                <TextInput
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder="case number / year"
                  value={caseNo.value}
                  onChange={(e) =>
                    setcaseNo({ value: e.nativeEvent.text, error: false })
                  }
                  keyboardType="default"
                  error={caseNo.error}
                  maxLength={20}
                  style={{
                    width: headerTitle == "High Court" ? "65%" : "100%",
                  }}
                />
              </View>
              <Text style={styles.error}>{caseNo.error}</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.labelContainerWithTranslation}>
                <Text style={styles.label}>Select Case Status</Text>
              </View>
              <OptionButtons
                option1="Running"
                option2="Decided"
                _handleOption1={() => setCaseStatus("Running")}
                _handleOption2={() => setCaseStatus("Decided")}
                active={caseStatus == "Running" ? false : true}
              />
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainerWithTranslation}>
                <Text style={styles.label}>
                  Date of {caseStatus == "Running" && "Last "}Decision
                </Text>
                <Text style={styles.label}>
                  {caseStatus == "Running"
                    ? "آخری فیصلے کی تاریخ"
                    : "فیصلے کی تاریخ"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.valueContainer}
                onPress={showDatepicker}
              >
                <Chip
                  style={{
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                  textStyle={{
                    color: PrimaryText,
                    fontSize: 16,
                    padding: 10,
                  }}
                >
                  {decisionDate}
                </Chip>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%", height: 55 }} />
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
            <Button style={styles.next} type="primary" onPress={goNext}>
              Next
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
  innerContainer: {
    alignItems: "center",
    marginTop: 15,
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
  labelContainerWithTranslation: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  valueContainer: {
    marginTop: 10,
  },
  valueContainerMultiple: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  pickerSmaller: {
    height: 50,
    width: "35%",
  },
  value: {
    marginLeft: "-5%",
    padding: 10,
    borderBottomWidth: 2,
  },
  benchDropdown: {
    height: 50,
    width: "100%",
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
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
});

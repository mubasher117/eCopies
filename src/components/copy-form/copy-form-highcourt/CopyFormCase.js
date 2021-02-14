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
const { height, width } = Dimensions.get("window");
export default function CopyFormCase(props) {
  const previousScreen = props.navigation.getParam("screen", "N/A");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [caseNo, setcaseNo] = useState({ value: "", error: false });
  const [headerTitle, setHeaderTitle] = useState("");
  const [bench, setBench] = useState("Lahore Bench");
  useEffect(() => {
    let state = store.getState();
    // Getting selected court name to display on header
    let title = state.ordersReducer.currentForm.court;
    console.log(state.ordersReducer.currentForm);
    setHeaderTitle(title);
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let form = state.ordersReducer.currentForm;
      let title = state.ordersReducer.currentForm.court;
      setHeaderTitle(title);
      console.log("FOUND FORM IN REDUCER:   ", form);
      setcaseNo(
        form.caseNo
          ? { value: form.caseNo, error: false }
          : { value: "", error: false }
      );
      setDate(form.decisionDate ? new Date(form.decisionDate) : new Date());
    });
    return () => unsubscribe;
  }, [props.navigation]);
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
    if (caseNo.value != "") {
      const details = {
        caseNo: caseNo.value,
        decisionDate: decisionDate,
        court: previousScreen,
        bench: bench
      };
      store.dispatch({ type: "setCurrentFormItem", payload: details });
      props.navigation.navigate("CopyFormCase2");
    } else {
      setcaseNo({ ...caseNo, error: true });
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
        <View
          style={{
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Case Information</Text>
            </View>
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
                style={{
                  height: 50,
                  width: "100%",
                }}
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
                <Picker.Item label="Bhawalpur Bench" value="Bhawalpur Bench" />
              </Picker>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>کیس نمبر</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Case No"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder="CP14580/2020"
                  value={caseNo.value}
                  onChange={(e) =>
                    setcaseNo({ value: e.nativeEvent.text, error: false })
                  }
                  keyboardType="default"
                  error={caseNo.error}
                  maxLength={20}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View
                style={[
                  styles.labelContainer,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.label}>Date of Decision</Text>
                <Text style={styles.label}>تاریخ فیصلہ</Text>
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
});

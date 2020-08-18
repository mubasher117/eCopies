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
  TouchableOpacity
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
import {
  addForm,
  login,
  register,
  logout,
} from "../../../api/firebase/authenication";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../header/Header";
import AsyncStorage from "@react-native-community/async-storage";
import ModalPicker from "react-native-modal-picker";
import { NavigationActions } from "react-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableHighlight } from "react-native-gesture-handler";

const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
export default function CopyFormCase(props) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [datePucca, setDatePucca] = useState(new Date());
  const [showPucca, setShowPucca] = useState(false);
  const [showLoading, setshowLoading] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [caseNo, setcaseNo] = useState("");
  const [judges, setJudges] = useState([{ key: 1, value: '' }]);
  const [isVisibleFab, setIsVisibleFab] = useState(true);
  useEffect(() => {
    return () => {};
  }, []);
  const addJudge = () => {
    if (judges.length < 2) {
      // Deep Copy of documents
      var tempJudges = Array.from(judges);
      tempJudges.push({ key: judges.length + 1 });
      setJudges(tempJudges);
    } else {
      var tempJudges = Array.from(judges);
      tempJudges.push({ key: judges.length + 1 });
      setJudges(tempJudges);
      setIsVisibleFab(false);
    }
  };
  var decisionDate = date.toDateString().toString();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(!show);
  };
  const goBackFn = () => {
    props.navigation.navigate("CopyForm");
  };

  const applicationSteps = [
    { title: "Personal", title2: "" },
    { title: "Case", title2: "" },
    { title: "Docs", title2: "" },
  ];
  // Function triggered on pressing next button
  const goNext = async () => {
    const details = {
      caseNo: caseNo,
      decisionDate: decisionDate,
    }
    try {
        const jsonValue = JSON.stringify(details);
        await AsyncStorage.setItem("@caseDetails", jsonValue);
      } catch (e) {
        console.log(e);
      }
    props.navigation.navigate("CopyFormCase2");
  };
  const getUpdatedDictionaryOnchange = (key, value) => {
    let tempDict = Array.from(judges);
    const index = tempDict.findIndex(temp => temp.key == key)
    console.log(index)
    tempDict[index].value = value
    return tempDict
  }
  // Function to open drawer
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  return (
    <KeyboardAwareScrollView>
      <Header title="Copy Form" openDrawerFn={openDrawerFn} />
      {/* <View style={styles.stepsContainer}>
        <Steps size="small" current={0} direction="horizontal">
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
              <Text style={styles.sctionTitle}>Case Information</Text>
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
                  value={caseNo}
                  onChange={(e) => setcaseNo(e.nativeEvent.text)}
                  keyboardType="default"
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
                <Text style={styles.label}>Date of decision</Text>
                <Text style={styles.label}>تاریخ فیصلہ</Text>
              </View>
              <TouchableOpacity style={styles.valueContainer}
                  onPress={showDatepicker}>
                <Chip
                  style={{
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                  textStyle={{
                    color: PrimaryText,
                    fontSize: 16,
                    padding: 10
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
            {/* {isVisibleFab ? (
              <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={addJudge}
                color={"white"}
              />
            ) : (
              <View />
            )} */}
            {/* <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>District</Text>
              </View>
              <View
                style={[
                  styles.valueContainer,
                  { backgroundColor: InputBackground },
                ]}
              >
                {Platform.OS === "ios" ? (
                  <ModalPicker
                    data={districts}
                    initValue="Select District"
                    onChange={(option) => {
                      setDistrict(option);
                    }}
                  />
                ) : (
                  <Picker
                    selectedValue={district}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(itemValue, itemIndex) =>
                      setDistrict(itemValue)
                    }
                  >
                    <Picker.Item label="Select Distrtict" value="-1" />
                    <Picker.Item label="Lahore" value="Lahore" />
                    <Picker.Item label="Sheikhupura" value="Sheikhupura" />
                    <Picker.Item label="Faisalabad" value="Faisalabad" />
                  </Picker>
                )}
              </View>
            </View> */}
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

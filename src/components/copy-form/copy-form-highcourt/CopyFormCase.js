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
import { TextInput, Chip } from "react-native-paper";
import {
  addForm,
  login,
  register,
  checkSignedIn,
  logout,
} from "../../../api/firebase/authenication";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../child-components/header";
import ModalPicker from "react-native-modal-picker";
import { NavigationActions } from "react-navigation";

const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
export default function CopyFormCase(props) {
  var val = "";
  let index = 0;
  const districts = [
    { key: index++, section: true, label: "Districts" },
    { key: index++, label: "Lahore" },
    { key: index++, label: "Faisalabad" },
    { key: index++, label: "Sheikhupura" },
  ];
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [datePucca, setDatePucca] = useState(new Date());
  const [showPucca, setShowPucca] = useState(false);
  const [showLoading, setshowLoading] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [caseNo, setcaseNo] = useState("");
  const [isModalVisible, setISModalVisible] = useState(false);
  const [district, setDistrict] = useState(undefined);
  useEffect(() => {
    return () => {};
  }, []);
  const onChangeDistrict = (value) => {
    setDistrict(val);
  };
  const toggleModal = () => setISModalVisible(!isModalVisible);
  var kucchaDate = date.toDateString().toString();
  var puccaDate = datePucca.toDateString().toString();
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
  return (
    <SafeAreaView behaviour="padding" style={styles.container}>
      <Header title="Copy Form" backbutton goBackFn={goBackFn} />
      <View style={styles.stepsContainer}>
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
      </View>
      <ScrollView scrollEnabled={scroll} contentOffset={{x:0, y:40}}>
        <View
          style={{
            alignItems: "center",
            opacity: containerOpacity,
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Case Information</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Case No"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder="XX-XXX-XX"
                  value={caseNo}
                  onChange={(e) => setcaseNo(e.target.value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Date of decision</Text>
              </View>
              <View style={styles.valueContainer}>
                <Chip
                  onPress={showDatepicker}
                  style={{
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                  textStyle={{
                    color: PrimaryText,
                    fontSize: 16,
                  }}
                >
                  {kucchaDate}
                </Chip>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Judges</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Mr. Justice"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Mr. Justice"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Mr. Justice"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}></View>
            </View>
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
            <Button
              style={styles.next}
              type="primary"
              onPress={() => {
                props.navigation.navigate("CopyFormDocs");
              }}
            >
              Next
            </Button>
          </View>
        </View>
        <View style={{ width: "100%", height: 200 }} />
      </ScrollView>
      <ActivityIndicator
        animating={showLoading}
        toast
        size="large"
        text="Submitting..."
      />
    </SafeAreaView>
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
});

import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Picker,
  SafeAreaView,
} from "react-native";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
} from "../../../constants/colors";
import { TextInput, Chip, Modal, Portal, Provider } from "react-native-paper";
import { addForm } from "../../../api/firebase/authenication";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../header/Header";
const { height, width } = Dimensions.get("window");
// import ModalPicker from "react-native-modal-picker";
export default function CopyFormDC(props) {
  var val = "";
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
  const showDatepickerPucca = () => {
    setShowPucca(!showPucca);
  };
  const addUserCallBack = (error) => {
    if (error) {
      setshowLoading(false);
      setScroll(true);
      setcontainerOpacity(1);
      alert("adding failed");
    } else {
      setshowLoading(false);
      setScroll(true);
      setcontainerOpacity(1);
      toggleModal();
    }
  };
  const onSubmit = () => {
    setshowLoading(true);
    setScroll(false);
    setcontainerOpacity(0.3);
    setTimeout(() => {
      setshowLoading(false);
      setScroll(true);
      setcontainerOpacity(1);
    }, 200);
  };
  let index = 0;
  const districts = [
    { key: index++, section: true, label: "Districts" },
    { key: index++, label: "Data Gunj Bakhs town" },
    { key: index++, label: "Lahore" },
    { key: index++, label: "Faisalabad" },
    { key: index++, label: "Sheikhupura" },
  ];
    const openDrawerFn = () => {
      props.navigation.toggleDrawer();
    };
  return (
    <SafeAreaView behaviour="padding" style={styles.container}>
      <Header title="Copy Form from DC" openDrawerFn={openDrawerFn}/>

      <ScrollView scrollEnabled={scroll}>
        <ActivityIndicator
          animating={showLoading}
          toast
          size="large"
          text="Submitting..."
        />
        <View
          style={{
            alignItems: "center",
            opacity: containerOpacity,
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Personal Information</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Applicant's Name"
                  selectionColor={Primary}
                  underlineColor={Primary}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Address"
                  selectionColor={Primary}
                  underlineColor={Primary}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Cell No"
                  selectionColor={Primary}
                  underlineColor={Primary}
                />
              </View>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Case Information</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Document Number"
                  selectionColor={Primary}
                  underlineColor={Primary}
                  placeholder="XX-XXX-XX"
                  value={caseNo}
                  onChange={(e) => setcaseNo(e.target.value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Bahi Number"
                  selectionColor={Primary}
                  underlineColor={Primary}
                  placeholder="XX-XXX-XX"
                  value={caseNo}
                  onChange={(e) => setcaseNo(e.target.value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Jild Number"
                  selectionColor={Primary}
                  underlineColor={Primary}
                  placeholder="XX-XXX-XX"
                  value={caseNo}
                  onChange={(e) => setcaseNo(e.target.value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Date</Text>
              </View>
              <View style={styles.valueContainer}>
                <Chip
                  onPress={showDatepicker}
                  style={{ alignItems: "center", borderRadius: 5 }}
                  textStyle={{ color: Primary, fontSize: 16 }}
                >
                  {kucchaDate}
                </Chip>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    onBlur={() => {
                      alert("jfj");
                    }}
                  />
                )}
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Town</Text>
              </View>
              <View
                style={[
                  styles.valueContainer,
                  { backgroundColor: InputBackground },
                ]}
              >
                {Platform.OS === "ios" ? (
                  // <ModalPicker
                  //   data={districts}
                  //   initValue="Select District"
                  //   onChange={(option) => {
                  //     setDistrict(option);
                  //   }}
                  // />
                  <View/>
                ) : (
                  <Picker
                    selectedValue={district}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(itemValue, itemIndex) =>
                      setDistrict(itemValue)
                    }
                  >
                    <Picker.Item label="Select Distrtict" value="-1" />
                    <Picker.Item label="Data Gunj Bakhs Town" value="Lahore" />
                    <Picker.Item label="Sheikhupura" value="Sheikhupura" />
                    <Picker.Item label="Faisalabad" value="Faisalabad" />
                  </Picker>
                )}
              </View>
            </View>
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
              style={{ width: 150, height: 50, backgroundColor: Secondary }}
              type="primary"
              onPress={onSubmit}
            >
              Submit
            </Button>
          </View>
        </View>
        <View style={{ width: "100%", height: 100 }} />
      </ScrollView>
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
    marginTop: 20,
  },
  sectionTitleContainer: {
    borderBottomColor: Primary,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  sctionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: Primary,
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
});

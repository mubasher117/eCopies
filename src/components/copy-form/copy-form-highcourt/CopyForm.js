import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  Keyboard,
  Picker,
  ScrollView,
  KeyboardAvoidingView,
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
import AsyncStorage from "@react-native-community/async-storage";
import Header from "../../header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import store from "../../../redux/store";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
export default function CopyForm(props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cellNo, setCellNo] = useState("");
  let index = 0;
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const applicationSteps = [
    { title: "Personal", title2: "" },
    { title: "Case", title2: "" },
    { title: "Docs", title2: "" },
  ];
  const goNext = async () => {
    const details = {
      name: name,
      address: address,
      cellNo: cellNo,
    };
    store.dispatch({ type: "setCurrentFormItem", payload: details });
    const jsonValue = JSON.stringify(details);
    try {
      await AsyncStorage.setItem("@personalDetails", jsonValue);
    } catch (e) {
      console.log(e);
    }
    props.navigation.navigate("CopyFormCase");
  };

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <View style={styles.container}>
        <Header title="High Court" openDrawerFn={openDrawerFn} />
        {/* Application Steps */}
        <View style={styles.stepsContainer}>
          <Steps size="small" current={-1} direction="horizontal">
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
        <View
          style={{
            alignItems: "center",
          }}
        >
          {/* Personal Information Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Personal Information</Text>
            </View>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
              <View style={styles.infoContainer}>
                <View style={styles.valueContainer}>
                  <TextInput
                    label="Applicant's Name"
                    selectionColor={Primary}
                    underlineColor={PrimaryText}
                    onChange={(e) => setName(e.nativeEvent.text)}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
            <View style={styles.infoContainer}>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Address"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  onChange={(e) => setAddress(e.nativeEvent.text)}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={[styles.valueContainer]}>
                <TextInput
                  label="Cell No"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  onChange={(e) => setCellNo(e.nativeEvent.text)}
                />
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
            <Button style={styles.next} type="primary" onPress={goNext}>
              Next
            </Button>
          </View>
        </View>
      </View>
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
    marginLeft: 0,
  },
});

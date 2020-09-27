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
import { Parties } from "../../../components/child-components/Parties";
import DateOfDecision from "../../../components/child-components/DateOfDecision";
import OptionButtons from "../../../components/child-components/OptionButtons";
import SectionTitle from "../../../components/child-components/SectionTitle";
import BottomButtonsNav from "../../../components/child-components/BottomButtonsNav";
import { nameValidator2 } from "../../../components/core/utils";

const { height, width } = Dimensions.get("window");
var index = 0;
export default function CopyForm1(props) {
  const [judge, setJudge] = useState({ value: "", error: "" });
  const [policeStation, setPoliceStation] = useState({
    value: "",
    error: "",
  });
  const [firNo, setFirno] = useState({
    value: "",
    error: "",
  });
  const [category, setCategory] = useState("civil");
  const [headerTitle, setHeaderTitle] = useState("");
  useEffect(() => {
    let state = store.getState();
    // Getting selected court name to display on header
    let title = state.ordersReducer.currentForm.court;
    setHeaderTitle(title);
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let form = state.ordersReducer.currentForm;
      let title = form.court;
      setJudge(
        form.judge ? { value: form.judge, error: "" } : { value: "", error: "" }
      );
      setFirno(
        form.policeStation
          ? { value: form.policeStation, error: "" }
          : { value: "", error: "" }
      );
      setPoliceStation(
        form.firNo ? { value: form.firNo, error: "" } : { value: "", error: "" }
      );
      setHeaderTitle(title);
    });
    return () => unsubscribe;
  }, []);
  // Retreives previous parts of forms, merge it with this part and saves it.
  const _handleNext = () => {
    var judgeError = nameValidator2(judge.value);
    var psError = "";
    var firError = "";
    if (category != "civil") {
      psError =
        policeStation.value == ""
          ? "* Police Station name cannot be empty"
          : "";
      firError = firNo.value == "" ? "* FIR number cannot be empty" : "";
    }
    if (judgeError || psError || firError) {
      setJudge({ ...judge, error: judgeError });
      setFirno({ ...firNo, error: firError });
      setPoliceStation({ ...policeStation, error: psError });
    } else {
      let details = {
        judge: judge.value,
        category: category,
        policeStation: policeStation.value,
        firNo: firNo.value,
      };
      store.dispatch({ type: "setCurrentFormItem", payload: details });
      props.navigation.navigate("LowerCourtsForm2");
    }
  };
  const _handlePrevious = () => {
    props.navigation.navigate("LowerCourtsSelectCourt");
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title={headerTitle} backbutton goBackFn={_handlePrevious} />
      <View style={styles.container}>
        <SectionTitle title="Category Details" />
        <OptionButtons
          option1="Civil"
          option2="Criminal"
          setCategory={(cat) => setCategory(cat)}
        />
        {category != "civil" && (
          <View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>کیس نمبر</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Police Station"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder="CP14580/2020"
                  value={policeStation.value}
                  onChange={(e) =>
                    setPoliceStation({
                      value: e.nativeEvent.text,
                      error: "",
                    })
                  }
                  keyboardType="default"
                  error={policeStation.error}
                  maxLength={20}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>کیس نمبر</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="FIR Number"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder="CP14580/2020"
                  value={firNo.value}
                  onChange={(e) =>
                    setFirno({ value: e.nativeEvent.text, error: "" })
                  }
                  keyboardType="default"
                  error={firNo.error}
                  maxLength={20}
                />
              </View>
            </View>
          </View>
        )}
        <View style={styles.infoContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>کیس نمبر</Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput
              label="Judge"
              selectionColor={Primary}
              underlineColor={PrimaryText}
              placeholder="CP14580/2020"
              value={judge.value}
              onChange={(e) =>
                setJudge({ value: e.nativeEvent.text, error: "" })
              }
              keyboardType="default"
              error={judge.error}
              maxLength={20}
            />
          </View>
        </View>
        <BottomButtonsNav next={_handleNext} previous={_handlePrevious} />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
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
});

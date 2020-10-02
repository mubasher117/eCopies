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
import BottomButtonsNav from "../../../components/child-components/BottomButtonsNav";
import { nameValidator2 } from "../../../components/core/utils";
const { height, width } = Dimensions.get("window");
var index = 0;
export default function CopyForm1(props) {
  const [headerTitle, setHeaderTitle] = useState("");
  const [plaintiff, setPlaintiff] = useState({ value: "", error: "" });
  const [defendant, setDefendant] = useState({ value: "", error: "" });
  const [dateOfDecision, setDateOfDecision] = useState(new Date());
  useEffect(() => {
    let state = store.getState();
    // Getting selected court name to display on header
    let title = state.ordersReducer.currentForm.court;
    setHeaderTitle(title);
    const unsubscribe = props.navigation.addListener("didFocus", () => {
       let state = store.getState();
       let form = state.ordersReducer.currentForm;
       let title = form.court;

      setPlaintiff(
        form.plaintiff
          ? { value: form.plaintiff, error: "" }
          : { value: "", error: "" }
      );
      setDefendant(
        form.defendant
          ? { value: form.defendant, error: "" }
          : { value: "", error: "" }
      );
      setDateOfDecision()
      setHeaderTitle(title);
    });
    return () => unsubscribe;
  }, []);
  const _handleNext = () => {
    var plaintiffError = nameValidator2(plaintiff.value);
    var defendantError = nameValidator2(defendant.value);
    if (plaintiffError || defendantError) {
      setPlaintiff({ ...plaintiff, error: plaintiffError });
      setDefendant({ ...defendant, error: defendantError });
    } else {
      var details = {
        plaintiff: plaintiff.value,
        defendant: defendant.value,
        decisionDate: dateOfDecision,
      };
      store.dispatch({ type: "setCurrentFormItem", payload: details });
      props.navigation.navigate("LowerCourtsForm3");
    }
  };
  const _handleChange = () => {
    var plaintiffError = nameValidator2(plaintiff.value);
    var defendantError = nameValidator2(defendant.value);
    if (plaintiffError || defendantError) {
      setPlaintiff({ ...plaintiff, error: plaintiffError });
      setDefendant({ ...defendant, error: defendantError });
    } else {
      var details = {
        plaintiff: plaintiff.value,
        defendant: defendant.value,
        decisionDate: dateOfDecision,
      };
      store.dispatch({ type: "setCurrentFormItem", payload: details });
    }
  };
  const _handlePrevious = () => {
    props.navigation.navigate("LowerCourtsForm1");
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title={headerTitle} backbutton goBackFn={_handlePrevious} />
      <View style={styles.container}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <Parties
            plaintiff={plaintiff}
            setPlaintiff={(p) => {setPlaintiff(p);}}
            defendant={defendant}
            setDefendant={(d) => setDefendant(d)}
          />
          <DateOfDecision setDate={(date) => setDateOfDecision(date)} />
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
});

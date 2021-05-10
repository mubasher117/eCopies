import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  BackHandler,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import SectionTitle from "../../../components/child-components/SectionTitle";
import Header from "../../../components/header/Header";
import DateOfDecision from "../../../components/child-components/DateOfDecision";
import BottomButtonsNav from "../../../components/child-components/BottomButtonsNav";
import OptionButtons from "../../../components/child-components/OptionButtons";
import store from "../../../redux/store";
export default (props) => {

  const [headerTitle, setHeaderTitle] = useState("");
  const [dateOfDecision, setDateOfDecision] = useState(new Date());
  const [caseStatus, setCaseStatus] = useState("Running");

  useEffect(() => {
    let state = store.getState();
    let title = state.ordersReducer.currentForm.court;
    setHeaderTitle(title);
    //Back Handler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let form = state.ordersReducer.currentForm;
      let title = form.court;
      setDateOfDecision();
      setHeaderTitle(title);
      setCaseStatus("Running")
      BackHandler.addEventListener("hardwareBackPress", backAction);
    });
    const onBlurScreen = props.navigation.addListener("didBlur", () => {
      backHandler.remove();
    });
    return () => {
      unsubscribe;
      onBlurScreen;
      backHandler.remove();
    };
  }, []);
  const backAction = () => {
    _handlePrevious();
    return true;
  };
  const _handleNext = () => {
      var details = {
        decisionDate: dateOfDecision,
        caseStatus: caseStatus,
      };
      store.dispatch({ type: "setCurrentFormItem", payload: details });
      props.navigation.navigate("LowerCourtsForm3");
  };
  const _handlePrevious = () => {
    props.navigation.navigate("LowerCourtsForm2");
  };
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <Header title={headerTitle} backbutton goBackFn={_handlePrevious} />
        <View style={styles.container}>
          <SectionTitle title="Case Dates" />

          <OptionButtons
            label="Select Case Status"
            option1="Running"
            option2="Decided"
            _handleOption1={() => setCaseStatus("Running")}
            _handleOption2={() => setCaseStatus("Decided")}
            active={caseStatus == "Running" ? false : true}
          />
          <View style={styles.innerContainer}>
            <DateOfDecision
              setDate={(date) => setDateOfDecision(date)}
              isRunning={caseStatus == "Running" && true}
            />
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
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
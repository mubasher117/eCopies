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
import {Parties} from '../../../components/child-components/Parties'
import { styles } from "../../../styles/CopyForm";
import DateOfDecision from '../../../components/child-components/DateOfDecision'
import OptionButtons from '../../../components/child-components/copy-form/OptionButtons'
const { height, width } = Dimensions.get("window");
var index = 0;
export default function CopyForm1(props) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [court, setCourt] = useState("-1");
  const [courtError, setCourtError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('')
  useEffect(() => {
    let state = store.getState();
    // Getting selected court name to display on header
    let title = state.ordersReducer.currentForm.court;
    setHeaderTitle(title);
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let title = state.ordersReducer.currentForm.court;
      setHeaderTitle(title);
    });
    return () => unsubscribe;
  }, []);
  var registerDate = date.toDateString().toString();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(!show);
  };
  // Retreives previous parts of forms, merge it with this part and saves it.
  const _handleNext = () => {
    // if (court == "-1") {
    //   setCourtError(true);
    // } else {
    //   store.dispatch({ type: "setCurrentFormItem", payload: court });
      props.navigation.navigate("LoweCourtsForm2");
    // }
  };
  const saveDetails = () =>
    new Promise(async (resolve, reject) => {
      let state = store.getState();
      let formDetails = state.ordersReducer.currentForm;
      let copyFormDetails = {
        ...formDetails,
        court: court,
      };
      console.log("form : ", copyFormDetails);
      let forms;
      try {
        // Retrieving previous forms from storage
        const formsJson = await AsyncStorage.getItem("@forms");
        if (formsJson) {
          forms = JSON.parse(formsJson);
          forms.push(copyFormDetails);
          const jsonValue = JSON.stringify(forms);
          await AsyncStorage.setItem("@forms", jsonValue);
        } else {
          forms = [copyFormDetails];
          const jsonValue = JSON.stringify(forms);
          await AsyncStorage.setItem("@forms", jsonValue);
        }
      } catch (e) {
        // error reading value
      }
      // Clear pervious form
      store.dispatch({
        type: "clearForm",
      });
      setCourt("-1");
      resolve();
    });
  // Function triggered on pressing next button
  const onNext = async () => {
    setshowLoading(true);
    setIsModalVisible(false);
    saveDetails().then(async () => {
      setcontainerOpacity(1);
      setshowLoading(false);
      props.navigation.navigate("SubmitDetails");
    });
  };
  const goBackFn = () => {
    props.navigation.navigate("LowerCourtsSelectCourt");
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title={headerTitle} backbutton goBackFn={goBackFn} />
      <OptionButtons option1="Civil" option2="Criminal"/>


        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            width: "90%",
          }}
        >
          <Button style={styles.next} type="primary" onPress={_handleNext}>
            Next
          </Button>
        </View>
    
      <ActivityIndicator animating={showLoading} toast size="large" />
    </KeyboardAwareScrollView>
  );
}



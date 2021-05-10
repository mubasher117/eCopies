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
  BackHandler
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
export default function CopyForm(props) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [documentNo, setDocumentNo] = useState({ value: "", error: false });
  const [bahiNo, setBahiNo] = useState({ value: "", error: false });
  const [volume, setVolume] = useState({ value: "", error: false });
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let form = state.ordersReducer.currentForm;
      setDocumentNo(
        form.documentNo
          ? { value: form.documentNo, error: false }
          : { value: "", error: false }
      );
      setBahiNo(
        form.bahiNo
          ? { value: form.bahiNo, error: false }
          : { value: "", error: false }
      );
      setVolume(
        form.volume
          ? { value: form.volume, error: false }
          : { value: "", error: false }
      );
      setDate(form.registerDate ? new Date(form.registerDate) : new Date());

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
  var registerDate = date.toDateString().toString();
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
    if (documentNo.value != "" && bahiNo.value != "" && volume.value != "") {
      const details = {
        documentNo: documentNo.value,
        bahiNo: bahiNo.value,
        volume: volume.value,
        registerDate: registerDate,
      };
      store.dispatch({ type: "setCurrentFormItem", payload: details });
      props.navigation.navigate("RevenueCopyForm2");
    } else {
      // Setting errors of empty fields
      if (documentNo.value == "") {
        setDocumentNo({ value: "", error: true });
      }
      if (bahiNo.value == "") {
        setBahiNo({ value: "", error: true });
      }
      if (volume.value == "") {
        setVolume({ value: "", error: true });
      }
    }
  };
  // Function to open drawer
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title="Revenue Court" openDrawerFn={openDrawerFn} />
      <ScrollView keyboardShouldPersistTaps="always">
        <View
          style={{
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Document Info</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>دستاویز نمبر</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Document Number"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder=""
                  value={documentNo.value}
                  onChange={(e) =>
                    setDocumentNo({ value: e.nativeEvent.text, error: false })
                  }
                  keyboardType="numeric"
                  error={documentNo.error}
                  maxLength={20}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>بہی نمبر</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Bahi Number"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder=""
                  value={bahiNo.value}
                  onChange={(e) =>
                    setBahiNo({ value: e.nativeEvent.text, error: false })
                  }
                  keyboardType="numeric"
                  error={bahiNo.error}
                  maxLength={20}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>جلد نمبر</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Volume"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder=""
                  value={volume.value}
                  onChange={(e) =>
                    setVolume({ value: e.nativeEvent.text, error: false })
                  }
                  keyboardType="numeric"
                  error={volume.error}
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
                <Text style={styles.label}>Date of register</Text>
                <Text style={styles.label}>تاریخ ریجسٹر</Text>
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
                  {registerDate}
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

            <View style={{ width: "100%", height: 0 }} />
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

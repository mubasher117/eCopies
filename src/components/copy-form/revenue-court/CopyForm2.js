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
  BackHandler,
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
import Header from "../../header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import store from "../../../redux/store";
import Modal from "../../child-components/Modal";
const { height, width } = Dimensions.get("window");
var index = 0;
const towns = [
  { key: index++, section: true, label: "Select Town", value: "-1" },
  { key: index++, label: "Model Town", value: "Model Town" },
  { key: index++, label: "Allama Iqbal Town", value: "Allama Iqbal Town" },
  { key: index++, label: "Ravi Town", value: "Ravi Town" },
  { key: index++, label: "Gulberg", value: "Gulberg" },
  { key: index++, label: "Nishter Town", value: "Nishter Town" },
  { key: index++, label: "Aziz Bhatti Town", value: "Aziz Bhatti Town" },
  {
    key: index++,
    label: "Data Gunj Bakhs Town",
    value: "Data Gunj Bakhs Town",
  },
];
export default function CopyForm2(props) {
  const [town, setTown] = useState("-1");
  const [townError, setTownError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);

  useEffect(() => {
    //Back Handler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribe = props.navigation.addListener("didFocus", () => {
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
  }, []);

  const backAction = () => {
    console.log("IN BACK HANDLER");
    goBackFn();
    return true;
  };
  // Retreives previous parts of forms, merge it with this part and saves it.
  const saveDetails = () =>
    new Promise(async (resolve, reject) => {
      let state = store.getState();
      let formDetails = state.ordersReducer.currentForm;
      let copyFormDetails = {
        ...formDetails,
        town: town,
        court: "revenueCourt",
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
      setTown("-1");
      resolve();
    });
  // Function triggered on pressing next button
  const onNext = async () => {
    setshowLoading(true);
    setIsModalVisible(false);
    saveDetails().then(async () => {
      setcontainerOpacity(1);
      setshowLoading(false);
      props.navigation.navigate("DeliveryDetails");
    });
  };
  const goBackFn = () => {
    props.navigation.navigate("RevenueCopyForm");
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
  };
  const showModal = () => {
    if (town == "-1") {
      setTownError(true);
    } else {
      setIsModalVisible(true);
      setcontainerOpacity(0.05);
    }
  };
  const submitAnotherForm = () => {
    setshowLoading(true);
    setIsModalVisible(false);
    saveDetails().then(() => {
      setcontainerOpacity(1);
      setshowLoading(false);
      props.navigation.navigate("RevenueCopyForm");
    });
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title="Revenue Court" backbutton goBackFn={goBackFn} />
      <Modal
        visible={isModalVisible}
        text="Do you want to submit another copy form?"
        urduText=" کیا آپ ایک اور نقل فارم لینا چاہتے ہیں؟"
        hideModal={hideModal}
        optionsYes
        quitButton
        handleYes={submitAnotherForm}
        handleNo={onNext}
      />
      <ScrollView keyboardShouldPersistTaps="always">
        <View
          style={{
            alignItems: "center",
            opacity: containerOpacity,
            marginTop: 15,
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Town Info</Text>
            </View>
            <View style={styles.infoContainer}>
              <View
                style={[
                  styles.labelContainer,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.label}>Town</Text>
                <Text style={styles.label}>ٹاؤن</Text>
              </View>
              <View
                style={[
                  styles.valueContainer,
                  {
                    backgroundColor: InputBackground,
                  },
                ]}
              >
                {Platform.OS === "ios" ? (
                  <ModalPicker
                    data={towns}
                    initValue="Select Town"
                    onChange={(option) => {
                      setTown(option.value);
                    }}
                  />
                ) : (
                  <Picker
                    selectedValue={town}
                    style={{
                      height: 50,
                      width: "100%",
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      setTown(itemValue);
                      setTownError(false);
                    }}
                  >
                    <Picker.Item label="Select Town" value="-1" />
                    <Picker.Item label="Gulberg Town" value="Gulberg Town" />
                    <Picker.Item
                      label="Allama Iqbal Town"
                      value="Allama Iqbal Town"
                    />
                    <Picker.Item label="Ravi Town" value="Ravi Town" />
                    <Picker.Item label="Nishter Town" value="Nishter Town" />
                    <Picker.Item label="Shalimar Town" value="Shalimar Town" />
                    <Picker.Item
                      label="Samanabad Town"
                      value="Samanabad Town"
                    />
                    <Picker.Item label="Wahga Town" value="Wahga Town" />
                    <Picker.Item
                      label="Aziz Bhatti Town"
                      value="Aziz Bhatti Town"
                    />
                    <Picker.Item
                      label="Data Gunj Bakhs Town"
                      value="Data Gunj Bakhs Town"
                    />
                  </Picker>
                )}
              </View>
              {townError && (
                <Text style={styles.error}>* Please select one town</Text>
              )}
            </View>

            <View
              style={{
                width: "100%",
                height: 0,
              }}
            />
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
            <Button style={styles.next} type="primary" onPress={showModal}>
              Next
            </Button>
          </View>
        </View>
      </ScrollView>
      <ActivityIndicator animating={showLoading} toast size="large" />
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalQuit: {
    width: 30,
    height: 30,
  },
  error: {
    color: "red",
    marginLeft: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  modalTextBold: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  modalSubtext: {
    fontSize: 12,
    color: "grey",
    marginTop: -10,
  },
  buttonModalYes: {
    width: "40%",
    height: 45,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
  },
  buttonModalNo: {
    width: "40%",
    height: 45,
    backgroundColor: "#E6E6E6",
    borderWidth: 0,
    alignSelf: "flex-end",
  },
});

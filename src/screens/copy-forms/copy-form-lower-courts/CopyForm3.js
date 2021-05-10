import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Keyboard,
  Picker,
  Image,
  Modal,
  BackHandler,
} from "react-native";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
} from "@ant-design/react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../../constants/colors";
import { TextInput, FAB, Chip, Switch, Checkbox } from "react-native-paper";
import {
  addForm,
  login,
  register,
  checkSignedIn,
  logout,
} from "../../../api/firebase/authenication";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../../components/header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { database } from "../../../api/firebase/authenication";
import store from "../../../redux/store";
const { height, width } = Dimensions.get("window");

export default function CopyFormDocs(props) {
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkModal, setCheckModal] = useState(false);
  const [isDocument, setDocument] = useState({ mode: false, value: "" });
  const [isPetition, setPetition] = useState({
    mode: false,
    value: new Date(),
  });
  const [isOrderDated, setOrderDated] = useState({
    mode: false,
    value: new Date(),
  });
  const [isOther, setOther] = useState({ mode: false, value: "" });
  const [showDate, setShowDate] = useState(false);
  const [showPetitionDate, setPetitionDate] = useState(false);
  const [showLoading, setshowLoading] = useState(false);

  const [headerTitle, setHeaderTitle] = useState("");
  useEffect(() => {
    let state = store.getState();
    // Getting selected court name to display on header
    let title = state.ordersReducer.currentForm.court;
    console.log(state.ordersReducer.currentForm);
    setHeaderTitle(title);
    //Back Handler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let title = state.ordersReducer.currentForm.court;
      setHeaderTitle(title);
      BackHandler.addEventListener("hardwareBackPress", backAction);
      console.log(state.ordersReducer.currentForm);
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
    _handlePrevious();
    return true;
  };
  // Retreives previous parts of forms, merge it with this part and saves it.
  const saveDetails = () =>
    new Promise(async (resolve, reject) => {
      // Array to store order details to be saved in db
      var documentDetails = [];
      // Adding checked documents in array
      if (isDocument.mode) {
        documentDetails.push({ type: "Document", value: isDocument.value });
      }
      if (isPetition.mode) {
        documentDetails.push({ type: "Petition", value: isPetition.value });
      }
      if (isOther.mode) {
        documentDetails.push({
          type: "Other",
          value: isOther.value,
        });
      }
      if (isOrderDated.mode) {
        documentDetails.push({
          type: "Order Dated",
          value: isOrderDated.value,
        });
      }
      let state = store.getState();
      let formDetails = state.ordersReducer.currentForm;
      let copyFormDetails = {
        ...formDetails,
        documentDetails,
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
      store.dispatch({ type: "clearForm" });
      setDocument({ mode: false, value: "" });
      setPetition({
        mode: false,
        value: new Date(),
      });
      setOrderDated({
        mode: false,
        value: new Date(),
      });
      setOther({ mode: false, value: "" });
      resolve();
    });
  const onNext = async () => {
    setshowLoading(true);
    setIsModalVisible(false);
    saveDetails().then(async () => {
      setcontainerOpacity(1);
      setshowLoading(false);
      props.navigation.navigate("SubmitDetails");
    });
  };
  const _handlePrevious = () => {
    props.navigation.navigate("LowerCourtsFormDate");
  };
  // Converts date to string to display on screen
  var decisionDate = isOrderDated.value.toDateString();
  decisionDate = decisionDate.substring(4, decisionDate.length);
  var petitionDate = isPetition.value.toDateString();
  petitionDate = petitionDate.substring(4, petitionDate.length);
  const showModal = () => {
    setIsModalVisible(true);
    setcontainerOpacity(0.05);
  };
  const submitAnotherForm = () => {
    setshowLoading(true);
    setIsModalVisible(false);
    saveDetails().then(() => {
      setcontainerOpacity(1);
      setshowLoading(false);
      props.navigation.navigate("CopyFormHomePage");
    });
  };
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || isOrderDated.value;
    setShowDate(Platform.OS === "ios");
    setOrderDated({ ...isOrderDated, value: currentDate });
  };
  const onChangePetitionDate = (event, selectedDate) => {
    const currentDate = selectedDate || isPetition.value;
    setPetitionDate(Platform.OS === "ios");
    setPetition({ ...isPetition, value: currentDate });
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setCheckModal(false);
    setcontainerOpacity(1);
  };
  // Checks if form edit made to form or not
  const checkForm = () => {
    var isCleanForm = true;
    if (
      isDocument.mode ||
      isPetition.mode ||
      isOther.mode ||
      isOrderDated.mode
    ) {
      isCleanForm = false;
    }
    if (isCleanForm) {
      setcontainerOpacity(0.05);
      setCheckModal(true);
    } else {
      showModal();
    }
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title={headerTitle} backbutton goBackFn={_handlePrevious} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          //alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Do you want to submit another copy form?
            </Text>
            <Text style={styles.modalText}>
              کیا آپ ایک اور نقل فارم لینا چاہتے ہیں؟
            </Text>
            <View style={styles.modalButtonsContainer}>
              <Button
                style={styles.buttonModalNo}
                type="primary"
                onPress={onNext}
              >
                <Text style={{ color: Secondary }}>No</Text>
              </Button>
              <Button
                style={styles.buttonModalYes}
                type="primary"
                onPress={submitAnotherForm}
              >
                Yes
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal if form is clean */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={checkModal}
        onRequestClose={() => {
          //alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end", margin: -15, marginBottom: 10 }}
              onPress={hideModal}
            >
              <Image
                style={styles.modalQuit}
                source={require("../../../../assets/images/static/quit.png")}
              />
            </TouchableOpacity>
            <View style={{ height: 10, width: 5 }} />
            <Text style={styles.modalText}>Select at least one document</Text>
            <Text style={styles.modalText}>
              کم از کم ایک دستاویز کا انتخاب کریں۔
            </Text>
            <Button
              style={styles.buttonModalClose}
              type="primary"
              onPress={hideModal}
            >
              OK
            </Button>
          </View>
        </View>
      </Modal>
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
              <Text style={styles.sctionTitle}>Document Details</Text>
            </View>

            <View style={styles.infoContainer}>
              <View
                style={[
                  styles.labelContainer,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.label}>Documents</Text>
                <Text style={styles.label}>کاغزات</Text>
              </View>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isDocument.mode ? "checked" : "unchecked"}
                  onPress={() => {
                    setDocument({ ...isDocument, mode: !isDocument.mode });
                  }}
                  color={Secondary}
                />
                <Text style={{ fontSize: 16 }}>Document</Text>
              </View>
              <TextInput
                style={{
                  marginLeft: "10%",
                  height: 40,
                  width: "80%",
                  borderColor: "gray",
                  opacity: isDocument.mode ? 1 : 0.3,
                }}
                placeholder="Enter document name"
                onChangeText={(text) =>
                  setDocument({ ...isDocument, value: text })
                }
                value={isDocument.value}
                editable={isDocument.mode}
              />

              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isPetition.mode ? "checked" : "unchecked"}
                  onPress={() => {
                    setPetition({ ...isPetition, mode: !isPetition.mode });
                  }}
                  color={Secondary}
                />
                <Text>Petition</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.valueContainer,
                  {
                    opacity: isPetition.mode ? 1 : 0.3,
                  },
                ]}
                onPress={() => setPetitionDate(!showPetitionDate)}
                disabled={!isPetition.mode}
              >
                <Chip
                  style={{
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                  textStyle={{
                    color: PrimaryText,
                    fontSize: 12,
                  }}
                >
                  {petitionDate}
                </Chip>
                {showPetitionDate && (
                  <DateTimePicker
                    value={isPetition.value}
                    mode="date"
                    display="default"
                    onChange={onChangePetitionDate}
                  />
                )}
              </TouchableOpacity>

              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isOrderDated.mode ? "checked" : "unchecked"}
                  onPress={() => {
                    setOrderDated({
                      ...isOrderDated,
                      mode: !isOrderDated.mode,
                    });
                  }}
                  color={Secondary}
                />
                <Text>Order Dated</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.valueContainer,
                  {
                    opacity: isOrderDated.mode ? 1 : 0.3,
                  },
                ]}
                onPress={() => setShowDate(!showDate)}
                disabled={!isOrderDated.mode}
              >
                <Chip
                  style={{
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                  textStyle={{
                    color: PrimaryText,
                    fontSize: 12,
                  }}
                >
                  {decisionDate}
                </Chip>
                {showDate && (
                  <DateTimePicker
                    value={isOrderDated.value}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
              </TouchableOpacity>

              <View style={styles.documemntsContainer}>
                <Checkbox
                  status={isOther.mode ? "checked" : "unchecked"}
                  onPress={() => {
                    setOther({ ...isOther, mode: !isOther.mode });
                  }}
                  color={Secondary}
                />
                <Text>Other</Text>
              </View>
              <TextInput
                style={{
                  marginLeft: "10%",
                  height: 40,
                  width: "80%",
                  borderColor: "gray",
                  opacity: isOther.mode ? 1 : 0.3,
                }}
                placeholder="Document Name"
                editable={isOther.mode}
                onChangeText={(text) => setOther({ ...isOther, value: text })}
                value={isOther.value}
              />
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              style={styles.previous}
              type="primary"
              onPress={_handlePrevious}
            >
              <Text style={{ color: Secondary }}>Previous</Text>
            </Button>

            <Button style={styles.next} type="primary" onPress={checkForm}>
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
    width: "80%",
    alignSelf: "center",
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
  fab: {
    position: "absolute",
    backgroundColor: Secondary,
    marginRight: 16,
    marginTop: 30,
    right: 0,
    bottom: 0,
  },
  buttonsContainer: {
    margin: 30,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "90%",
    flexDirection: "row",
  },
  next: {
    width: "40%",
    height: 50,
    backgroundColor: Secondary,
    borderWidth: 0,
  },
  previous: {
    width: "40%",
    height: 50,
    backgroundColor: "#E6E6E6",
    borderWidth: 0,
  },
  stepsContainer: {
    width: "120%",
    alignItems: "center",
    marginTop: 20,
  },
  infoContainer: {
    marginBottom: 15,
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
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  modalTextBold: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalAccNo: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
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
  urgentMessage: {
    color: "red",
    fontSize: 11,
  },
  documemntsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  checkboxContainer: {
    marginTop: 10,
  },
  buttonModalClose: {
    width: "100%",
    height: 40,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
    marginTop: 30,
  },
});

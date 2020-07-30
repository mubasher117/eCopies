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
  List,
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
import { TextInput, FAB } from "react-native-paper";
import {
  addForm,
  login,
  register,
  checkSignedIn,
  logout,
} from "../../../api/firebase/authenication";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../header/Header";
import ModalPicker from "react-native-modal-picker";
import { NavigationActions } from "react-navigation";
import { ImagePropTypes } from "react-native";
import Modal, { ModalContent } from "react-native-modals";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");

const DocumentDetails = (props) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.valueContainer}>
        <TextInput
          label={"Document " + props.labelValue.toString()}
          selectionColor={Primary}
          underlineColor={PrimaryText}
        />
      </View>
    </View>
  );
};

export default function CopyFormDocs(props) {
  var val = "";
  let index = 0;
  const districts = [
    { key: index++, section: true, label: "Districts" },
    { key: index++, label: "Lahore" },
    { key: index++, label: "Faisalabad" },
    { key: index++, label: "Sheikhupura" },
  ];
  const [showLoading, setshowLoading] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [documemnts, setdocumemnts] = useState([
    { key: 1 },
    { key: 2 },
    { key: 3 },
  ]);

  useEffect(() => {
    //console.log("re-render");
  }, []);
  const addFormCallBack = (error) => {
    if (error) {
      setshowLoading(false);
      setScroll(true);
      setcontainerOpacity(1);
      alert("adding failed");
    } else {
      setshowLoading(false);
      setScroll(true);
      setcontainerOpacity(1);
      setIsModalVisible(true)
      props.navigation.navigate("Payments");
    }
  };

  const onSubmit = () => {
    setshowLoading(true);
    setScroll(false);
    setcontainerOpacity(0.3);
    addForm({ name: "Mubasher", "document number": "12565" }, addFormCallBack);
  };
  const goBackFn = () => {
    props.navigation.navigate("CopyFormCase");
  };
  const addDoc = () => {
    // Deep Copy of documents
    var tempDocs = Array.from(documemnts);
    tempDocs.push({ key: documemnts.length + 1 });
    setdocumemnts(tempDocs);
  };
  const applicationSteps = [
    { title: "Personal", title2: "" },
    { title: "Case", title2: "" },
    { title: "Docs", title2: "" },
  ];
  return (
    <SafeAreaView behaviour="padding" style={styles.container}>
      <Header title="Copy Form" backbutton goBackFn={goBackFn} />
      <Modal
        visible={isModalVisible}
        onTouchOutside={() => {
          setIsModalVisible(false);
        }}
        useNativeDriver={true}
      >
        <ModalContent>
          <Text>Your details has been submitted.</Text>
        </ModalContent>
      </Modal>
      <View style={styles.stepsContainer}>
        <Steps size="small" current={1} direction="horizontal">
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
      {/* <Button
        onPress={() => {
          login();
        }}
      >
        Login
      </Button>
      <Button
        onPress={() => {
          register();
        }}
      >
        Register
      </Button>
      <Button
        onPress={() => {
          checkSignedIn();
        }}
      >
        Check
      </Button>
      <Button
        onPress={() => {
          logout();
        }}
      >
        Log Out
      </Button>
       */}
      <ScrollView scrollEnabled={scroll}>
        <View
          style={{
            alignItems: "center",
            opacity: containerOpacity,
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Document Details</Text>
            </View>

            {documemnts.map((doc) => {
              return <DocumentDetails key={doc.key} labelValue={doc.key} />;
            })}
            <View style={{ width: "100%", height: 55 }} />

            <FAB
              style={styles.fab}
              small
              icon="plus"
              onPress={addDoc}
              color={"white"}
            />
          </View>

          <View style={styles.submitContainer}>
            <Button style={styles.submit} type="primary" onPress={onSubmit}>
              <Text>Submit</Text>
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
  fab: {
    position: "absolute",
    backgroundColor: Secondary,
    marginRight: 16,
    marginTop: 30,
    right: 0,
    bottom: 0,
  },
  submitContainer: {
    margin: 30,
    flex: 1,
    marginTop: 50,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "90%",
  },
  submit: {
    width: "40%",
    minHeight: 60,
    backgroundColor: Secondary,
    borderWidth: 0,
  },
  stepsContainer: {
    width: "120%",
    alignItems: "center",
    marginTop: 20,
  },
});

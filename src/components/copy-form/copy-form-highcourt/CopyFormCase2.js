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
import Header from "../../header/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import store from "../../../redux/store";
import { nameValidator2 } from "../../core/utils";
import { Value } from "react-native-reanimated";
const { height, width } = Dimensions.get("window");
export default function CopyFormCase2(props) {
  const [plaintiff, setPlaintiff] = useState({ value: "", error: "" });
  const [defendant, setDefendant] = useState({ value: "", error: "" });
  const [judges, setJudges] = useState([{ value: "", error: "" }]);
  const [isVisibleFab, setIsVisibleFab] = useState(true);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      let state = store.getState();
      let form = state.ordersReducer.currentForm;
      console.log("FOCUSED ON");
      console.log(form);
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
      if (!form.judges) {
        setJudges([{ value: "", error: "" }]);
        setIsVisibleFab(true);
      }
    });
    return () => unsubscribe;
  }, [props.navigation]);
  const addJudge = () => {
    if (judges.length < 2) {
      // Deep Copy of documents
      var tempJudges = Array.from(judges);
      tempJudges.push({ value: "", error: "" });
      setJudges(tempJudges);
    } else {
      var tempJudges = Array.from(judges);
      tempJudges.push({ value: "", error: "" });
      setJudges(tempJudges);
      setIsVisibleFab(false);
    }
  };

  const goBackFn = () => {
    props.navigation.navigate("CopyFormCase");
  };

  const goNext = async () => {
    var plaintiffVal = nameValidator2(plaintiff.value);
    var defendantVal = nameValidator2(defendant.value);
    var judgesVal = nameValidator2(judges[0].value);
    if (plaintiffVal || defendantVal || judgesVal) {
      setPlaintiff({ ...plaintiff, error: plaintiffVal });
      setDefendant({ ...defendant, error: defendantVal });
      // Setting first judge's error
      let tempJudges = Array.from(judges);
      tempJudges[0] = { ...tempJudges[0], error: judgesVal };
      setJudges(tempJudges);
    } else {
      const details = {
        plaintiff: plaintiff.value,
        defendant: defendant.value,
        judges: [],
      };
      judges.map((judge) => details.judges.push(judge.value));
      store.dispatch({ type: "setCurrentFormItem", payload: details });
      props.navigation.navigate("CopyFormDocs");
    }
  };
  /*
  const getUpdatedDictionaryOnchange = (key, value) => {
    let tempDict = Array.from(judges);
    const index = tempDict.findIndex(temp => temp.key == key)
    console.log(index)
    tempDict[index].value = value
    return tempDict
  }
  */
  const updateJudges = (value, index) => {
    let tempJudges = Array.from(judges);
    tempJudges[index] = { value: value, error: "" };
    setJudges(tempJudges);
  };
  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
      <Header title="Copy Form" backbutton goBackFn={goBackFn} />
      <ScrollView keyboardShouldPersistTaps="always">
        <View
          style={{
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sctionTitle}>Case Information</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>مدعی</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Plaintiff Name"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder=""
                  value={plaintiff.value}
                  onChange={(e) =>
                    setPlaintiff({ value: e.nativeEvent.text, error: "" })
                  }
                  keyboardType="default"
                  error={!!plaintiff.error}
                  maxLength={25}
                  returnKeyType="next"
                />
                <Text style={styles.error}>{plaintiff.error}</Text>
              </View>
              <View style={[styles.valueContainer, { alignItems: "center" }]}>
                <Text>vs</Text>
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>مدعا علیہ</Text>
              </View>
              <View style={styles.valueContainer}>
                <TextInput
                  label="Defendant Name"
                  selectionColor={Primary}
                  underlineColor={PrimaryText}
                  placeholder=""
                  value={defendant.value}
                  onChange={(e) =>
                    setDefendant({ value: e.nativeEvent.text, error: "" })
                  }
                  keyboardType="default"
                  maxLength={25}
                  error={!!defendant.error}
                  returnKeyType="next"
                />
                <Text style={styles.error}>{defendant.error}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View
                style={[
                  styles.labelContainer,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.label}>Judges</Text>
                <Text style={styles.label}>ججز</Text>
              </View>
              {judges.map((judge, index) => {
                return (
                  <View key={index} style={styles.valueContainer}>
                    <TextInput
                      label="Mr. Justice"
                      selectionColor={Primary}
                      underlineColor={PrimaryText}
                      onChange={(e) => updateJudges(e.nativeEvent.text, index)}
                      value={judge.value}
                      error={!!judge.error}
                      maxLength={25}
                      returnKeyType="next"
                    />
                    <Text style={styles.error}>{judge.error}</Text>
                  </View>
                );
              })}
            </View>

            <View style={{ width: "100%", height: 30 }} />
            {isVisibleFab ? (
              <FAB
                style={styles.fab}
                small
                icon="plus"
                onPress={addJudge}
                color={"white"}
              />
            ) : (
              <View />
            )}
          </View>
          <View style={styles.buttonsContainer}>
            <Button style={styles.previous} type="primary" onPress={goBackFn}>
              <Text style={{ color: Secondary }}>Previous</Text>
            </Button>

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
  error: {
    color: "red",
    marginLeft: 5,
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
    marginBottom: 10,
  },
  value: {
    marginLeft: "-5%",
    padding: 10,
    borderBottomWidth: 2,
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
  fab: {
    position: "absolute",
    backgroundColor: Secondary,
    marginRight: 16,
    right: 0,
    bottom: 0,
  },
});

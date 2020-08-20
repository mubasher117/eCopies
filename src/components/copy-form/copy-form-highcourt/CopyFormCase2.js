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
const { height, width } = Dimensions.get("window");
export default function CopyFormCase2(props) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [datePucca, setDatePucca] = useState(new Date());
  const [showPucca, setShowPucca] = useState(false);
  const [showLoading, setshowLoading] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [plaintiff, setPlaintiff] = useState("");
  const [defendant, setDefendant] = useState("");
  const [judges, setJudges] = useState([{ key: 1, value: '' }]);
  const [isVisibleFab, setIsVisibleFab] = useState(true);
  useEffect(() => {
    return () => {};
  }, []);
  const addJudge = () => {
    if (judges.length < 2) {
      // Deep Copy of documents
      var tempJudges = Array.from(judges);
      tempJudges.push({ key: judges.length + 1 });
      setJudges(tempJudges);
    } else {
      var tempJudges = Array.from(judges);
      tempJudges.push({ key: judges.length + 1 });
      setJudges(tempJudges);
      setIsVisibleFab(false);
    }
  };
  var decisionDate = date.toDateString().toString();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(!show);
  };
  
  const goBackFn = () => {
    props.navigation.navigate("CopyFormCase");
  };

  const goNext = async () => {
    const details = {
      plaintiff: plaintiff,
      defendant: defendant,
      judges: []
    }
    judges.map(judge => details.judges.push(judge.value))    
    store.dispatch({ type: "setCurrentFormItem", payload: details });
    props.navigation.navigate("CopyFormDocs");
  };
  const getUpdatedDictionaryOnchange = (key, value) => {
    let tempDict = Array.from(judges);
    const index = tempDict.findIndex(temp => temp.key == key)
    console.log(index)
    tempDict[index].value = value
    return tempDict
  }
  return (
    <KeyboardAwareScrollView>
      <Header title="Copy Form" backbutton goBackFn={goBackFn} />
      <ScrollView scrollEnabled={scroll}>
        <View
          style={{
            alignItems: "center",
            opacity: containerOpacity,
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
                  value={plaintiff}
                  onChange={(e) => setPlaintiff(e.nativeEvent.text)}
                  keyboardType="default"
                />
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
                  value={defendant}
                  onChange={(e) => setDefendant(e.nativeEvent.text)}
                  keyboardType="default"
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
                <Text style={styles.label}>Judges</Text>
                <Text style={styles.label}>ججز</Text>
              </View>
              {judges.map((judge) => {
                return (
                  <View key={judge.key} style={styles.valueContainer}>
                    <TextInput
                      label="Mr. Justice"
                      selectionColor={Primary}
                      underlineColor={PrimaryText}
                      onChange={(e) =>
                        setJudges(
                          getUpdatedDictionaryOnchange(
                            judge.key,
                            e.nativeEvent.text
                          )
                        )
                      }
                    />
                  </View>
                );
              })}
            </View>

            <View style={{ width: "100%", height: 55 }} />
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
            {/* <View style={styles.infoContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>District</Text>
              </View>
              <View
                style={[
                  styles.valueContainer,
                  { backgroundColor: InputBackground },
                ]}
              >
                {Platform.OS === "ios" ? (
                  <ModalPicker
                    data={districts}
                    initValue="Select District"
                    onChange={(option) => {
                      setDistrict(option);
                    }}
                  />
                ) : (
                  <Picker
                    selectedValue={district}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(itemValue, itemIndex) =>
                      setDistrict(itemValue)
                    }
                  >
                    <Picker.Item label="Select Distrtict" value="-1" />
                    <Picker.Item label="Lahore" value="Lahore" />
                    <Picker.Item label="Sheikhupura" value="Sheikhupura" />
                    <Picker.Item label="Faisalabad" value="Faisalabad" />
                  </Picker>
                )}
              </View>
            </View> */}
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
      <ActivityIndicator
        animating={showLoading}
        toast
        size="large"
        text="Submitting..."
      />
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

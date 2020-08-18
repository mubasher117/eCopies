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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  InputItem,
  Tag,
  ActivityIndicator,
  Steps,
  Tabs,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import { TextInput, Chip, Button } from "react-native-paper";
import Header from "../header/Header";
import {database} from '../../api/firebase/authenication';
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
const FormType = (props) => {
    return (
      <TouchableOpacity
        onPress={() => props.navigateTo()
        }
        style={{
          borderRadius: 5,
          width: "45%",
          backgroundColor: "#E6E6E6",
          height: 160,
          padding: 10,
          margin: 10,
        }}
      >
        <Image
          style={{ width: "100%", height: "70%", marginBottom: 5 }}
          source={props.imgSource}
        />
        <Text style={{ fontWeight: "bold" }}>{props.title}</Text>
        <Text style={{}}>{props.titleUrdu}</Text>
      </TouchableOpacity>
    );
  };

export default function HomPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    
  }, []);
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const navigateTo = (screen) => {
    database.ref('')
      props.navigation.navigate(screen);
  }
  return (
    <View style={styles.container}>
      <Header title="Copy form" openDrawerFn={openDrawerFn} />
      <ScrollView>
        <View style={styles.optionsContainer}>
          <FormType
            title="High Court"
            titleUrdu="ہائی کورٹ"
            imgSource={require("../../../assets/images/static/highcourt.jpeg")}
            navigateTo={() => navigateTo("CopyFormCase")}
          />
          <FormType
            title="District Court"
            titleUrdu="ضلعی عدالت"
            imgSource={require("../../../assets/images/static/district_court.jpg")}
          />
        </View>
        <View style={styles.optionsContainer}>
          <FormType
            title="Session Court"
            titleUrdu="سیشن کورٹ"
            imgSource={require("../../../assets/images/static/district_court.jpg")}
          />
        </View>
        <View style={{ width: "100%", height: 150 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer:{
      flexDirection: 'row',
      margin: '7%',
      marginBottom: 0
  },
});

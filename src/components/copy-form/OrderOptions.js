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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  InputItem,
  Tag,
  Button,
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
import { TextInput, Chip } from "react-native-paper";
import Header from "../header/Header";
import OrderStatusCard from "../child-components/OrderStatusCard";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");

export default function OrderOptions(props) {
  const [myOrders, setMyOrders] = useState([]);
  useEffect(() => {}, []);
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const tabs = [{ title: "Orders" }, { title: "Urgent" }];
  return (
    <View>
      <Header title="Copy Form" openDrawerFn={openDrawerFn} />
      <View style={styles.container}>
        <Button style={styles.single} type="primary">
          Single copy only
        </Button>
        <Button style={styles.single} type="primary">
            More than one copies
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  single: {
    width: '90%',
    backgroundColor: Secondary,
    borderWidth: 0,
    marginBottom: 10,
    minHeight: 10,
  },
});

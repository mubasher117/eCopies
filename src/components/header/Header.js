import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import { registerRootComponent } from "expo";
import {
  InputItem,
  List,
  Picker,
  Checkbox,
  Icon,
} from "@ant-design/react-native";
import { Primary, PrimaryText } from "../../constants/colors";
import { Button } from "react-native-paper";
import { NavigationActions } from "react-navigation";
import { getStatusBarHeight } from "react-native-status-bar-height";
const { height, width } = Dimensions.get("window");
export default function Header(props) {
  return (
    <View >
      <View  style={styles.container}>
      {props.backbutton ? (
        <Icon
          onPress={props.goBackFn}
          name="arrow-left"
          style={styles.headerIcon}
          color={PrimaryText}
        />
      ) : (
        <Icon
          onPress={props.openDrawerFn}
          name="menu"
          color={PrimaryText}
          style={styles.headerIcon}
        />
      )}
      <Text style={styles.headerText}>{props.title}</Text></View>
      <View elevation={5} style={styles.divider}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Primary,
    width: width,
    height: getStatusBarHeight() + 50,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: PrimaryText,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginLeft: 20,
  },
  headerIcon: {
    marginTop: 35,
    marginLeft: 10,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: PrimaryText,
    marginBottom: 10,
  },
});

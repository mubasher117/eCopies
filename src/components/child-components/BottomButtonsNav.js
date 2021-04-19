import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { PrimaryText, PrimaryLight, Secondary } from "../../constants/colors";

import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
} from "@ant-design/react-native";
export default function BottomButtonsNav(props) {
  return (
    <View style={styles.buttonsContainer}>
      <Button style={styles.previous} type="primary" onPress={props.previous}>
        <Text style={{ color: Secondary }}>Previous</Text>
      </Button>
      <Button style={styles.next} type="primary" onPress={props.next}>
        Next
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 40,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-end",
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
});

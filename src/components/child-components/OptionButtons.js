import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  PrimaryText,
  PrimaryLight,
  Secondary,
} from "../../constants/colors";
import {
  Button,
} from "@ant-design/react-native";
export default function OptionButtons(props) {
  const [active1, setActive1] = useState(true);
  useEffect(() => {
    props.active ? setActive1(false) : setActive1(true);
  }, [props.active]);
  const _handleOption1 = () => {
    if (!active1) {
      setActive1(true);
      props._handleOption1();
    }
  };
  const _handleOption2 = () => {
    if (active1) {
      setActive1(false);
      props._handleOption2();
    }
  };
  return (
    <View style={styles.container}>
      {props.label && (
        <View style={styles.labelContainerWithTranslation}>
          <Text style={styles.label}>{props.label}</Text>
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <Button
          onPress={_handleOption1}
          style={active1 ? styles.btnActive : styles.btnInactive}
        >
          <Text style={active1 ? styles.txtActive : styles.txtInactive}>
            {props.option1}
          </Text>
        </Button>
        <Button
          onPress={_handleOption2}
          style={!active1 ? styles.btnActive : styles.btnInactive}
        >
          <Text style={!active1 ? styles.txtActive : styles.txtInactive}>
            {props.option2}
          </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnActive: {
    width: "47%",
    height: 45,
    backgroundColor: Secondary,
    borderWidth: 0,
  },
  txtActive: {
    color: "white",
    fontWeight: "bold",
  },
  btnInactive: {
    width: "47%",
    height: 45,
    backgroundColor: "#F1F3F2",
    borderWidth: 0,
  },
  txtInactive: {
    color: Secondary,
  },
  labelContainerWithTranslation: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

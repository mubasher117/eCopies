import React from "react";
import { View, StyleSheet, Dimensions  } from "react-native";

import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";


const { height, width } = Dimensions.get("window");

export default () => {
  return (
    <View>
      <View style={[styles.container, { opacity: containerOpacity }]}>
        Help and support
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
});

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
} from "../../constants/colors";
import { TextInput, Chip, FAB } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import store from "../../redux/store";
// import { nameValidator2 } from "../../core/utils";
import { Value } from "react-native-reanimated";
const { height, width } = Dimensions.get("window");
import {styles} from '../../styles/CopyForm'
export const Parties = ({plaintiff, defendant, setPlaintiff, setDefendant}) => {
  return (
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
  );
}


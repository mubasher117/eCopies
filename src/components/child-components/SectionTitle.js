import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {
  PrimaryText,
  PrimaryLight,
  Secondary,
} from "../../constants/colors";
export default function SectionTitle(props){
    return (
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sctionTitle}>{props.title}</Text>
      </View>
    );
}
const styles = StyleSheet.create({
  sectionTitleContainer: {
    borderBottomColor: PrimaryText,
    borderBottomWidth: 1,
    marginTop: 20,
    marginBottom: 60,
  },
  sctionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: PrimaryText,
  },})
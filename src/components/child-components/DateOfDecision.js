
import React, {useState} from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet, Dimensions } from "react-native";
import { Chip, FAB } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {PrimaryText, PrimaryLight, Secondary} from '../../constants/colors';
const { height, width } = Dimensions.get("window");
export default function DateOfDecision(props){
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const showDatepicker = () => {
    setShow(!show);
  };
  var decisionDate = date.toDateString().toString();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    props.setDate(selectedDate.toDateString().toString());
  };
    return (
      <View style={styles.infoContainer}>
        <View
          style={[
            styles.labelContainer,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <Text style={styles.label}>Date of Decision</Text>
          <Text style={styles.label}>تاریخ فیصلہ</Text>
        </View>
        <TouchableOpacity
          style={styles.valueContainer}
          onPress={showDatepicker}
        >
          <Chip
            style={{
              alignItems: "center",
              borderRadius: 5,
            }}
            textStyle={{
              color: PrimaryText,
              fontSize: 16,
              padding: 10,
            }}
          >
            {decisionDate}
          </Chip>
          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </TouchableOpacity>
      </View>
    );
}



const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: PrimaryLight,
    width: "100%",
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
});

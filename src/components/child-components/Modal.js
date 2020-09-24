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
  Modal,
} from "react-native";
import Styles from '../../styles/Modal'
import { useSelector, useDispatch } from "react-redux";
import {
  InputItem,
  Tag,
  ActivityIndicator,
  Steps,
  Tabs,
  Button,
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
import { database } from "../../api/firebase/authenication";
import store from "../../redux/store";
const { height, width } = Dimensions.get("window");
export default function (props){
  const hideModal = () => {
    props.hideModal()
  }
  const showModal = () => {
    props.showModal();
  };
  const _handleOkay = () => {
    props.handleOkay();
  }
  const cancel = () => {
    props.cancel();
  }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          hideModal();
        }}
      >
        <View style={Styles.centeredView}>
          <View style={Styles.modalView}>
            {props.quitButton && (
              <TouchableOpacity
                style={{ alignSelf: "flex-end", margin: -15, marginBottom: 10 }}
                onPress={hideModal}
              >
                <Image
                  style={Styles.modalQuit}
                  source={require("../../../assets/images/static/quit.png")}
                />
              </TouchableOpacity>
            )}
            <Text style={Styles.modalText}>{props.text}</Text>
            {props.urduText && (
              <Text style={Styles.modalText}>{props.urduText}</Text>
            )}

            {props.buttonOkText && (
              <Button
                style={Styles.buttonModalClose}
                type="primary"
                onPress={_handleOkay}
              >
                {props.buttonOkText}
              </Button>
            )}
            {props.buttonSuccessText && (
              <Button
                style={Styles.buttonModalClose}
                type="primary"
                onPress={_handleOkay}
              >
                {props.buttonSuccessText}
              </Button>
            )}
            {/* If 'options' props is provided */}
            {props.options && (
              <View style={Styles.modalButtonsContainer}>
                <Button style={Styles.optionButtons} type="primary">
                  <Text style={Styles.textButtonNo}>No</Text>
                </Button>
                <Button style={Styles.optionButtons} type="primary">
                  <Text style={Styles.textButtonYes}>Yes</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
}

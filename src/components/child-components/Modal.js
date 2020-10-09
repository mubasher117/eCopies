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
            {/* If Yes/No Buttons are required */}
            {props.optionsYes && (
              <View style={Styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={Styles.optionButtons}
                  type="primary"
                  onPress={props.handleNo}
                >
                  <Text style={Styles.textButtonOption}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Styles.optionButtons}
                  type="primary"
                  onPress={props.handleYes}
                >
                  <Text style={Styles.textButtonOption}>Yes</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* If Okay/Cancel Buttons are required */}
            {props.optionsOk && (
              <View style={Styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={Styles.optionButtons}
                  type="primary"
                  onPress={props.handleCancel}
                >
                  <Text style={Styles.textButtonOption}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Styles.optionButtons}
                  type="primary"
                  onPress={props.handleOk}
                >
                  <Text style={Styles.textButtonOption}>Ok</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
}

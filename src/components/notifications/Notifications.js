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
  Modal,
  Image,
  TouchableHighlight,
  PixelRatio,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
  List,
} from "@ant-design/react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import { TextInput, FAB, Button as PaperButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../header/Header";
import ModalPicker from "react-native-modal-picker";
import { NavigationActions } from "react-navigation";
import { ImagePropTypes } from "react-native";
import { not } from "react-native-reanimated";
import { TouchableOpacity } from "react-native-gesture-handler";
import store from "../../redux/store";
import { seeNotification } from "../../api/firebase/backend";
import { database } from "../../api/firebase/authenication";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");
const Item = List.Item;

// Code to normalize size on each type of screen
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
// till here
export default function Notifications(props) {
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [documemnts, setdocumemnts] = useState([
    { key: 1 },
    { key: 2 },
    { key: 3 },
  ]);
  let notificationsState = useSelector(
    (state) => state.ordersReducer.notifications
  );
  useEffect(() => {
    if (notificationsState != undefined) {
      setNotifications(notificationsState);
      //console.log("set Notifications", notificationsState);
    } else {
      console.log("set Notifications", notificationsState);
    }
  }, [notificationsState]);
  const goBackFn = () => {
    props.navigation.navigate("CopyFormCase");
  };
  const addDoc = () => {
    // Deep Copy of documents
    var tempDocs = Array.from(documemnts);
    tempDocs.push({ key: documemnts.length + 1 });
    setdocumemnts(tempDocs);
  };

  const showModal = () => {
    setIsModalVisible(true);
    setcontainerOpacity(0.05);
    console.log(isModalVisible);
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setcontainerOpacity(1);
    console.log(isModalVisible);
  };
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const openNotification = (notification) => {
    console.log(notification);
    let state = store.getState();
    let myOrders = state.ordersReducer.myOrders;
    console.log(myOrders);
    seeNotification(notification);
    let index = myOrders.findIndex(obj => obj.id == notification.orderId)
    console.log(index)
    props.navigation.navigate("OrderDetails", {
      details: myOrders[index],
      screen: "Notifications",
    });
  };
  return (
    <SafeAreaView
      behaviour="padding"
      style={[
        styles.container,
        {
          opacity: containerOpacity,
        },
      ]}
    >
      <Header title="Notifications" openDrawerFn={openDrawerFn} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please transfer the amount equivalent to charges to account
            </Text>
            <Button
              style={styles.buttonModalClose}
              type="primary"
              onPress={hideModal}
            >
              OK
            </Button>
          </View>
        </View>
      </Modal>
      <ScrollView>
        {!notifications.length && (
          <View style={styles.centeredView}>
            <PaperButton
              mode="contained"
              onPress={() => console.log("Pressed")}
              color={Secondary}
              loading
              style={{
                width: "60%",
                marginTop: "65%",
              }}
            >
              Loading
            </PaperButton>
          </View>
        )}
        {notifications.map((notification, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => openNotification(notification)}>
              <Item
                thumb={
                  <Image
                    source={require("../../../assets/images/static/app-logo.png")}
                    style={styles.logo}
                  />
                }
                // onPress={() => alert("tapped")}
                key={index}
                style={
                  notification.isSeen ? null : { backgroundColor: "#E7EAE8" }
                }
              >
                <Text style={styles.text}>{notification.body}</Text>
                <Text style={styles.time}>
                  {new Date(notification.createdOn).toDateString()}
                </Text>
              </Item>
            </TouchableOpacity>
          );
        })}
        <View style={{ width: width, height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderColor: PrimaryText,
    borderWidth: 0.5,
  },
  text: { marginLeft: 10, fontSize: 12 },
  time: { marginLeft: 20, fontSize: 14, color: "grey" },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});

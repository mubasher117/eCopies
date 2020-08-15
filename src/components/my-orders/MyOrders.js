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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
  Tabs,
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
import OrderStatusCard from "../child-components/OrderStatusCard";
const Step = Steps.Step;
const { height, width } = Dimensions.get("window");


export default function MyOrders(props) {
  const details = props.navigation.getParam("details", "N/A");

  let tempMyOrders = useSelector((state) => state.ordersReducer.myOrders);
  const [myOrders, setMyOrders] = useState([]);
  useEffect(() => {
    if (tempMyOrders != undefined) {
      setMyOrders(tempMyOrders);
    }
  }, [tempMyOrders]);
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  const tabs = [{ title: "Orders" }, { title: "Urgent" }];
  return (
    <View style={styles.container}>
      <Header title="My Orders" openDrawerFn={openDrawerFn} />
      <ScrollView>
        <View style={styles.centeredView}>
          {myOrders.map((order, index) => {
            return (
              <OrderStatusCard
                key={index}
                order={order}
                seeDetails={() =>
                  props.navigation.navigate("OrderDetails", {
                    details: order,
                    screen: "MyOrders",
                  })
                }
                updateStatus={() => {
                  props.navigation.navigate("OrderStatus", {
                    details: order,
                    screen: "MyOrders",
                  });
                }}
              />
            );
          })}
        </View>

        <View style={{ width: "100%", height: 150 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  orderNo: {
    fontSize: 24,
    fontWeight: "bold",
  },
  entity: {
    fontSize: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

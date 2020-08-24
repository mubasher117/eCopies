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
import { TextInput, Chip, Button } from "react-native-paper";
import Header from "../header/Header";
import OrderStatusCard from "../child-components/OrderStatusCard";
import store from '../../redux/store'
const { height, width } = Dimensions.get("window");

export default function MyOrders(props) {
  store.subscribe(() => {
    console.log("STATE Changed")
  })
  //const details = props.navigation.getParam("details", "N/A");
  //let tempMyOrders = useSelector((state) => state.ordersReducer.myOrders);
  const [myOrders, setMyOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noOrders, setNoOrders] = useState(false);
  const getMyOrders = () =>
   new Promise(async(resolve, reject) => {
      let state = store.getState();
      let myOrders = state.ordersReducer.myOrders;
      console.log(myOrders)
      await setMyOrders(tempMyOrders);
      resolve()
   })
  useEffect(() => {
    let state = store.getState();
    let myOrders = state.ordersReducer.myOrders;
    setMyOrders(myOrders);
    const unsubscribe = props.navigation.addListener("didFocus", () => {
      console.log("FOCUSED")
      let state = store.getState();
      let myOrders = state.ordersReducer.myOrders;
      setMyOrders(myOrders);
    });
    return () => unsubscribe;
  }, []);
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  // If user has no orders
  setTimeout(() => {
    setNoOrders(true);
  }, 2000);
  return (
    <View style={styles.container}>
      <Header title="My Orders" openDrawerFn={openDrawerFn} />
      <ScrollView>
        {!myOrders.length && !noOrders ? (
          <View style={styles.centeredView}>
            <Button
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
            </Button>
          </View>
        ) : (
          <View></View>
        )}
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

        <View
          style={{
            width: "100%",
            height: 150,
          }}
        />
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

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


import { getStatusBarHeight } from "react-native-status-bar-height";
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
import store from "../../redux/store";
import AsyncStorage from "@react-native-community/async-storage";
const { height, width } = Dimensions.get("window");

export default function MyOrders(props) {
  const details = props.navigation.getParam("details", "N/A");
  let tempMyOrders = useSelector((state) => state.ordersReducer.myOrders);
  const [myOrders, setMyOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (tempMyOrders != undefined) {
      setMyOrders(tempMyOrders);
      console.log(tempMyOrders);
      setIsLoading(false);
    }
  }, [tempMyOrders]);
  // Function to be passed to Header
  const openDrawerFn = () => {
    props.navigation.toggleDrawer();
  };
  return (
    <View style={styles.container}>
      <Header title="My Orders" openDrawerFn={openDrawerFn} />
      <ScrollView>
        <View
          style={[
            styles.centeredView,
            {
              height: !myOrders.length ? height - (getStatusBarHeight() + 50) : 'auto',
            },
          ]}
        >
          {isLoading ? (
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
          ) : myOrders.length ? (
            myOrders.map((order, index) => {
              return (
                <OrderStatusCard
                  key={index}
                  order={order}
                  seeDetails={async () => {
                    await AsyncStorage.setItem("currentScreen", "MyOrders");
                    props.navigation.navigate("OrderDetails", {
                      details: order,
                      screen: "MyOrders",
                    });
                  }}
                />
              );
            })
          ) : (
            <Text style={styles.noOrders}>No Orders Yet</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Primary,
    width: width,
    minHeight: height,
  },
  centeredView: {
    flex: 1,
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
  noOrders: {
    color: 'gray'
  },
});

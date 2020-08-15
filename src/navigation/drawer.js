import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Primary, Secondary, PrimaryText } from "../constants/colors";
import { createAppContainer } from "react-navigation";
import CopyForm from "../components/copy-form/copy-form-highcourt/CopyForm";
import CopyFormDC from "../components/copy-form/copy-form-dc/CopyFormDC";
import CopyFormCase from "../components/copy-form/copy-form-highcourt/CopyFormCase";
import CopyFormDocs from "../components/copy-form/copy-form-highcourt/CopyFormDocs";
import Payments from "../components/payments/Payments";
import Notifications from "../components/notifications/Notifications";
import { Button } from "react-native-paper";
import { logout, getNotifications } from "../api/firebase/authenication";
import MyOrders from '../components/my-orders/MyOrders'
import { getMyOrders } from "../api/firebase/backend";
import OrderDetails from '../components/order-details/OrderDetails'
const CustomDrawerContentComponent = (props) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isActive, setisActive] = useState("");
  return (
    <View>
      <View style={styles.drawerHeader}>
        <Image
          style={styles.logoImage}
          source={require("../../assets/images/static/app-logo.png")}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            setisActive("profile");
            props.navigation.navigate("Payments");
          }}
        >
          <View
            style={
              isActive === "profile"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <Image
              style={styles.pageLogo}
              source={require("../../assets/images/static/user.png")}
            />
            <Text
              style={
                isActive === "profile" ? styles.activeLabel : styles.pageLabel
              }
            >
              My Profile
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setisActive("home");
            props.navigation.navigate("CopyFormCase");
          }}
        >
          <View
            style={
              isActive === "home"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <Image
              style={styles.pageLogo}
              source={require("../../assets/images/static/home-icon.png")}
            />
            <Text
              style={
                isActive === "home" ? styles.activeLabel : styles.pageLabel
              }
            >
              Home
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setisActive("orders");
            getMyOrders()
            props.navigation.navigate("MyOrders");
          }}
        >
          <View
            style={
              isActive === "orders"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <Image
              style={styles.pageLogo}
              source={require("../../assets/images/static/form-icon.png")}
            />
            <Text
              style={
                isActive === "orders" ? styles.activeLabel : styles.pageLabel
              }
            >
              My Orders
            </Text>
          </View>
        </TouchableOpacity>
{/* 
        <TouchableOpacity
          onPress={() => {
            setisActive("history");
            props.navigation.navigate("Payments");
          }}
        >
          <View
            style={
              isActive === "history"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <Image
              style={styles.pageLogo}
              source={require("../../assets/images/static/order-history.png")}
            />
            <Text
              style={
                isActive === "history" ? styles.activeLabel : styles.pageLabel
              }
            >
              Previous Orders
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            setisActive("payments");
            props.navigation.navigate("Payments");
          }}
        >
          <View
            style={
              isActive === "payments"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <Image
              style={styles.pageLogo}
              source={require("../../assets/images/static/payment-icon.png")}
            />
            <Text
              style={
                isActive === "payments" ? styles.activeLabel : styles.pageLabel
              }
            >
              Payments
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setisActive("notifications");
            getNotifications();
            props.navigation.navigate("Notifications");
          }}
        >
          <View
            style={
              isActive === "notifications"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <Image
              style={styles.pageLogo}
              source={require("../../assets/images/static/notification-icon.png")}
            />
            <Text
              style={
                isActive === "notifications"
                  ? styles.activeLabel
                  : styles.pageLabel
              }
            >
              Notifications
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <View elevation={5} style={styles.divider} />

        <TouchableOpacity
          onPress={() => {
            setisActive("settings");
            props.navigation.navigate("Payments");
          }}
        >
          <View
            style={
              isActive === "settings"
                ? styles.pageLowerActiveContainer
                : styles.pageLowerContainer
            }
          >
            <Text
              style={
                isActive === "settings"
                  ? styles.pageLowerActiveLabel
                  : styles.pageLowerLabel
              }
            >
              Settings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setisActive("terms");
            props.navigation.navigate("Payments");
          }}
        >
          <View
            style={
              isActive === "terms"
                ? styles.pageLowerActiveContainer
                : styles.pageLowerContainer
            }
          >
            <Text
              style={
                isActive === "terms"
                  ? styles.pageLowerActiveLabel
                  : styles.pageLowerLabel
              }
            >
              Terms & Conditions
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setisActive("logout");
            logout()
            props.navigation.navigate("auth");
          }}
        >
          <View
            style={
              isActive === "logout"
                ? styles.pageLowerActiveContainer
                : styles.pageLowerContainer
            }
          >
            <Text
              style={
                isActive === "logout"
                  ? styles.pageLowerActiveLabel
                  : styles.pageLowerLabel
              }
            >
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Drawer = createDrawerNavigator(
  {
    CopyForm: {
      screen: CopyForm,
    },
    CopyFormDC: {
      screen: CopyFormDC,
    },
    CopyFormCase: {
      screen: CopyFormCase,
    },
    CopyFormDocs: {
      screen: CopyFormDocs,
    },
    Payments: {
      screen: Payments,
    },
    Notifications: {
      screen: Notifications,
    },
    MyOrders: {
      screen: MyOrders,
    },
    OrderDetails: {
      screen: OrderDetails,
    },
  },
  {
    initialRouteName: "CopyFormCase",
    drawerPosition: "left",
    contentComponent: CustomDrawerContentComponent,
    drawerOpenRoute: "DrawerOpen",
    drawerCloseRoute: "DrawerClose",
    drawerToggleRoute: "DrawerToggle",
  }
);

const MyApp = createAppContainer(Drawer);
export default MyApp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  drawerHeader: {
    height: 200,
    backgroundColor: Secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    height: 150,
    width: 150,
  },
  pageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 20,
  },
  pageLogo: {
    height: 30,
    width: 30,
  },
  pageLabel: {
    fontSize: 16,
    marginLeft: "10%",
    fontWeight: "bold",
  },
  activeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: -10,
    backgroundColor: "#EEEEEE",
  },
  activeLabel: {
    fontSize: 16,
    marginLeft: "10%",
    fontWeight: "bold",
    color: Secondary,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  divider: {
    width: "100%",
    height: 0.3,
    backgroundColor: PrimaryText,
    marginTop: 30,
    marginBottom: 4,
  },
  pageLowerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 0,
    paddingTop: 20,
  },
  pageLowerLabel: {
    fontSize: 16,
    marginLeft: "5%",
    fontWeight: "bold",
  },
  pageLowerActiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 0,
    marginTop:10,
    marginBottom:-10,
    paddingTop: 10,
    paddingBottom:10,
    backgroundColor: "#EEEEEE",
  },
  pageLowerActiveLabel: {
    fontSize: 16,
    marginLeft: "5%",
    fontWeight: "bold",
    color:Secondary
  },
});

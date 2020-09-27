import React, { useState, useEffect } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import {
  Primary,
  Secondary,
  PrimaryText,
  SecondaryLight,
} from "../constants/colors";
import { createAppContainer } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";
import CopyFormHomePage from "../components/copy-form/HomePage";
import CopyForm from "../components/copy-form/copy-form-highcourt/CopyForm";
import CopyFormDC from "../components/copy-form/copy-form-dc/CopyFormDC";
import CopyFormCase from "../components/copy-form/copy-form-highcourt/CopyFormCase";
import CopyFormCase2 from "../components/copy-form/copy-form-highcourt/CopyFormCase2";
import CopyFormDocs from "../components/copy-form/copy-form-highcourt/CopyFormDocs";
import OrderOptions from "../components/copy-form/OrderOptions";
import SubmitDetails from "../components/copy-form/copy-form-highcourt/SubmitDetails";
import Payments from "../components/payments/Payments";
import Notifications from "../components/notifications/Notifications";
import { getNotifications } from "../api/firebase/authenication";
import { logout } from "../services/auth/AuthService";
import MyOrders from "../components/my-orders/MyOrders";
import { getMyOrders } from "../api/firebase/backend";
import OrderDetails from "../components/order-details/OrderDetails";
import Profile from "../components/profile/Profile";
import RevenueCopyForm from "../components/copy-form/revenue-court/CopyForm";
import RevenueCopyForm2 from "../components/copy-form/revenue-court/CopyForm2";
import LowerCourtsSelectCourt from '../screens/copy-forms/copy-form-lower-courts/SelectCourt'
import LowerCourtsForm1 from '../screens/copy-forms/copy-form-lower-courts/CopyForm1'
import LowerCourtsForm2 from "../screens/copy-forms/copy-form-lower-courts/CopyForm2";
import LowerCourtsForm3 from "../screens/copy-forms/copy-form-lower-courts/CopyForm3";
const CustomDrawerContentComponent = (props) => {
  const [isActive, setisActive] = useState("home");
  return (
    <View>
      <View style={styles.drawerHeader}>
        <Image
          style={styles.logoImage}
          source={require("../../assets/images/static/logo-white.png")}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            setisActive("profile");
            props.navigation.navigate("Profile");
          }}
        >
          <View
            style={
              isActive === "profile"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <View style={styles.pageLogoContainer}>
              <Image
                style={styles.pageLogo}
                source={require("../../assets/images/static/user.png")}
              />
            </View>
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
            props.navigation.navigate("CopyFormHomePage");
          }}
        >
          <View
            style={
              isActive === "home"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <View style={styles.pageLogoContainer}>
              <Image
                style={styles.pageLogo}
                source={require("../../assets/images/static/home-icon.png")}
              />
            </View>
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
          onPress={async () => {
            let forms;
            try {
              forms = await AsyncStorage.getItem("@forms");
              forms = JSON.parse(forms)
            } catch (error) {
              console.log(error);
            }
            console.log("FORMS:  ", forms);
            if (forms) {
              console.log(forms.length)
              if (forms.length) {
                setisActive("currentOrder");
                props.navigation.navigate("SubmitDetails");
              } else {
                alert("You don't have any unsubmitted form.");
              }
            } else {
              alert("You don't have any unsubmitted form.");
            }
          }}
        >
          <View
            style={
              isActive === "currentOrder"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <View style={styles.pageLogoContainer}>
              <Image
                style={styles.pageLogo}
                source={require("../../assets/images/static/order.png")}
              />
            </View>
            <Text
              style={
                isActive === "currentOrder"
                  ? styles.activeLabel
                  : styles.pageLabel
              }
            >
              Unsubmitted Forms
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setisActive("orders");
            getMyOrders();
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
            <View style={[styles.pageLogoContainer, { paddingLeft: 4 }]}>
              <Image
                style={styles.pageLogo}
                source={require("../../assets/images/static/form-icon.png")}
              />
            </View>
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
            <View style={styles.pageLogoContainer}>
              <Image
                style={styles.pageLogo}
                source={require("../../assets/images/static/payment-icon.png")}
              />
            </View>
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
            <View style={[styles.pageLogoContainer]}>
              <Image
                style={styles.pageLogo}
                source={require("../../assets/images/static/notification-icon.png")}
              />
            </View>
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
        {/* 
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
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => {
            setisActive("logout");
            logout();
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
    OrderOptions: {
      screen: OrderOptions,
    },
    CopyForm: {
      screen: CopyForm,
    },
    CopyFormDC: {
      screen: CopyFormDC,
    },
    CopyFormCase: {
      screen: CopyFormCase,
    },
    CopyFormCase2: {
      screen: CopyFormCase2,
    },
    CopyFormDocs: {
      screen: CopyFormDocs,
    },
    SubmitDetails: {
      screen: SubmitDetails,
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
    CopyFormHomePage: {
      screen: CopyFormHomePage,
    },
    Profile: {
      screen: Profile,
    },
    RevenueCopyForm: RevenueCopyForm,
    RevenueCopyForm2: RevenueCopyForm2,
    LowerCourtsSelectCourt: LowerCourtsSelectCourt,
    LowerCourtsForm1: LowerCourtsForm1,
    LowerCourtsForm2: LowerCourtsForm2,
    LowerCourtsForm3: LowerCourtsForm3,
  },
  {
    initialRouteName: "CopyFormHomePage",
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
  pageLogoContainer: {
    backgroundColor: SecondaryLight,
    borderRadius: 50,
    height: 33,
    width: 33,
    alignItems: "center",
    justifyContent: "center",
  },
  pageLogo: {
    height: 25,
    width: 25,
  },
  pageLabel: {
    fontSize: 14,
    marginLeft: "10%",
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
    fontSize: 14,
    marginLeft: "5%",
  },
  pageLowerActiveContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 0,
    marginTop: 10,
    marginBottom: -10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#EEEEEE",
  },
  pageLowerActiveLabel: {
    fontSize: 16,
    marginLeft: "5%",
    fontWeight: "bold",
    color: Secondary,
  },
});

import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { useSelector, useDispatch } from "react-redux";
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
import { getMyOrders, getTrackingId } from "../api/firebase/backend";
import OrderDetails from "../components/order-details/OrderDetails";
import Profile from "../components/profile/Profile";
import RevenueCopyForm from "../components/copy-form/revenue-court/CopyForm";
import RevenueCopyForm2 from "../components/copy-form/revenue-court/CopyForm2";
import LowerCourtsSelectCourt from "../screens/copy-forms/copy-form-lower-courts/SelectCourt";
import LowerCourtsForm1 from "../screens/copy-forms/copy-form-lower-courts/CopyForm1";
import LowerCourtsForm2 from "../screens/copy-forms/copy-form-lower-courts/CopyForm2";
import LowerCourtsForm3 from "../screens/copy-forms/copy-form-lower-courts/CopyForm3";
import LowerCourtsFormDate from "../screens/copy-forms/copy-form-lower-courts/CopyFormDate";
import TrackOrder from "../screens/track-order/TrackOrder";
import DrawerCart from "../components/child-components/DrawerCart";
import HelpAndSupport from "../screens/help-and-support/index";
const CustomDrawerContentComponent = (props) => {
  const [isActive, setisActive] = useState("home");
  const dispatch = useDispatch();
  const currentScreen = useSelector(
    (state) => state.navigationReducer.currentScreen
  );
  return (
    <ScrollView>
      <View style={styles.drawerHeader}>
        <Image
          style={styles.logoImage}
          source={require("../../assets/images/static/logo-white.png")}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: "SET_CURRENT_SCREEN",
              payload: "Profile",
            });
            props.navigation.navigate("Profile");
          }}
        >
          <View
            style={
              currentScreen === "Profile"
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
                currentScreen === "Profile"
                  ? styles.activeLabel
                  : styles.pageLabel
              }
            >
              My Profile
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: "SET_CURRENT_SCREEN",
              payload: "CopyFormHomePage",
            });
            props.navigation.navigate("CopyFormHomePage");
          }}
        >
          <View
            style={
              currentScreen === "CopyFormHomePage"
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
                currentScreen === "CopyFormHomePage"
                  ? styles.activeLabel
                  : styles.pageLabel
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
              forms = JSON.parse(forms);
            } catch (error) {
              console.log(error);
            }
            console.log("FORMS:  ", forms);
            if (forms) {
              console.log(forms.length);
              if (forms.length) {
                dispatch({
                  type: "SET_CURRENT_SCREEN",
                  payload: "SubmitDetails",
                });
                props.navigation.navigate("SubmitDetails");
              } else {
                alert("You don't have any form in cart.");
              }
            } else {
              alert("You don't have any form in cart.");
            }
          }}
        >
          <View
            style={
              currentScreen === "SubmitDetails"
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
            <DrawerCart
              isActive={currentScreen === "SubmitDetails" ? true : false}
            />
            {/* <Text
              style={
                isActive === "currentOrder"
                  ? styles.activeLabel
                  : styles.pageLabel
              }
            >
              Cart
            </Text> */}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: "SET_CURRENT_SCREEN",
              payload: "MyOrders",
            });
            getMyOrders();
            props.navigation.navigate("MyOrders");
          }}
        >
          <View
            style={
              currentScreen === "MyOrders"
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
                currentScreen === "MyOrders"
                  ? styles.activeLabel
                  : styles.pageLabel
              }
            >
              My Orders
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: "SET_CURRENT_SCREEN",
              payload: "TrackOrder",
            });
            getTrackingId();
            props.navigation.navigate("TrackOrder");
          }}
        >
          <View
            style={
              currentScreen === "TrackOrder"
                ? styles.activeContainer
                : styles.pageContainer
            }
          >
            <View style={[styles.pageLogoContainer, { paddingLeft: 4 }]}>
              <Image
                style={styles.pageLogo}
                source={require("../../assets/images/static/track-order.png")}
              />
            </View>
            <Text
              style={
                currentScreen === "TrackOrder"
                  ? styles.activeLabel
                  : styles.pageLabel
              }
            >
              Track Order
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
            dispatch({
              type: "SET_CURRENT_SCREEN",
              payload: "Payments",
            });
            props.navigation.navigate("Payments");
          }}
        >
          <View
            style={
              currentScreen === "Payments"
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
                currentScreen === "Payments"
                  ? styles.activeLabel
                  : styles.pageLabel
              }
            >
              Payments
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: "SET_CURRENT_SCREEN",
              payload: "Notifications",
            });
            getNotifications();
            props.navigation.navigate("Notifications");
          }}
        >
          <View
            style={
              currentScreen === "Notifications"
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
                currentScreen === "Notifications"
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
        {/* <TouchableOpacity
          onPress={() => {
            setisActive("helpAndSupport");
            props.navigation.navigate("HelpAndSupport");
          }}
        >
          <View
            style={
              isActive === "helpAndSupport"
                ? styles.pageLowerActiveContainer
                : styles.pageLowerContainer
            }
          >
            <Text
              style={
                isActive === "helpAndSupport"
                  ? styles.pageLowerActiveLabel
                  : styles.pageLowerLabel
              }
            >
              Help and Support
            </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: "SET_CURRENT_SCREEN",
              payload: "auth",
            });
            logout();
            props.navigation.navigate("auth");
          }}
        >
          <View
            style={
              currentScreen === "auth"
                ? styles.pageLowerActiveContainer
                : styles.pageLowerContainer
            }
          >
            <Text
              style={
                currentScreen === "auth"
                  ? styles.pageLowerActiveLabel
                  : styles.pageLowerLabel
              }
            >
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    LowerCourtsFormDate: LowerCourtsFormDate,
    TrackOrder: TrackOrder,
    HelpAndSupport: HelpAndSupport,
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
  pageLogoContainer: {},
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

import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Primary, Secondary } from "../constants/colors";
import { createAppContainer } from "react-navigation";
import CopyForm from "../components/copy-form/copy-form-highcourt/CopyForm";
import CopyFormDC from "../components/copy-form/copy-form-dc/CopyFormDC";
import CopyFormCase from "../components/copy-form/copy-form-highcourt/CopyFormCase";
import CopyFormDocs from "../components/copy-form/copy-form-highcourt/CopyFormDocs";
import Payments from '../components/payments/Payments'
import { Button } from "react-native-paper";
const CustomDrawerContentComponent = (props) => (
  <View style={styles.drawerHeader}>
    <Image
      style={styles.drawerImage}
      source={require("../../assets/images/static/app-logo.png")}
    />
    <DrawerItems {...props} />
  </View>
);

const Drawer = createDrawerNavigator(
  {
    CopyForm: {
      screen: CopyForm,
      drawerLabel: "Copy Form High Court",
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
  },
  {
    initialRouteName: "CopyForm",
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
    height: 250,
    backgroundColor: Secondary,
  },
  drawerImage: {
    height: 150,
    width: 150,
    margin: 50,
  },
});

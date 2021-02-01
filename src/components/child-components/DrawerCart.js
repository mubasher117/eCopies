import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Secondary, PrimaryText } from "../../constants/colors";
export default ({ isActive }) => {
    const [cartItems, setCartItems] = useState();
    const getCartItems = async() => {
        let forms = await AsyncStorage.getItem("@forms");
        if (forms) {
          forms = JSON.parse(forms);
          if (forms.length) {
            setCartItems(forms.length);
          } else {
            setCartItems(null);
          }
        } else {
          setCartItems(null);
        }
    }
    useEffect(() => {
        setInterval(() => {
        getCartItems();}, 1000)
    }, [])
  return (
    <Text
      style={
        [isActive ? styles.activeLabel : styles.pageLabel, cartItems ? {fontWeight: "bold"} : null]
      }
    >
      Cart {cartItems ? "(" + cartItems + ")" : ""}
    </Text>
  );
};

const styles = StyleSheet.create({
  activeLabel: {
    fontSize: 16,
    marginLeft: "10%",
    fontWeight: "bold",
    color: Secondary,
  },
  pageLabel: {
    fontSize: 14,
    marginLeft: "10%",
  },
});
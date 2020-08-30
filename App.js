import { StatusBar } from "expo-status-bar";
import { AppLoading } from "expo";
import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Provider as AntProvider } from "@ant-design/react-native";
import * as Font from "expo-font";
import MyApp from "./src/navigation/navigation";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-community/async-storage";
import * as firebase from "firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function App(props) {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  useEffect(() => {
  }, []);
  const [fontLoaded] = Font.useFonts({
    antoutline: require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
  });
  if (!fontLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <PaperProvider>
          <AntProvider>
            <MyApp />
          </AntProvider>
        </PaperProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});


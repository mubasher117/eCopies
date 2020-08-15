import { StatusBar } from "expo-status-bar";
import { AppLoading, Notifications } from "expo";
import { Permissions } from "expo-permissions";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider as AntProvider } from "@ant-design/react-native";
import * as Font from "expo-font";
import MyApp from "./src/navigation/navigation";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import AsyncStorage from "@react-native-community/async-storage";
export default function App(props) {
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

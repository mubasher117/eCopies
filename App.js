import { StatusBar } from "expo-status-bar";
import { AppLoading, Notifications } from "expo";
import { Permissions } from "expo-permissions";
import React, {useEffect} from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "@ant-design/react-native";
import * as Font from "expo-font";
import MyApp from './src/navigation/navigation'
import { Provider as PaperProvider } from "react-native-paper";
export default function App() {
  const [fontLoaded] = Font.useFonts({
    antoutline: require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
  });
  if (!fontLoaded) {
    return <AppLoading />;
  } else {
    return (
      <PaperProvider>
      <Provider>
        <MyApp/>
      </Provider>
      </PaperProvider>
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

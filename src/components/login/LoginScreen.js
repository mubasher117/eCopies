import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import Logo from "../child-components/Logo";
import Header from "../child-components/Header";
import { TextInput, Chip } from "react-native-paper";
import BackButton from "../child-components/BackButton";
import { emailValidator, passwordValidator } from "../core/utils";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../../constants/colors";
import {
  InputItem,
  Tag,
  Button,
  ActivityIndicator,
  Steps,
} from "@ant-design/react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { login } from "../../api/firebase/authenication";
const { height, width } = Dimensions.get("window");
export default function LoginScreen(props) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);
  const callBackLogin = (type, message) => {
    setcontainerOpacity(1);
    setshowLoading(false);
    if (type == "success") {
      setEmail({ value: "", error: "" });
      setPassword({ value: "", error: "" });
      console.log("success");
      props.navigation.navigate("CopyFormHomePage");
    } else {
      alert(message);
    }
  };
  const loginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    } else {
      setshowLoading(true);
      setcontainerOpacity(0.3);
      console.log("Pressed");
      login(email.value, password.value, false, callBackLogin);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={[styles.container, { opacity: containerOpacity }]}>
        <BackButton goBack={() => props.navigation.navigate("Home")} />

        <View style={{ width: "90%" }}>
          <View style={styles.centeredView}>
            <Logo />
          </View>
          <View style={styles.centeredView}>
            <Header>Welcome back.</Header>
          </View>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          {/* <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      /> */}
          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.label}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <Button style={styles.button} type="primary" onPress={loginPressed}>
            Login
          </Button>

          <View style={styles.row}>
            <Text style={styles.label}>Don’t have an account? </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Register")}
            >
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ActivityIndicator
        animating={showLoading}
        toast
        size="large"
        text="Submitting..."
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryLight,
    width: width,
    minHeight: height,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    color: Secondary,
  },
  link: {
    fontWeight: "bold",
    color: Secondary,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Secondary,
    borderWidth: 0,
    marginBottom: 10,
  },
});

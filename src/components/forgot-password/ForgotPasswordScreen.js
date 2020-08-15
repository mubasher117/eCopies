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
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from "../core/utils";
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
const { height, width } = Dimensions.get("window");
export default function ForgotPasswordScreen(props) {
  const [email, setEmail] = useState({ value: "", error: "" });

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    props.navigation.navigate("Login");
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <BackButton goBack={() => props.navigation.navigate("Login")} />

        <Logo />
        <View style={{ width: "90%" }}>
          <Header>Restore Password</Header>

          <TextInput
            label="E-mail address"
            returnKeyType="done"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <Button style={styles.button} type="primary" onPress={_onSendPressed}>
            Send Reset Instructions
          </Button>

          <TouchableOpacity
            style={styles.back}
            onPress={() => props.navigation.navigate("Login")}
          >
            <Text style={styles.label}>← Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  back: {
    width: "100%",
    marginTop: 12,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Secondary,
    borderWidth: 0,
    marginTop: 12,
    marginBottom: 10,
  },
  label: {
    color: Secondary,
    width: "100%",
  },
});

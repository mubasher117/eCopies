import React, { useState, useEffect } from "react";
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
import store from '../../redux/store'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { updateUserDetails } from "../../api/firebase/authenication";
const { height, width } = Dimensions.get("window");
export default function Profile(props) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [cellNo, setCellNo] = useState({ value: "", error: "" });
  const [address, setAddress] = useState({ value: "", error: "" });
  const [containerOpacity, setcontainerOpacity] = useState(1);
  const [showLoading, setshowLoading] = useState(false);
  const callBackUpdate = async (type, message) => {
    setcontainerOpacity(1);
    setshowLoading(false);
      alert("Details successfully Updated");
      props.navigation.navigate("CopyFormHomePage");
  };

  const _onUpdatePressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    let state = store.getState();
    let user = state.userReducer.user;
    if (nameError) {
      setName({ ...name, error: nameError });
      return;
    } else {
      setshowLoading(true);
      setcontainerOpacity(0.3);
      const userDetails = {
        name: name.value,
        cellNo: cellNo.value,
        address: address.value,
        id: user.id
      };
      updateUserDetails(userDetails, callBackUpdate )
    }
  };
  useEffect(() => {
    let state = store.getState();
    let user = state.userReducer.user;
    setName({...name, value:user.name})
    setCellNo({ ...cellNo, value: user.cellNo });
    setEmail({ ...email, value: user.user.user.email });
    setAddress({...address, value:user.address})
  }, [])

  return (
    <KeyboardAwareScrollView>
      <View style={[styles.container, { opacity: containerOpacity }]}>
        <BackButton
          goBack={() => props.navigation.navigate("CopyFormHomePage")}
        />
        <View style={{ width: "90%" }}>
          <Header>Profile</Header>

          <TextInput
            label="Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
            errorText={name.error}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Cell No"
            returnKeyType="next"
            value={cellNo.value}
            onChangeText={(text) => setCellNo({ value: text, error: "" })}
            error={!!cellNo.error}
            errorText={cellNo.error}
            autoCapitalize="none"
            keyboardType="phone-pad"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Email"
            disabled
            value={email.value}
            autoCapitalize="none"
            textContentType="emailAddress"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Address"
            returnKeyType="next"
            value={address.value}
            onChangeText={(text) => setAddress({ value: text, error: "" })}
            error={!!address.error}
            errorText={address.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            style={{ marginBottom: 10 }}
          />

          <Button
            onPress={_onUpdatePressed}
            style={styles.button}
            type="primary"
          >
            Update
          </Button>
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
  label: {
    color: Secondary,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
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
    marginTop: 24,
    marginBottom: 10,
  },
});

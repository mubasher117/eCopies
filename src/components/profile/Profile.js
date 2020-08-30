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
  nameValidator2,
  cellNoValidator,
  addressValidator,
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
    const nameError = nameValidator2(name.value);
    const cellNoError = cellNoValidator(cellNo.value);
    const addressError = addressValidator(address.value);
    let state = store.getState();
    let user = state.userReducer.user;
    if (
      nameError ||
      cellNoError ||
      addressError
    ) {
      setName({ ...name, error: nameError });
      setCellNo({ ...cellNo, error: cellNoError });
      setAddress({ ...address, error: addressError });
      return;
    } else {
      setshowLoading(true);
      setcontainerOpacity(0.3);
      const userDetails = {
        name: name.value,
        cellNo: cellNo.value,
        address: address.value,
        id: user.id,
      };
      updateUserDetails(userDetails, callBackUpdate);
    }
  };
  useEffect(() => {
    let state = store.getState();
    let user = state.userReducer.user;
    console.log(user)
    setName({...name, value:user.name})
    setCellNo({ ...cellNo, value: user.cellNo });
    setEmail({ ...email, value: user.email });
    setAddress({...address, value:user.address})
  }, [])

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
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
            maxLength={25}
          />
          <Text style={styles.error}>{name.error}</Text>
          <TextInput
            label="Cell No"
            returnKeyType="next"
            onChangeText={(text) => setCellNo({ value: text, error: "" })}
            error={!!cellNo.error}
            autoCapitalize="none"
            keyboardType="phone-pad"
            maxLength={15}
            value={cellNo.value}
          />
          <Text style={styles.error}>{cellNo.error}</Text>
          <TextInput
            label="Email"
            disabled
            value={email.value}
            autoCapitalize="none"
            textContentType="emailAddress"
            style={{ marginBottom: 10 }}
            maxLength={15}
          />

          <TextInput
            label="Address"
            returnKeyType="next"
            value={address.value}
            onChangeText={(text) => setAddress({ value: text, error: "" })}
            error={!!address.error}
            autoCapitalize="none"
            keyboardType="default"
            maxLength={50}
          />
          <Text style={styles.error}>{address.error}</Text>

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
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
});

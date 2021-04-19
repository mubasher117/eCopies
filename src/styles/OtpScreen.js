import { StyleSheet } from 'react-native';

import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../constants/colors";

export default StyleSheet.create({
    margin:{
        width: 10,
        height:100
    },
  textContainer: {
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    width: '90%'
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  inputContainer: {
    width: "9%",
    marginLeft: "1%",
    marginRight: "1%",
  },
  input: {
    borderBottomColor: Secondary,
    borderBottomWidth: 1,
    fontSize: 20,
    padding: "2%",
    textAlign: "center",
  },
  btnContainer: {
    alignItems: "center",
  },
  btnVerify: {
    width: "100%",
    height: 50,
    backgroundColor: Secondary,
    borderWidth: 0,
    marginTop: 24,
    marginBottom: 10,
  },
  resendCode:{
    marginLeft: 5,
    color: Secondary,
    fontWeight:'bold'
  }
});
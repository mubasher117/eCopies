import { StyleSheet } from "react-native";
import {
  Primary,
  Secondary,
  PrimaryLight,
  PrimaryDark,
  InputBackground,
  PrimaryText,
} from "../constants/colors";
import {centerScreen} from './General'
const styles = StyleSheet.create({
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalQuit: {
    width: 30,
    height: 30,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  buttonModalClose: {
    width: "100%",
    height: 40,
    backgroundColor: Secondary,
    borderWidth: 0,
    alignSelf: "flex-end",
    marginTop: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optionButtons: {
    width: "30%",
    height: 45,
    color: "black",
    borderWidth: 0,
    alignSelf: "flex-end",
    alignItems:'flex-end',
  },
  textButtonOption: { fontSize: 18, color: Secondary, fontWeight: "bold" },
  buttonModalNo: {
    width: "25%",
    height: 45,
    backgroundColor: "#E6E6E6",
    borderWidth: 0,
    alignSelf: "flex-end",
  },
  textButtonNo: { fontSize: 16, color: Secondary, fontWeight: "bold" },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
});
export default styles;


import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
export const centerScreen =  [styles.container, styles.horizontal];


export default StyleSheet.create({
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  containerTopBottom: {
    marginTop: 10,
  },
});
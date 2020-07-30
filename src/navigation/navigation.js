import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import  Drawer  from "./drawer";
const Stack = createStackNavigator(
  {
    main: { screen: Drawer },
  },
  {
    initialRouteName: "main",
    header: null,
    headerMode: "none",
  }
);
const MyComponent = createAppContainer(Stack);
export default MyComponent;

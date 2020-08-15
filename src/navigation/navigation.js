import { createAppContainer } from "react-navigation";
import { createSwitchNavigator } from "react-navigation";
import Drawer from "./drawer";
import Auth from "./auth";

const Switch = createSwitchNavigator(
  {
    auth: Auth,
    main: Drawer,
  },
  {
    initialRouteName: 'auth',
    header: null,
    headerMode: "none",
  }
);
export default createAppContainer(Switch);

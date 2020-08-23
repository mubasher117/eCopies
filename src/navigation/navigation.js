import { createAppContainer } from "react-navigation";
import { createSwitchNavigator } from "react-navigation";
import Drawer from "./drawer";
import Auth from "./auth";
import AuthenticationComponent from '../AuthenticateComponent'
const Switch = createSwitchNavigator(
  {
    auth: Auth,
    main: Drawer,
    loading: AuthenticationComponent,
  },
  {
    initialRouteName: "loading",
    header: null,
    headerMode: "none",
  }
);
export default createAppContainer(Switch);

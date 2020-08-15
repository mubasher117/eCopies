import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../components/home-screen/HomeScreen";
import LoginScreen from "../components/login/LoginScreen";
import RegisterScreen from '../components/registration/RegisterScreen'
import ForgotPasswordScreen from "../components/forgot-password/ForgotPasswordScreen";
const Auth = createStackNavigator(
  {
    Home: HomeScreen,
    Login: LoginScreen,
    Register: RegisterScreen,
    ForgotPassword: ForgotPasswordScreen,
  },
  {
    initialRouteName: "Home",
    header: null,
    headerMode: "none",
  }
);
export default createAppContainer(Auth);

import { createStackNavigator } from "@react-navigation/stack";
import JoinScreen from "../screens/JoinScreen";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Email from "../screens/ResetPassword/Email";
import NewPassword from "../screens/ResetPassword/NewPassword";
import Otp from "../screens/ResetPassword/Otp";
import WebViewScreen from "../screens/WebViewScreen";
const Stack = createStackNavigator();

export default function AuthNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Join" component={JoinScreen} />
      <Stack.Screen name="Email" component={Email} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="New Password" component={NewPassword} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
    </Stack.Navigator>
  );
}

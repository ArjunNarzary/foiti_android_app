import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../screens/Welcome";
import StackNavigation from "./StackNavigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { useSetUserPushNotificationTokenMutation } from "../Redux/services/serviceApi";
import { getItemFromStore, setItemInStore } from "../utils/handle";
import { addPushNotiPermission } from "../Redux/slices/pushNotificationPermissionSlice";
import moment from "moment";

const Stack = createStackNavigator();

export default function WelcomeStackNavigation() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.AUTHUSER);
  const [setUserPushNotificationToken, { data }] =
    useSetUserPushNotificationTokenMutation();

  const setExpoToken = async (token) => {
    await setItemInStore("expoToken", token);
  };

  useEffect(() => {
    (async () => {
      registerForPushNotificationsAsync().then( async(token) => {
        if (token) {
          setExpoToken(token);
          const body = {
            token: userData.token,
            expoToken: token,
          };
          dispatch(addPushNotiPermission({ granted: true, canAskAgain: false }));
          setUserPushNotificationToken(body);
        }
        else{
          const askAgainDate = await getItemFromStore("askForNotificationAgainAfter");
          if (askAgainDate){
            if (moment(new Date()).isBefore(askAgainDate)){
              dispatch(addPushNotiPermission({ granted: false, canAskAgain: false }));
            }else{
              dispatch(addPushNotiPermission({ granted: false, canAskAgain: true }));
            }
          }else{
            dispatch(addPushNotiPermission({ granted: false, canAskAgain: true }));
          }
        }
      });
    })();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userData?.user?.name == "" || userData?.user?.name == undefined ? (
        <Stack.Screen name="Welcome" component={Welcome} />
      ) : (
        <Stack.Screen
          name="Home Navigation Stack"
          component={StackNavigation}
        />
      )}
    </Stack.Navigator>
  );
}

//GET TOKEN
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert("Failed to get push token for push notification!");
      return null;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: "@traapp/foiti",
      })
    ).data;
  }
  //  else {
  //   alert("Must use physical device for Push Notifications");
  // }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

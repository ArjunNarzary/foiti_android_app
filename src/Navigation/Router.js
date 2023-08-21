import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AppState, Dimensions, View, ActivityIndicator } from "react-native";
import * as Device from "expo-device";

import AuthNavigation from "./AuthNavigation";
import { addUser } from "../Redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { getItemFromStore } from "../utils/handle";
import WelcomeStackNavigation from "./WelcomeStackNavigation";
import { addIp } from "../Redux/slices/ipAddressSlice";
import { usePostUsageTimeMutation } from "../Redux/services/serviceApi";
import activeVersion from "../utils/appVersion";
import { COLORS } from "../resources/theme";
const { width, height } = Dimensions.get("window");

const Stack = createStackNavigator();

export default function Router({ ip, linking }) {
  const callApi = useRef(true);
  const startDate = useRef(Date.now());
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.AUTHUSER);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  
  const appState = useRef(AppState.currentState);
  const [deviceType, setDeviceType] = useState(null);
  
  const [postUsageTime, { data, isLoading }] = usePostUsageTimeMutation();

  useEffect(() => {
    (async () => {
      //GET DEVICE TYPE
      Device.getDeviceTypeAsync().then((deviceType) => {
        setDeviceType(Device.DeviceType[deviceType]);
      });

      try {
        const userDataStore = await getItemFromStore("userData");
        if (userDataStore) {
          setToken(userDataStore.token);
          dispatch(addUser(userDataStore));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
      const subscription = AppState.addEventListener(
        "change",
        async (nextAppState) => {
          appState.current = nextAppState;
          if (appState.current.match(/inactive|background/)) {
            let userToken = {};
            if (token == null) {
              userToken = await getItemFromStore("userData");
            }
            //SEND USAGE TIME TO SERVER
            if (!isLoading && startDate && callApi.current) {
              callApi.current = false;
              postUsageTime({
                startSession: startDate.current,
                endSession: Date.now(),
                appVersion: activeVersion,
                deviceModelName: Device.modelName,
                deviceOsName: Device.osName,
                deviceVersion: Device.osVersion,
                deviceType,
                deviceManufacturer: Device.manufacturer,
                token: userToken.token,
              })
            }
          } else {
            startDate.current = Date.now();
            callApi.current = true
          }
        }
      );

      return () => {
        callApi.current = true;
        dispatch(addIp({ ip }));
        startDate.current = null;
        subscription.remove();
      };
    })();
  }, []);

  useEffect(() => {
    if (ip) {
      dispatch(addIp({ ip }));
    }
  }, [ip]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={token != null && linking}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="WelcomeStack"
      >
        {userData?.token != "" ? (
          <Stack.Screen
            name="WelcomeStack"
            component={WelcomeStackNavigation}
          />
        ) : (
          <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { removeItemFromStore } from "../utils/handle";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../Redux/slices/authSlice";
import { COLORS } from "../resources/theme";
import { useRemoveUserPushNotificationTokenMutation } from "../Redux/services/serviceApi";
const { width, height } = Dimensions.get("screen");

const LogoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const [loading, setLoading] = useState(true);

  const [removeUserPushNotificationToken, { data }] =
    useRemoveUserPushNotificationTokenMutation();

  useEffect(() => {
    setLoading(true);
    (async () => {
      // const expoToken = await getItemFromStore("expoToken");
      const body = {
        token: REDUXUSER?.token,
        // expoToken,
      };
      removeUserPushNotificationToken(body);

      await removeItemFromStore("userData");
      await removeItemFromStore("expoToken");
      dispatch(removeUser());
      navigation.navigate("AuthNavigation");
    })();

    return () => {
      setLoading(false);
    };
  }, []);

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
        <Text>Logging Out..</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>LogoutScreen</Text>
    </View>
  );
};

export default LogoutScreen;

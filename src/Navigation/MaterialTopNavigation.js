import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, StyleSheet } from "react-native";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import Followers from "../screens/Followers";
import Following from "../screens/Following";

const Tab = createMaterialTopTabNavigator();

const MaterialTopNavigation = ({ route }) => {
  const { ownerId } = route.params;

  return (
    <>
      <View style={{ paddingHorizontal: 7, backgroundColor:"#fff" }}>
        <PostPlaceHeader title={route.params.name} isProfile={false} />
      </View>
      <Tab.Navigator
        initialRouteName={route.params.initialRoute || "Follower"}
        screenOptions={{
          headerShown: false,
        }}
        tabBarOptions={{
          activeTintColor: COLORS.foitiGrey,
          inactiveTintColor: COLORS.foitiDisabled,
          indicatorStyle: {
            backgroundColor: COLORS.foiti,
          },
          labelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            textTransform: "none",
          },
          style: {
            elevation: 0,
            borderBottomWidth: 0.3,
          },
        }}
      >
        <Tab.Screen
          name="Follower"
          component={Followers}
          initialParams={{ ownerId }}
          options={{
            tabBarLabel: "Followers",
          }}
        />
        <Tab.Screen
          name="Following"
          component={Following}
          initialParams={{ ownerId }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MaterialTopNavigation;

const styles = StyleSheet.create({
  tabLabel: {},
});

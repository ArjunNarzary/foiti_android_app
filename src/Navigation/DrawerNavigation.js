import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawer from "../components/Navigation/CustomDrawer";
import FollowingPosts from "../screens/FollowingPosts";
import HomeNavigation from "./TabNavigation";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerType="front"
      screenOptions={{
        headerShown: false,
        swipeEnabled: false,
      }}
      sceneContainerStyle={{
        paddingTop: 0,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Drawer Home" component={HomeNavigation} />
      <Drawer.Screen name="Following_tab" component={FollowingPosts} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
import { COLORS } from "../resources/theme";
import Attraction from "../components/Nearby/Attraction";
import Explore from "../components/Nearby/Explore";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
const { width, height } = Dimensions.get("screen");

const Tab = createMaterialTopTabNavigator();

const NearbyTopNavigation = ({ route }) => {
  const navigation = useNavigation();

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
    return true;
  });


  return (
    <>
      <View style={{ paddingHorizontal: 15, backgroundColor:"#fff" }}>
        <PostPlaceHeader title="Nearby" isProfile={false} />
        </View>
      <Tab.Navigator
        // initialRouteName="Attractions"
        initialRouteName={route?.params?.initialRoute || "Attractions"}
        screenOptions={{
          headerShown: false,
        }}
        tabBarOptions={{
          activeTintColor: COLORS.foiti,
          inactiveTintColor: COLORS.foitiDisabled,
          indicatorStyle: {
            // backgroundColor: COLORS.foiti,
            backgroundColor: "#fff",
            width: 40,
            height:2,
            marginLeft: width/4 - 20
          },
          // labelStyle: {
          //   fontSize: 14,
          //   fontWeight: "bold",
          //   textTransform: "none",
          //   borderBottomWidth:2
          // },
          style: {
            elevation: 0,
            // borderBottomWidth: 0.3,
          },
        }}
      >
        <Tab.Screen
          name="Attractions"
          component={Attraction}
          options={{
            tabBarLabel: ({focused}) => {
              return (
              <View style={styles.labelContainer}>
                  <Text style={{ color: focused ? COLORS.foiti : COLORS.foitiBlack, fontWeight: "bold", fontSize:16 }}>Attraction</Text>
                  <View style={[styles.borderStyle, { backgroundColor: focused ? COLORS.foiti : "white" }]} />
              </View>)
            }
          }}
        />
        <Tab.Screen
          name="Explore"
          component={Explore}
          initialParams={{ 
              initialDistance: route?.params?.initialDistance || 99, 
              initialSortBy: route?.params?.initialSortBy 
            }}
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <View style={styles.labelContainer}>
                  <Text style={{ color: focused ? COLORS.foiti : COLORS.foitiBlack, fontWeight: "bold", fontSize:16 }}>Explore</Text>
                 <View style={[styles.borderStyle, { backgroundColor: focused ? COLORS.foiti : "white" }]} />
                </View>)
            }
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default NearbyTopNavigation;

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  permissionButton: {
    width: width - 120,
    backgroundColor: COLORS.foiti,
    padding: 10,
    borderRadius: 4,
    marginBottom: 5,
  },
  labelContainer: {
    justifyContent:"center",
    alignItems:"center",
    width: width/2 -50,
  },
  borderStyle: {
    height: 2.5, 
    width: 80,
    borderRadius: 1,
    marginTop: 3,
  }
});

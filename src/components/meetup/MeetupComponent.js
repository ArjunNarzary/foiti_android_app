import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Travellers from './Travellers'
import Locals from './Locals'
import { COLORS } from "../../resources/theme";
const { width, height } = Dimensions.get("screen");

const Tab = createMaterialTopTabNavigator();

const MeetupComponent = ({ userData }) => {
  return (
      <>
          <Tab.Navigator
              initialRouteName="Locals"
              screenOptions={{
                  headerShown: false,
              }}
              tabBarOptions={{
                  activeTintColor: COLORS.foiti,
                  inactiveTintColor: COLORS.foitiDisabled,
                  indicatorStyle: {
                      backgroundColor: "#fff",
                      width: 40,
                      height: 2,
                      marginLeft: width / 4 - 20
                  },
                  style: {
                      elevation: 0,
                  },
              }}
          >
              <Tab.Screen
                  name="Locals"
                  component={Locals}
                  initialParams={{ userData }}
                  options={{
                      tabBarLabel: ({ focused }) => {
                          return (
                              <View style={styles.labelContainer}>
                                  <Text style={{ color: focused ? COLORS.foiti : COLORS.foitiBlack, fontWeight: "bold", fontSize:16 }}>Locals</Text>
                                  <View style={[styles.borderStyle, { backgroundColor: focused ? COLORS.foiti : "white" }]} />
                              </View>)
                      }
                  }}
              />
              <Tab.Screen
                  name="Travellers"
                  component={Travellers}
                  initialParams={{ userData }}
                  options={{
                      tabBarLabel: ({ focused }) => {
                          return (
                              <View style={styles.labelContainer}>
                                  <Text style={{ color: focused ? COLORS.foiti : COLORS.foitiBlack, fontWeight: "bold", fontSize: 16 }}>Travellers</Text>
                                  <View style={[styles.borderStyle, { backgroundColor: focused ? COLORS.foiti : "white" }]} />
                              </View>)
                      }
                  }}
              />
          </Tab.Navigator>
      </>
  )
}

export default MeetupComponent

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
        justifyContent: "center",
        alignItems: "center",
        width: width / 2 - 50,
    },
    borderStyle: {
        height: 2.5,
        width: 80,
        borderRadius: 1,
        marginTop: 3,
    }
})
import { useState, useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

import HomeStackNavigation from "./HomeStackNavigation"
import { Image, StyleSheet, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useDispatch, useSelector } from "react-redux"
import ProfileStackNavigation from "./ProfileStackNavigation"
import { addNavigation } from "../Redux/slices/addNavigationSlice"

import MapStackNavigation from "./MapStackNavigation"
import MeetupStackNavigation from "./MeetupStackNavigation"
import FollowingStackNavigation from "./FollowingStackNavigation"
import { removeRouteParams } from "../Redux/slices/routeParamSlice"

const Tab = createBottomTabNavigator()

function HomeNavigation() {
  const dispatch = useDispatch()
  const REDUXUSER = useSelector((state) => state.AUTHUSER)
  const [profileImage, setProfileImage] = useState("")
  useEffect(() => {
    if (
      REDUXUSER?.user?.profileImage?.thumbnail?.private_id != "" &&
      REDUXUSER?.user?.profileImage?.thumbnail?.private_id != undefined
    ) {
      setProfileImage(REDUXUSER?.user?.profileImage?.thumbnail?.private_id)
    } else {
      setProfileImage("profile_picture.jpg")
    }
  }, [REDUXUSER])

  return (
    <Tab.Navigator
      tabBarOptions={{
        headerShown: false,
        keyboardHidesTabBar: true,
        labelStyle: {
          color: "#000",
        },
        style: {
          height: 60,
          paddingBottom: 10,
        },
      }}
      // screenOptions={{
      //   unmountOnBlur: true
      // }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigation}
        listeners={() => ({
          tabPress: () => {
            dispatch(
              addNavigation({
                name: "home",
              })
            )
            dispatch(removeRouteParams())
          },
        })}
        options={{
          tabBarLabel: ({ focused }) => {
            if (focused) {
              dispatch(
                addNavigation({
                  name: "home",
                })
              )
              dispatch(removeRouteParams())
              return (
                <Text style={[styles.text, { fontWeight: "bold" }]}>Home</Text>
              )
            } else {
              return <Text style={styles.text}>Home</Text>
            }
          },
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <Ionicons name="home" style={{ fontSize: 20 }} />
            } else {
              return <Ionicons name="home-outline" style={{ fontSize: 20 }} />
            }
          },
        }}
      />
      <Tab.Screen
        name="Following"
        component={FollowingStackNavigation}
        listeners={() => ({
          tabPress: () => {
            dispatch(
              addNavigation({
                name: "following",
              })
            )
            dispatch(removeRouteParams())
          },
        })}
        options={{
          tabBarLabel: ({ focused }) => {
            if (focused) {
              dispatch(
                addNavigation({
                  name: "following",
                })
              )
              dispatch(removeRouteParams())
              return (
                <Text style={[styles.text, { fontWeight: "bold" }]}>
                  Following
                </Text>
              )
            } else {
              return <Text style={styles.text}>Following</Text>
            }
          },
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return (
                <Ionicons
                  name="checkmark-done-circle-sharp"
                  style={{ fontSize: 23 }}
                />
              )
            } else {
              return (
                <Ionicons
                  name="checkmark-done-circle-outline"
                  style={{ fontSize: 23 }}
                />
              )
            }
          },
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapStackNavigation}
        listeners={() => ({
          tabPress: () => {
            dispatch(
              addNavigation({
                name: "map",
              })
            )
          },
        })}
        options={{
          unmountOnBlur:true,
          tabBarLabel: ({ focused }) => {
            if (focused) {
              dispatch(
                addNavigation({
                  name: "map",
                })
              )
              return (
                <Text style={[styles.text, { fontWeight: "bold" }]}>Map</Text>
              )
            } else {
              return <Text style={styles.text}>Map</Text>
            }
          },
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <Ionicons name="map" style={{ fontSize: 20 }} />
            } else {
              return <Ionicons name="map-outline" style={{ fontSize: 20 }} />
            }
          },
        }}
      />
      <Tab.Screen
        name="Meet Up Tab"
        component={MeetupStackNavigation}
        listeners={() => ({
          tabPress: () => {
            dispatch(
              addNavigation({
                name: "meetup",
              })
            )
            dispatch(removeRouteParams())
          },
        })}
        options={{
          unmountOnBlur: true,
          tabBarLabel: ({ focused }) => {
            if (focused) {
              dispatch(
                addNavigation({
                  name: "meetup",
                })
              )
              dispatch(removeRouteParams())
              return (
                <Text style={[styles.text, { fontWeight: "bold" }]}>
                  Meet Up
                </Text>
              )
            } else {
              return <Text style={styles.text}>Meet Up</Text>
            }
          },
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <Ionicons name="people" style={{ fontSize: 23 }} />
            } else {
              return <Ionicons name="people-outline" style={{ fontSize: 23 }} />
            }
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigation}
        listeners={() => ({
          tabPress: () => {
            dispatch(
              addNavigation({
                name: "profile",
              })
            )
            dispatch(removeRouteParams())
          },
        })}
        options={{
          tabBarLabel: ({ focused }) => {
            if (focused) {
              dispatch(
                addNavigation({
                  name: "profile",
                })
              )
              dispatch(removeRouteParams())
              return (
                <Text style={[styles.text, { fontWeight: "bold" }]}>
                  Profile
                </Text>
              )
            } else {
              return <Text style={styles.text}>Profile</Text>
            }
          },
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return (
                <View style={[styles.imageConatiner, { borderColor: "#000" }]}>
                  <Image
                    source={{
                      uri: `${process.env.BACKEND_URL}/image/${profileImage}`,
                    }}
                    style={styles.image}
                  />
                </View>
              )
            } else {
              return (
                <View style={[styles.imageConatiner, { borderColor: "#fff" }]}>
                  <Image
                    source={{
                      uri: `${process.env.BACKEND_URL}/image/${profileImage}`,
                    }}
                    style={styles.image}
                  />
                </View>
              )
            }
          },
        }}
      />
    </Tab.Navigator>
  )
}

export default HomeNavigation

const styles = StyleSheet.create({
  image: {
    height: 22,
    width: 22,
    borderRadius: 11,
  },
  imageConatiner: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 10,
  },
})

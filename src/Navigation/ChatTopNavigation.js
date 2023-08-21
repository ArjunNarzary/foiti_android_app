import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { useSelector } from "react-redux";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { useGetMeetupUnreadRequestQuery } from "../Redux/services/serviceApi";
import { COLORS } from "../resources/theme";
import Chat from "../screens/Chat";
import MeetupChat from "../screens/MeetupChat";
const { width, height } = Dimensions.get("screen");

const Tab = createMaterialTopTabNavigator();

const ChatTopNavigation = () => {
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const {
        data: unreadData,
    } = useGetMeetupUnreadRequestQuery(
        { token: REDUXUSER.token },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    return (
        <View style={{ flex:1, backgroundColor:"#fff" }}>
            <View style={{ paddingHorizontal: 7 }}>
                <PostPlaceHeader
                    title={"Chats"}
                    isProfile={false}
                />
                {/* <View style={{ marginBottom: 10, paddingHorizontal: FOITI_CONTS.padding }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#E5E5E5",
                            height: 43,
                            borderRadius: 25
                        }}
                        onPress={() => navigation.navigate(`SearchUser via ${REDUXNAVIGATION.name}`)}>
                        <Text style={{ paddingLeft: 22, marginTop: 10 }}>Search</Text>
                    </TouchableOpacity>
                </View> */}

            </View>
            <Tab.Navigator
                initialRouteName="Chats"
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
                    name="Chats"
                    component={Chat}
                    options={{
                        tabBarLabel: ({ focused }) => {
                            return (
                                <View style={styles.labelContainer}>
                                    <Text style={{ color: focused ? COLORS.foiti : COLORS.foitiBlack, fontWeight: "bold", fontSize: 16 }}>General</Text>
                                    <View style={[styles.borderStyle, { backgroundColor: focused ? COLORS.foiti : "white" }]} />
                                </View>)
                        }
                    }}
                />
                <Tab.Screen
                    name="Meet Ups"
                    component={MeetupChat}
                    options={{
                        tabBarLabel: ({ focused }) => {
                            return (
                                <View style={styles.labelContainer}>
                                    <View style={styles.labelBox}>
                                        {unreadData && <View style={styles.notificationCount} />}
                                        <Text style={{ color: focused ? COLORS.foiti : COLORS.foitiBlack, fontWeight: "bold", fontSize: 16 }}>Meet Ups</Text>
                                        <View style={[styles.borderStyle, { backgroundColor: focused ? COLORS.foiti : "white" }]} />
                                    </View>
                                </View>)
                        }
                    }}
                />
            </Tab.Navigator>
        </View>
    )
}

export default ChatTopNavigation

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
    labelBox:{
        position:'relative',
    },
    borderStyle: {
        height: 2.5,
        width: 80,
        borderRadius: 1,
        marginTop: 3,
    },
    notificationCount: {
        height: 7,
        width: 7,
        position: "absolute",
        top: 1,
        right: 5,
        backgroundColor: COLORS.foiti,
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7 / 2,
        zIndex: 20,
    },
})
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BottomSheet } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { Octicons } from "@expo/vector-icons"
import { COLORS } from "../../resources/theme";
import { Linking } from "react-native";
import moment from "moment";
import { removeItemFromStore, setItemInStore } from "../../utils/handle";
import { addPushNotiPermission } from "../../Redux/slices/pushNotificationPermissionSlice";
import { useRemoveUserPushNotificationTokenMutation } from "../../Redux/services/serviceApi";
const { width, height } = Dimensions.get("window");

const NotificationBottomSheet = () => {
    const REDUXPERMISSION = useSelector(state => state.PUSHNOTIPERMISSION);
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
    const dispatch = useDispatch();
    const [isUnMounted, setIsUnMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(!REDUXPERMISSION?.granted && REDUXPERMISSION?.canAskAgain ? true : false);
    const [removeUserPushNotificationToken, { data }] =
        useRemoveUserPushNotificationTokenMutation();

    useEffect(() => {
        setIsUnMounted(false);
        return () => {
            setIsUnMounted(true);
        };
    }, []);

    useEffect(() => {
        if (!REDUXPERMISSION?.granted && REDUXPERMISSION?.canAskAgain){
            setIsVisible(true);
        }
    }, [REDUXPERMISSION])

    const openSetting = () => {
        if(!isUnMounted){
            dispatch(addPushNotiPermission({ granted: true, canAskAgain: REDUXPERMISSION.canAskAgain }));
            setIsVisible(false);
            Linking.openSettings();
        }
    }

    const handleRejectPermission = async() => {
        if(!isUnMounted){
            // const threeDaysFromNow = moment().add(3, "days");
            //TODO::REMOVE FOR TESTING
            const sevenDaysFromNow = moment(new Date()).add(7, "days");
            await setItemInStore("askForNotificationAgainAfter", sevenDaysFromNow);
            await removeItemFromStore("expoToken");
            dispatch(addPushNotiPermission({ granted: false, canAskAgain: false }));
            setIsVisible(false);
            
            const body = {
                token: REDUXUSER?.token,
            };
            removeUserPushNotificationToken(body);
        }
    };

    return (
        <BottomSheet 
            isVisible={isVisible}
            containerStyle={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
            <View
                style={styles.container}
            >
                <View
                    style={styles.boxContainer}
                >
                    <Octicons name="bell-fill" style={{ fontSize: 25, marginBottom:20, color: COLORS.foiti }} />
                    <Text style={{ color: COLORS.foitiBlack, fontSize: 15 }}>Allow <Text style={{ fontWeight: "bold" }}>Foiti</Text> to send notifications?</Text>
                    <TouchableOpacity
                        style={styles.allow}
                        onPress={openSetting}
                    >
                        <Text style={{ color: "white" }}>
                            Allow
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnContainer}
                        onPress={handleRejectPermission}
                    >
                        <Text style={{ color: COLORS.foitiGrey }}>
                            Don't Allow
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    );
};

export default NotificationBottomSheet;

const styles = StyleSheet.create({
    container: {
        width,
        height: height - StatusBar.currentHeight,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
    },
    boxContainer: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 70,
        width: width / 1.1,
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 25,
        borderRadius: 12,
    },
    allow:{
        marginTop: 40,
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: COLORS.foiti,
        borderRadius: 30
    }
});

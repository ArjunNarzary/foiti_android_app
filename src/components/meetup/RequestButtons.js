import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS } from '../../resources/theme'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { useMeetupRequestMutation } from '../../Redux/services/serviceApi'
const { width, height } = Dimensions.get("screen")

const RequestButtons = ({ user, isUnmounted }) => {
    const navigation = useNavigation();
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION)
    const REDUXUSER = useSelector(state => state.AUTHUSER);

    const [meetupRequest, { data, error, isLoading, isSuccess, isError }] = useMeetupRequestMutation()

    const redirectToProfile = () => {
        navigation.push(`Others profile via ${REDUXNAVIGATION.name}`, { userId: user?._id });
    };

    const requestMeetup = () => {
        const body = {
            user_id: user?._id,
            token: REDUXUSER.token
        }

        meetupRequest(body);
    }

    useEffect(() => {
        if (isSuccess && !isUnmounted){
            navigation.replace(`MeetupChatBox via ${REDUXNAVIGATION.name}`, { "chatId": data?.meetupChat?._id, "request_receiver": user?._id })
        }
    },[isSuccess])



    return (
        <View style={styles.buttonContainer} >
            <TouchableOpacity
                style={[styles.button, { backgroundColor: COLORS.foiti, marginBottom: 15 }]}
                onPress={requestMeetup}
                disabled={isLoading ? true : false}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ):(
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Request Meet Up</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: COLORS.foitiGreyLighter }]}
                onPress={redirectToProfile}
            >
                <Text style={{ fontWeight: "bold" }}>View Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RequestButtons

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 50
    },
    button: {
        width: width - 150,
        height: 45,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    }
})
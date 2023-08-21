import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, View, ActivityIndicator } from 'react-native'
import PostPlaceHeader from '../components/Header/PostPlaceHeader'
import { COLORS, FOITI_CONTS } from '../resources/theme'
import AddDetails from '../components/meetup/AddDetails'
import { useViewOwnProfileQuery } from '../Redux/services/serviceApi'
import { useSelector } from 'react-redux'
import MeetupComponent from '../components/meetup/MeetupComponent'
import ServerError from '../components/Error/ServerError'
const { width, height } = Dimensions.get('screen');

const Meetup = () => {
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const REDUXIP = useSelector(state => state.IPADDRESS);
    const [unMounted, setUnMounted] = useState(false);
    const [showMeetup, setShowMeetup] = useState(false);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    const { data, error, isLoading, isError, isSuccess, refetch } =
        useViewOwnProfileQuery(
            { token: REDUXUSER.token, ip: REDUXIP.ip },
            {
                refetchOnMountOrArgChange: true,
            }
        );


    useEffect(() => {
        setUnMounted(false);
        return () => {
            setUnMounted(true)
        };
    }, [])

    useEffect(() => {
        if (isSuccess && !unMounted) {
            setUserData(data);
            if (data?.user?.gender && data?.user?.dob && data?.user?.place?._id && data?.user?.bio) {
                setShowMeetup(true);
            }
            setLoading(false);
        }
        if (isError) {
            setLoading(false);
        }
    }, [isSuccess, isError])

    const refreshData = (user) => {
        setUserData({ user: user });
        setShowMeetup(true);
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={{ paddingHorizontal: FOITI_CONTS.padding }}>
                <PostPlaceHeader title="Meet Up" />
            </View>
            {isLoading || loading ? (
                <View
                    style={{
                        width,
                        height: height - 60,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" color={COLORS.foiti} />
                </View>
            ) : (
                <>
                    {isError ? (
                        <View>
                            <ServerError
                                onPress={() => {
                                    refetch()
                                }}
                            />
                        </View>
                    ) : (
                        <>
                            {isSuccess && (
                                <>
                                    {showMeetup ? (
                                        <MeetupComponent userData={userData} />
                                    ) : (
                                        <AddDetails userData={userData} refreshData={refreshData} unMounted={unMounted} />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>)}
        </View>
    )
}

export default Meetup

const styles = StyleSheet.create({})
import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native'
import PostPlaceHeader from '../components/Header/PostPlaceHeader';
import UserProfile from '../components/meetup/UserProfile';
import { COLORS, FOITI_CONTS } from '../resources/theme';
import OtherDetails from '../components/meetup/OtherDetails';
import RequestButtons from '../components/meetup/RequestButtons';
import { useSelector } from 'react-redux';
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { useGetLocalDetailsQuery } from '../Redux/services/serviceApi';
import UpcomingTrip from '../components/trips/UpcomingTrip';
import ServerError from '../components/Error/ServerError';
const { width, height } = Dimensions.get('screen');

const Local = ({ route }) => {
  let { user, fromMeetup = true } = route.params;
  const navigation = useNavigation();
  const REDUXUSER = useSelector(state => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isRefectching, setIsRefectching] = useState(false);

  //API QUERIES
  const { data, isLoading, error, isSuccess, isError, refetch } =
    useGetLocalDetailsQuery(
      { userId: user._id, token: REDUXUSER.token, ip: REDUXIP.ip },
      { refetchOnMountOrArgChange: true }
    );

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      if (REDUXNAVIGATION.name !== "home") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home Navigation" }],
        });
      } else {
        return false;
      }
    }
    return true;
  });

  useEffect(() =>{
    setIsUnmounted(false);
    setIsRefectching(false);
    return () => {
      setIsUnmounted(true);
      setIsRefectching(false);
    };
  })

  useEffect(() => {
    setIsRefectching(false);
    if (isSuccess && !isUnmounted) {
        setUserDetails(data)
    }
    if (isError && !isUnmounted) {
      if (error?.status == 404 || error?.status == 400) {
        navigation.navigate("NotFound");
      }
    }
  }, [isSuccess, isError]);

  const refetchData = () => {
    setIsRefectching(true);
    refetch();
  }

  if (isLoading || isRefectching) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:"#fff"
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 7 }}>
        <PostPlaceHeader title="Meetup Profile" />
      </View>
        {isError ? 
          (
            <View>
              <ServerError onPress={refetchData} />
            </View>
          )
        : (<View style={{ paddingHorizontal: FOITI_CONTS.padding+7 }}>
            <View style={styles.sectionContainer}>
              <UserProfile user={userDetails?.user} profileUri={userDetails?.user?.profileImage?.thumbnail?.private_id} />
            </View>
            {userDetails?.tripPlans && userDetails?.tripPlans.length > 0 &&
              <View style={{width, marginLeft: -17, backgroundColor: COLORS.foitiGreyLighter, paddingHorizontal: FOITI_CONTS.padding + 7 }}>
                <UpcomingTrip userData={userDetails} fromMeetup={fromMeetup} />
              </View>
            }
            <View style={styles.sectionContainer}>
              <OtherDetails user={userDetails?.user} />
            </View>
            {REDUXUSER?.user?._id !== userDetails?.user?._id && fromMeetup && (
              <RequestButtons user={userDetails?.user} />
            )}
          </View>)}
    </ScrollView>
  )
}

export default Local

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10
  }
})
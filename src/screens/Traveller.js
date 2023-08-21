import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import { useGetTravellerDetailsQuery } from '../Redux/services/serviceApi';
import { useSelector } from 'react-redux';
import { COLORS, FOITI_CONTS } from '../resources/theme';
import PostPlaceHeader from '../components/Header/PostPlaceHeader';
import UserProfile from '../components/meetup/UserProfile';
import OtherDetails from '../components/meetup/OtherDetails';
import RequestButtons from '../components/meetup/RequestButtons';
import ServerError from '../components/Error/ServerError';
import TripDetails from '../components/trips/TripDetails';
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get("screen");

const Traveller = ({ route }) => {
  const { trip_id } = route.params;
  const navigation = useNavigation();
  const REDUXUSER = useSelector(state => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const [user, setUser] = useState({});
  const [tripPlan, setTripPlan] = useState({});
  const [isUnmounted, setIsUnmounted] = useState(false);
  const { isSuccess, data, isLoading, isError, error, refetch } = useGetTravellerDetailsQuery({ trip_id, token: REDUXUSER.token, ip: REDUXIP.ip }, {
                                                                                        refetchOnMountOrArgChange: true,
                                                                                      });

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

  useEffect(() => {
    setIsUnmounted(false);

    return () => setIsUnmounted(true);
  })

  useEffect(() => {
    if (isSuccess && !isUnmounted) {
      setTripPlan(data?.tripPlan)
      setUser(data?.user);
    }
  }, [isSuccess]);

  if (isLoading) {
    return (
      <View
        style={{
          width,
          height: height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    )
  }
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 7 }}>
        <PostPlaceHeader title="Traveller" />
      </View>
      {isError ? (
        <ServerError onPress={() => refetch()} />
      ) : (
      // <View style={{ paddingHorizontal: FOITI_CONTS.padding }}>
      <View>
        <View style={styles.sectionContainer}>
          <UserProfile user={user} profileUri={user?.profileImage?.thumbnail?.private_id} />
        </View>
        <View style={styles.tripDetails}>
          <TripDetails tripPlan={tripPlan} />
        </View>
        <View style={styles.sectionContainer}>
          <OtherDetails user={user} />
        </View>
        {REDUXUSER?.user?._id !== user?._id && (
            <RequestButtons user={user} isUnmounted={isUnmounted} />
        )}
      </View>
      )}
    </ScrollView>
  )
}

export default Traveller

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 15,
    paddingHorizontal: FOITI_CONTS.padding + 7
  },
  tripDetails:{
    backgroundColor: COLORS.foitiGreyLighter,
    // marginVertical: 15,
    padding: FOITI_CONTS.padding + 7,
  }
})
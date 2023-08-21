import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import PostPlaceHeader from '../components/Header/PostPlaceHeader'
import { FlatList } from 'react-native'
import Trip from '../components/trips/Trip'
import { useGetTotalActiveTripQuery } from '../Redux/services/serviceApi'
import { useSelector } from 'react-redux'
import ServerError from '../components/Error/ServerError'
import { COLORS } from '../resources/theme'
import { RefreshControl } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { useNavigation } from '@react-navigation/native'
import { GET_ALL_TRIPS } from '../Redux/customApis/api'
const { width, height } = Dimensions.get('screen');

const TripPlanList = ({ route }) => {
    const { user_id } = route.params;
    const navigation = useNavigation();
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [trips, setTrips] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchTripPlans = async () => {
        setIsLoading(true);
        const response = await GET_ALL_TRIPS({ token: REDUXUSER.token, user_id });
        if (isUnmounted) return;
        if(response.error){
            setIsError(true);
        }else{
            setTrips(response?.data?.activeTrips)
        }
        setIsLoading(false);
        setIsRefreshing(false);
    }

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
        fetchTripPlans();
        return () => setIsUnmounted(true);
    }, [])

    const _onRefresh = () =>{
        setIsRefreshing(true);
        fetchTripPlans();
    }

    const renderEmptyList = () => {
        return (
            <View
                style={{
                    paddingTop: 40,
                }}
            >
                <Text style={{ textAlign: "center", fontSize: 18 }}>
                    No trip plans available
                </Text>
            </View>
        );
    };

    if(isLoading && !isRefreshing){
       return( 
        <View
                style={{
                    width,
                    height,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff"
                }}
            >
                <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 7 }}>
            <PostPlaceHeader title="Trip Plans" />
            {isError ? (
                <ServerError onPress={() => fetchTripPlans()} />
            ) : (
                <>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={trips}
                        renderItem={(item) => (
                            <Trip trip={item.item} />
                        )}
                        ListEmptyComponent={renderEmptyList}
                        keyExtractor={(item, index) => index}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={_onRefresh}
                                tintColor={"#f8852d"}
                            />
                        }
                    />
                </>)}
        </View>
    )
}

export default TripPlanList

const styles = StyleSheet.create({})
import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Feather } from "@expo/vector-icons"
import { COLORS, FOITI_CONTS } from '../../resources/theme'
import HostUser from './HostUser'
import { useGetTravellersMutation } from '../../Redux/services/serviceApi';
import ServerError from '../Error/ServerError';
import { useBackHandler } from '@react-native-community/hooks';
const { width, height } = Dimensions.get("screen");

const Travellers = ({ route }) => {
    const { userData } = route.params;
    const initialDestination = { coordinates: userData.user?.place?.coordinates };
    const navigation = useNavigation()
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const REDUXDESTINATION = useSelector((state) => state.ADD_DESTINATION);
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
    const [address, setAddress] = useState("");
    const [travellers, setTravellers] = useState([]);
    const [firstFecth, setFirstFetch] = useState(true);
    const [skip, setSkip] = useState(0);
    const [noMoreData, setNoMoreData] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [getTravellers, { isLoading, isSuccess, isError, data, error }] = useGetTravellersMutation();

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

    const firstFetchTravellers = () => {
        setLoadingMore(false);
        setFirstFetch(true);
        setNoMoreData(false);
        setSkip(0)
        const body = {
            skip: 0,
            address: REDUXDESTINATION.name ? REDUXDESTINATION : initialDestination,
            token: REDUXUSER.token
        }

        getTravellers(body);
    }

    const fetchMoreTravellers = () => {
        setLoadingMore(true);
        setFirstFetch(false);
        const body = {
            skip,
            address: REDUXDESTINATION.name ? REDUXDESTINATION : initialDestination,
            token: REDUXUSER.token
        }

        getTravellers(body);
    }

    //INITIAL ADDRESS
    let userAddress = "";
    if (userData?.user?.place?._id) {
        const address = userData.user?.place?.local_address || userData.user?.place?.short_address || "";
        // userAddress = userData?.user?.place?.name + address;
        userAddress = address;
    }

    useEffect(() => {
        setIsUnmounted(false);
        firstFetchTravellers();
        return () => setIsUnmounted(true);
    }, []);


    useEffect(() => {
        if (isSuccess && !isUnmounted) {
            if (firstFecth) {
                setTravellers(data.travellers);
            } else {
                setTravellers([...travellers, ...data.travellers]);
            }
            setFirstFetch(false);
            setSkip(data.skip);
            setNoMoreData(data.noMoreData);
            setIsRefreshing(false);
            setLoadingMore(false);
        }
    }, [isSuccess, isError]);


    useEffect(() => {
        let address = "";
        let addArr = [];
        if (REDUXDESTINATION.name) {
            addArr.push(REDUXDESTINATION.name);
        }

        if (REDUXDESTINATION.administrative_area_level_1 && REDUXDESTINATION.administrative_area_level_1 != REDUXDESTINATION.name) {
            addArr.push(REDUXDESTINATION.administrative_area_level_1);
        }

        address = addArr.join(", ");
        setAddress(address);
        setTravellers([]);
        firstFetchTravellers();
    }, [REDUXDESTINATION]);

    const _onRefresh = () => {
        setIsRefreshing(true);
        firstFetchTravellers();
    }

    const _getMoreTravellers = () => {
        if (noMoreData) return;
        setLoadingMore(true);
        fetchMoreTravellers();
    }

    //NAVIGATION TO ADD ADDRESS
    const navigateToAddLocation = (prev_screen) => {
        navigation.navigate("Add Place Location", { prev_screen });
    };

    const _renderEmptyComponent = () =>{
        return (
            <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", paddingHorizontal: 30, height: height - 400 }}>
                <Text style={{ textAlign: "center" }}>The community is still growing so, finding travellers in every city or area is a challenge.</Text>
            </View>
        )
    }

    //RENDER FOOTER
    const renderFooter = () => {
        if (!loadingMore) return (
            <View style={{ marginBottom: 40 }} />
        );

        return (
            <View
                style={{
                    paddingVertical: 10,
                    marginBottom: 40
                }}
            >
                <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 7 }}>
            <View style={{ flexDirection: "row", paddingVertical: 5, paddingHorizontal: FOITI_CONTS.padding }}>
                <TouchableOpacity style={styles.addressBox} onPress={() => navigateToAddLocation('addDestination')}>
                    <Text style={{ fontWeight: "bold" }}>City: {address || userAddress}</Text>
                    <Feather name="edit" style={{ fontSize: 16, marginLeft: 10, color: COLORS.foitiGrey }} />
                </TouchableOpacity>
            </View>
            {isSuccess || isLoading ? (
                <View>
                    {isLoading && firstFecth && !isRefreshing ? (
                        <View
                            style={{
                                position: "absolute",
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                height: height - 250,
                                width,
                            }}
                        >
                            <ActivityIndicator size="large" color={COLORS.foiti} />
                        </View>
                    ) : (
                        <FlatList
                            ListHeaderComponent={
                                <>
                                    {travellers.length !== 0 && <View style={{ paddingVertical: 10, paddingHorizontal: FOITI_CONTS.padding, marginBottom: 10 }}>
                                        <Text style={{ color: COLORS.foitiGrey }}>Others will be able to see you as "Traveller" only if you add a trip plan.</Text>
                                    </View>}
                                </>
                            }
                            showsVerticalScrollIndicator={false}
                            data={travellers}
                            renderItem={(item) => (
                                <HostUser item={item.item} profileUri={item?.item?.user[0]?.profileImage?.thumbnail?.private_id} user={item?.item?.user[0]} />
                            )}
                            keyExtractor={(item) => item._id}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={_onRefresh}
                                    tintColor={"#f8852d"}
                                />
                            }
                            onEndReachedThreshold={0.5}
                            onEndReached={_getMoreTravellers}
                            ListEmptyComponent={_renderEmptyComponent}
                            ListFooterComponent={renderFooter}
                        />
                    )}
                </View>
            ) : (
                <>{isError && <ServerError onPress={_onRefresh} />}</>
            )}
        </View>
    )
}

export default Travellers

const styles = StyleSheet.create({
    addressBox: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    }
})
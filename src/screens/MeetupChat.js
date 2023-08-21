import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    View,
    RefreshControl
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
import { COLORS, FOITI_CONTS } from "../resources/theme";
import ServerError from "../components/Error/ServerError";
import { GET_ALL_MEETUP_CHATS } from "../Redux/customApis/api";
import MeetupSingleChat from "../components/meetup/MeetupSingleChat";
import { Text } from "react-native";
const { width, height } = Dimensions.get("screen");


const MeetupChat = () => {
    const navigation = useNavigation();
    const REDUXDATA = useSelector((state) => state.AUTHUSER);
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isUnMounted, setIsUnmounted] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [noMoreData, setNoMoreData] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

    const firstFetch = async () => {
        setChats([]);
        setError(false);
        setIsLoading(true);
        setLoadingMore(false);
        setNoMoreData(false)
        const { data, error, status } = await GET_ALL_MEETUP_CHATS({ skip: 0, token: REDUXDATA?.token });
        if (isUnMounted) return;
        if (error || status !== 200) {
            setIsLoading(false);
            setError(true)
        } else {
            setChats(data?.chats);
            setNoMoreData(data?.noMoreData);
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        setError(false);
        setIsUnmounted(false);
        firstFetch();

        return () => {
            setIsLoading(false);
            setIsUnmounted(true);
        }
    }, [])

    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         firstFetch();
    //     })
    //     return unsubscribe;
    // }, [navigation])

    const _onRefresh = () => {
        setIsRefreshing(true);
        firstFetch();
    }

    const _getMoreChats = async () => {
        if (noMoreData) return;
        setLoadingMore(true);
        const skip = chats.length;
        const { data, error } = await GET_ALL_MEETUP_CHATS({ skip, token: REDUXDATA?.token });
        if (isUnMounted) return;
        if (error) {
            setLoadingMore(false);
            setError(true)
        } else {
            setChats([...chats, ...data.chats]);
            setNoMoreData(data?.noMoreData);
            setLoadingMore(false);
            setIsRefreshing(false);
        }
    }

    //RENDER FOOTER
    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View
                style={{
                    paddingVertical: 10,
                }}
            >
                <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
        );
    };


    const _renderEmpytComponent = () => {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", paddingHorizontal: 30, height: height - 280 }}>
                <Text style={{ textAlign: "center" }}>Go out there, explore, meet new people. No meet up request or message doesn't mean you can't explore the world.</Text>
            </View>
        )
    }

    if (isLoading) {
        return (
            <View
                style={{
                    width,
                    height: height - 120,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: '#fff'
                }}
            >
                <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
        );
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {
                    error ?
                        <ServerError onPress={firstFetch} />
                        :
                        (
                            <View>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingHorizontal: 7
                                    }}
                                    data={chats}
                                    renderItem={({ item }) => <View style={{ paddingHorizontal: FOITI_CONTS.padding }}>
                                        <MeetupSingleChat item={item} logeduser={REDUXDATA} />
                                    </View>}
                                    keyExtractor={item => item._id}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={isRefreshing}
                                            onRefresh={_onRefresh}
                                            tintColor={"#f8852d"}
                                        />
                                    }
                                    onEndReachedThreshold={0.5}
                                    onEndReached={_getMoreChats}
                                    ListEmptyComponent={_renderEmpytComponent}
                                    ListFooterComponent={renderFooter}
                                />
                            </View>
                        )
                }
            </View>
        </>
    );
};

export default MeetupChat;

//TODO::USELESS COMPONENT

import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, Pressable, Dimensions, ActivityIndicator, RefreshControl } from 'react-native'
import { COLORS } from '../resources/theme'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { Ionicons } from "@expo/vector-icons"
import { useExploreMapPostDataMutation } from '../Redux/services/serviceApi'
import BoxPostComponent from './Post/BoxPostComponent'
import { useBackHandler } from '@react-native-community/hooks'
import { TouchableOpacity } from 'react-native'
const { width, height } = Dimensions.get('window');

const MapExplorePost = ({
    currentPostBSIndex,
    topLeftCoords,
    topRightCoords,
    bottomLeftCoords,
    bottomRightCoords,
    isUnmounted,
    closeBottomSheet,
    prevPostBSIndex,
    openPostBottomsheet,
    latDelta
}) => {
    const navigation = useNavigation()
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
    const REDUXIP = useSelector((state) => state.IPADDRESS);
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
    const [posts, setPosts] = useState([]);
    const [skip, setSkip] = useState([]);
    const [noMoreData, setNoMoreData] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [firstFetch, setFirstFetch] = useState(true);

    const [exploreMapPostData, { data, isLoading, isError, isSuccess }] = useExploreMapPostDataMutation();

    useBackHandler(() => {
        closeBottomSheet()
        return true;
    });

    const firstFetchPost = () => {
        setFirstFetch(true);
        setLoadingMore(false);
        exploreMapPostData({
            token: REDUXUSER.token,
            topLeftCoords,
            topRightCoords,
            bottomRightCoords,
            bottomLeftCoords,
            ip: REDUXIP,
            skip: 0
        })

    }

    const fetchMorePosts = () => {
        setLoadingMore(true);
        setFirstFetch(false);
        exploreMapPostData({
            token: REDUXUSER.token,
            topLeftCoords,
            topRightCoords,
            bottomRightCoords,
            bottomLeftCoords,
            ip: REDUXIP,
            skip
        })

    }

    useEffect(() => {
        if ((prevPostBSIndex !== 2 && currentPostBSIndex == 1) || (prevPostBSIndex === 0 && currentPostBSIndex == 2) && !isUnmounted) {
            firstFetchPost();
        }
    }, [
        currentPostBSIndex,
        topLeftCoords,
        topRightCoords,
        bottomLeftCoords,
        bottomRightCoords
    ]);


    useEffect(() => {
        if (isSuccess && !isUnmounted) {
            if (firstFetch) {
                setPosts(data.posts);
            } else {
                setPosts([...posts, ...data.posts]);
            }
            setLoadingMore(false);
            setFirstFetch(false);
            setSkip(data.skip);
            setNoMoreData(data.noMoreData);
        }
    }, [isSuccess, isError]);

    const handleOpenPost = (post) => {
        navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post });
    };

    const _getMorePost = () => {
        if (noMoreData) return;
        fetchMorePosts();
    }

    const LoadingComponent = () => {
        return (
            <View style={[styles.loadingComponent, { height: currentPostBSIndex === 1 ? 270 : height - 100 }]}>
                <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
        )
    }

    const renderEmptyComponent = () => {
        return (
            <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <Text>No post available</Text>
            </View>
        )
    }

    const renderFooter = () => {
        if (!loadingMore || firstFetch) return null;

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

    const ServerError = ({ onPress }) => {
        return (
            <View
                style={{
                    width,
                    height: currentPostBSIndex === 1 ? 270 : height - 100,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Opps! Something went wrong.</Text>
                <Text>Please try again.</Text>

                <TouchableOpacity
                    onPress={onPress}
                    style={{ marginBottom: 5, marginTop: 10 }}
                >
                    <Ionicons
                        name="reload-circle-sharp"
                        style={{ fontSize: 30, color: COLORS.foitiGrey }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ borderTopLeftRadius: currentPostBSIndex === 2 ? 0 : 17, borderTopRightRadius: currentPostBSIndex === 2 ? 0 : 17 }}>
            <View style={{ marginBottom: 100 }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingBottom: 12,
                    justifyContent: currentPostBSIndex == 2 ? 'flex-start' : 'center'
                }}>
                    {currentPostBSIndex === 2 && <Pressable
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        onPress={closeBottomSheet}
                    >
                        <Ionicons name="md-chevron-back-sharp" style={{ fontSize: 25 }} />
                    </Pressable>}
                    <Pressable onPress={openPostBottomsheet} disabled={currentPostBSIndex !== 0 ? true : false}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{latDelta > 13 ? 'Zoom in to explore' : 'Explore this area'}</Text>
                    </Pressable>
                </View>
                {isError ? (
                    <View style={{ flex: 1 }}>
                        <ServerError onPress={() => firstFetchPost()} />
                    </View>
                ) : (
                    <>
                        {isLoading && !loadingMore ?
                            <LoadingComponent />
                            : <FlatList
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    marginBottom: 50,
                                    paddingHorizontal: 2
                                }}
                                columnWrapperStyle={{
                                    justifyContent: "space-between",
                                    marginBottom: 7,
                                }}
                                numColumns={2}
                                renderItem={(item) => (
                                    <BoxPostComponent item={item.item} onPress={handleOpenPost} />
                                )}
                                
                                keyExtractor={(item, index) => index}
                                data={posts}
                                onEndReachedThreshold={0.5}
                                onEndReached={_getMorePost}
                                ListEmptyComponent={renderEmptyComponent}
                                ListFooterComponent={renderFooter}
                            />}
                    </>
                )}
            </View>
            {/* )} */}
        </View>
    )
}

export default MapExplorePost

const styles = StyleSheet.create({
    exploreTitleContainer: {
        justifyContent: "center",
        alignItems: 'center'
    },
    loadingComponent: {
        width,
        justifyContent: "center",
        alignItems: "center"
    }
})
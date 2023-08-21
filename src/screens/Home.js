import React, { useRef, useState, useEffect, useCallback  } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useBackHandler } from "@react-native-community/hooks";
import * as Location from "expo-location";

import { COLORS, FOITI_CONTS } from "resources";
import HomeHeader from "../components/Header/HomeHeader";
import ServerError from "../components/Error/ServerError";
import {
  useGetNearbyPostForHomeMutation,
  useGetNewInAppNotificationCountQuery,
  useGetRandomPostsMutation,
  useGetTotalActiveTripQuery,
  useGetUnreadMsgQuery,
  useGetUserSessionMutation,
} from "../Redux/services/serviceApi";
import UpdateNotification from "../components/UpdateNotification";
import { addNotifications } from "../Redux/slices/addNotificationSlice";
import PostBottomSheet from "../components/PostBottomSheet";
import { clearAlert } from "../Redux/slices/alertSlice";
import CustomAlert from "../components/CustomAlert";
import { addCoords } from "../Redux/slices/locationSlice";

import BoxPostComponent from "../components/Post/BoxPostComponent";
import ProfileBottomSheet from "../components/ProfileBottomSheet";
import NotificationBottomSheet from "../components/bottomSheets/NotificationBottomSheet";
import TopContributor from "../components/topContributors/TopContributor";
import HomeNearby from "../components/Nearby/HomeNearby";
import ModalComponent from "../components/ModalComponent";
import { getItemFromStore, removeItemFromStore, setItemInStore } from "../utils/handle";
import moment from "moment";

const { width, height } = Dimensions.get("screen");

const { diffClamp } = Animated;
const headerHeight = 55;
const elevationPoint = 4;

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXALERT = useSelector((state) => state.REDUXALERT);
  const REDUXLOCATION = useSelector((state) => state.LOCATIONCOORD);
  const [inAppNotCount, setInAppNotCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [error, setError] = useState(false);
  const [unreadMsg, setUnreadMsg] = useState(false);

  const [skip, setSkip] = useState(0);
  const [randomPosts, setRandomPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [tripPlans, setTripPlans] = useState(0);
  const [nearbyPosts, setNearbyPosts] = useState([]);
  const [showCommunityModal, setShowCommunityModal] = useState(false);


  //STATES FOR REPORTING AND SHARING BOTTOMSHEET
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [backPressed, setBackPressed] = useState(0);
  // const [foreground, requestForeground] = Location.useForegroundPermissions();
  const [elevationValue, setElevationValue] = useState(0);
  let separatorCount = useRef(0);

  useBackHandler(() => {
    if (backPressed === 0 && !isUnmounted) {
      setBackPressed(1);
      setTimeout(() => {
        setBackPressed(0);
      }, 1500);
      return true;
    } else {
      return false;
    }
  });


  const {
    data: notificationData,
    isSuccess: notificationIsSuccess,
    isError: notificationIsError,
    error: notificationError,
    refetch: notificationRefetch,
  } = useGetNewInAppNotificationCountQuery(
    { token: REDUXUSER.token },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: ureadMsg,
    isSuccess: ureadMsgIsSuccess,
    isError: ureadMsgIsError,
    error: ureadMsgError,
    refetch: ureadMsgRefetch,
  } = useGetUnreadMsgQuery(
    { token: REDUXUSER.token },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [getUserSession, {
    data: userSessionData,
    isSuccess: userSessionIsSuccess,
    isError: userSessionIsError,
    error: userSessionError,
  }] = useGetUserSessionMutation();

  //Total active trips
  const {
    data: tripData,
    error: tripError,
    isError: tripIsError,
    isSuccess: tripIsSuccess,
    refetch: tripRefetch
  } = useGetTotalActiveTripQuery(
    { token: REDUXUSER.token, user_id: REDUXUSER?.user._id },
    {
      refetchOnMountOrArgChange: true,
    }
  );


  const [getRandomPosts, { data, error: randomPostsError, isLoading: randomPostsLoading, isError, isSuccess }] =
    useGetRandomPostsMutation();

  useEffect(() => {
    separatorCount.current = 0;
    setIsUnmounted(false);
    notificationRefetch();
    ureadMsgRefetch();
    (async () => {
      setIsLoading(true);
      await getRandomPosts({
        ip: REDUXIP,
        token: REDUXUSER?.token,
        skip,
      });

      if (!isUnmounted) {
        //Add location if granted
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status == 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          if (location?.coords?.latitude) {
            const data = {
              lat: location?.coords.latitude,
              lng: location?.coords.longitude,
            };

            dispatch(addCoords({ coords: data }));
          } else {
            let lastLocation = await Location.getLastKnownPositionAsync({});
            if (lastLocation?.coords?.latitude) {
              const data = {
                lat: lastLocation?.coords.latitude,
                lng: lastLocation?.coords.longitude,
              };

              dispatch(addCoords({ coords: data }));
            }
          }
        }

        //fetch user session if no contribution
        if (REDUXUSER?.user?.total_contribution === 0) {
          try {
            const lastClosed = await getItemFromStore("lastTopContributionModelClosed");
            let sameDate = false;
            if (lastClosed) {
              let bool = moment(new Date()).startOf('day')
                .isSame(moment(lastClosed).startOf('day'));
              if (bool) {
                sameDate = true;
              }
            }
            if (!sameDate) {
              getUserSession({ token: REDUXUSER?.token })
            }
          } catch (error) {
            getUserSession({ token: REDUXUSER?.token })
          }
        }
      }

      if (!isUnmounted) {
        setIsLoading(false);
      }

    })();

    return () => {
      setIsUnmounted(true);
    };
  }, []);


  useEffect(() => {
    if (notificationIsSuccess) {
      if (!isUnmounted) {
        dispatch(
          addNotifications({ notification: notificationData.newNotification })
        );
      }
    }
  }, [notificationIsSuccess, notificationIsError]);

  useEffect(() => {
    if (ureadMsgIsSuccess) {
      if (!isUnmounted) {
        setUnreadMsg(ureadMsg)
      }
    }

    if (ureadMsgIsError) {
      if (!isUnmounted) {
        setUnreadMsg(false)
      }
    }
  }, [ureadMsgIsSuccess, ureadMsgIsError]);

  useEffect(() => {
    if (userSessionIsSuccess && !isUnmounted) {
      setShowCommunityModal(userSessionData?.showAlert || false);
    }
  }, [userSessionIsSuccess, userSessionIsError]);

  useEffect(() => {
    if (tripIsSuccess) {
      if (!isUnmounted) {
        setTripPlans(tripData?.activeTrips.length)
      }
    }
  }, [tripIsSuccess, tripIsError]);
  //HIDE SHOW ALERT
  useEffect(() => {
    if (!isUnmounted && REDUXALERT.type == "post") {
      setIsVisible(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        dispatch(clearAlert());
      }, 2000);
    }
  }, [REDUXALERT]);

  //OPEN NOTIFICATION
  const openNotification = () => {
    setInAppNotCount(0);
    navigation.push(`InAppNotification via ${REDUXNAVIGATION.name}`);
  };

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        setRandomPosts([...randomPosts, ...data.randomPosts]);
        setSkip(data.skipData);

        if (data.randomPosts.length === 0) {
          setNoMoreData(true);
        }
      }
    }
  }, [isSuccess, isError]);


  const reload = async () => {
    if (isUnmounted) return;
    notificationRefetch();
    setError(false);
    setNoMoreData(false);
    setFirstFetch(true);
    setRandomPosts([]);
    await getRandomPosts({
      ip: REDUXIP,
      token: REDUXUSER?.token,
      skip: 0,
    });
    setIsLoading(true);
    await firstFetch();
    if (REDUXLOCATION?.coords?.lat && REDUXLOCATION?.coords?.lng && !isUnmounted) {
      const body = {
        skip: 0,
        ip: REDUXIP.ip,
        token: REDUXUSER.token,
        sortBy: "nearest",
        distance: 50,
        currentCoordinate: REDUXLOCATION.coords,
      };
      getNearbyPost(body);
    }
    if (!isUnmounted) {
      setIsLoading(false);
    }
  };

  const _onRefresh = async () => {
    if (isUnmounted) return;
    setIsRefreshing(true);
    notificationRefetch();
    setNoMoreData(false);
    setFirstFetch(true);
    setRandomPosts([]);
    await getRandomPosts({
      ip: REDUXIP,
      token: REDUXUSER?.token,
      skip: 0,
    });
    if (REDUXLOCATION?.coords?.lat && REDUXLOCATION?.coords?.lng && !isUnmounted) {
      const body = {
        skip: 0,
        ip: REDUXIP.ip,
        token: REDUXUSER.token,
        sortBy: "nearest",
        distance: 50,
        currentCoordinate: REDUXLOCATION.coords,
      };
      getNearbyPost(body);
    }
    if (!isUnmounted) {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (data?.randomPosts?.length === 0) {
      setNoMoreData(true);
    }
  }, [data]);

  useEffect(() => {
    if (!randomPostsLoading) {
      if (loadingMore) {
        setLoadingMore(false);
      }
      if (isRefreshing) {
        setIsRefreshing(false);
      }
    }
  }, [randomPostsLoading]);

  //FETCH MORE POSTS
  const _getNewPlaces = async () => {
    if (noMoreData === false && randomPostsLoading !== true) {
      setLoadingMore(true);
      setFirstFetch(false);

      await getRandomPosts({
        ip: REDUXIP,
        token: REDUXUSER?.token,
        skip,
      });
    }
  };

  const handleOpenPost = (post) => {
    navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post });
  };

  const messagePressed = () => {
    if (isUnmounted) return;
    setUnreadMsg(false)
    navigation.push(`ChatTopNavigation via ${REDUXNAVIGATION.name}`);
  };

  //Functions for nearby posts
  const [getNearbyPost, { data: nearbyData, isSuccess: nearbyIsSuccess, isError: nearbyIsError }] =
    useGetNearbyPostForHomeMutation();

  useEffect(() => {
    if (REDUXLOCATION?.coords?.lat && REDUXLOCATION?.coords?.lng && !isUnmounted) {
      const body = {
        skip: 0,
        ip: REDUXIP.ip,
        token: REDUXUSER.token,
        sortBy: "nearest",
        distance: 50,
        currentCoordinate: REDUXLOCATION.coords,
      };
      getNearbyPost(body);
    }
  }, [REDUXLOCATION]);


  useEffect(() => {
    if (nearbyIsSuccess) {
      setNearbyPosts(nearbyData.posts)
    }
    if (nearbyIsError) {
      setNearbyPosts([]);
    }
  }, [nearbyIsSuccess, nearbyIsError])

  //HIDE Contribution Notification Model
  const hideContributionModel = async () => {
    try {
      await setItemInStore("lastTopContributionModelClosed", new Date());
    } catch (error) {
      //Just ignore if there is any error.
    }
    setShowCommunityModal(false)
  }


  //CODE FOR ANIMATING HEARDER COMPONENT START
  const ref = useRef(null);
  const scrollY = useRef(new Animated.Value(0));

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            y: scrollY.current,
          },
        },
      },
    ],
    { useNativeDriver: true }
  );

  const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
  });


  const translateYNumber = useRef();

  translateY.addListener(({ value }) => {
    translateYNumber.current = value;
  });

  const handleSnap = ({ nativeEvent }) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (offsetY === 0) {
      setElevationValue(0)
    } else {
      setElevationValue(elevationPoint)
    }
  };
  //CODE FOR ANIMATING HEARDER COMPONENT END

  //RENDER FOR USER THAT HAS NO FOLLOWER
  const _renderHeader = () => {
    return (
      <View style={{ marginTop: headerHeight }}>
        <UpdateNotification />
        <View>
          <>
            <View style={styles.flatContainer}>
              <View style={styles.searchContainer}>
                <TouchableOpacity style={styles.searchBox} onPress={() => navigation.navigate("Search via home")}>
                  <Ionicons name="search-outline" style={{ marginRight: 4, color: COLORS.foitiGrey }} size={25} />
                  <Text style={{ color: COLORS.foitiGrey, fontSize: 13.5 }} numberOfLines={1}>Destination, Travellers, Attractions...</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ backgroundColor: COLORS.foitiGreyLighter }}>
              {nearbyPosts.length > 3 && (
                <HomeNearby posts={nearbyPosts} />
              )}
              <View
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: FOITI_CONTS.padding + 5,
                  backgroundColor: "#fff",
                  borderTopLeftRadius: nearbyPosts.length > 3 ? 0 : 30,
                  borderTopRightRadius: nearbyPosts.length > 3 ? 0 : 30,
                  marginTop: nearbyPosts.length > 3 ? -3 : 0,
                  // borderTopLeftRadius: 30,
                  // borderTopRightRadius: 30

                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", color:"#000" }}>Explore & Navigate To Exact Location</Text>
                <Text style={{ fontSize: 11, textAlign: "center" }}>Every photo you see has coordinates.</Text>
              </View>
            </View>
          </>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View
        style={{
          paddingTop: 40,
          height,
        }}
      >
        {(!isLoading && !isRefreshing) ?? (
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            No post to show
          </Text>
        )}
      </View>
    );
  };

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

  //POSTS LOADING
  if (isLoading || (randomPostsLoading && firstFetch)) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }



  const randerSeparator = (e) => {
    separatorCount.current += 1;
    let showEle = false;
    if (randomPosts[3]._id.toString() === e?.leadingItem[1]._id.toString()) {
      showEle = true
    }
    if (showEle) {
      return <TopContributor isUnmounted={isUnmounted} />
    } else {
      return null;
    }
  }

  // const randerSeparator = useCallback ((e) => {
  //   separatorCount.current += 1;
  //   let showEle = false;
  //   if (randomPosts[3]._id.toString() === e?.leadingItem[1]._id.toString()) {
  //     showEle = true
  //   }
  //   if (showEle) {
  //     return <TopContributor isUnmounted={isUnmounted} />
  //   } else {
  //     return null;
  //   }
  // }, [randomPosts])


  return (
    <View style={{ backgroundColor: "#fff" }}>
      <Animated.View
        style={[styles.haderPosition, { transform: [{ translateY }], elevation: elevationValue }]}
      >
        <HomeHeader
          hasUnreadMsg={unreadMsg}
          messagePressed={messagePressed}
          inAppNotCount={inAppNotCount}
          openNotification={openNotification}
        />
      </Animated.View>
      {!error ? (
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll} //For hidding header on scroll
          onMomentumScrollEnd={handleSnap} //For handling snap
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 7,
            paddingHorizontal: 7
          }}
          ref={ref}
          numColumns={2}
          ListHeaderComponent={_renderHeader}
          ListEmptyComponent={renderEmptyList}
          data={randomPosts}
          renderItem={(item) => (
            <BoxPostComponent item={item.item} onPress={handleOpenPost} />
          )}
          ItemSeparatorComponent={(e) => randerSeparator(e)}
          keyExtractor={(item, index) => index}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={_onRefresh}
              tintColor={"#f8852d"}
            />
          }
          onEndReachedThreshold={0.5}
          onEndReached={_getNewPlaces}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View>
          <ServerError onPress={reload} />
        </View>
      )}
      <ModalComponent
        header={false}
        body="Foiti is a community-based app where every content is contributed by travellers."
        secondBody="Share your travel photos and help fellow travellers in discovering new places."
        closeModal={hideContributionModel}
        modalVisible={showCommunityModal}
        showCloseButton={true}
      />
      <ProfileBottomSheet totalTrips={tripPlans} />
      {/* <PostBottomSheet
        isVisible={isVisible}
        hideBottomSheet={() => {
          setIsVisible(false);
        }}
        post={selectedPost}
      /> */}
      <NotificationBottomSheet />
      {showAlert && <CustomAlert text={REDUXALERT?.message} />}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  flatContainer: {
    backgroundColor: COLORS.foitiGreyLighter,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    borderWidth: 0,
  },
  haderPosition: {
    flex: 1,
    position: "absolute",
    // elevation: 4,
    backgroundColor: "#fff",
    zIndex: 10,
    height: headerHeight,
  },
  searchContainer: {
    width,
    alignItems: "center",
    // marginBottom: 5,
  },
  searchBox: {
    backgroundColor: "#fff",
    width: "80%",
    borderWidth: 1,
    borderColor: COLORS.foitiGreyLight,
    flexDirection: "row",
    alignItems: "center",
    padding: 7,
    borderRadius: 40,
    paddingLeft: 10,
    elevation: 10,
  },
  locationName: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    bottom: 0,
    left: 0,
  },
  image: {
    width: (width - 12) / 2,
    height: (width - 12) / 2,
    resizeMode: "cover",
  },
});

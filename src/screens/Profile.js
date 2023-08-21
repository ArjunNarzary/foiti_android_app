import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  Switch,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import CoverProfile from "../components/Profile/CoverProfile";
import Details from "../components/Profile/Details";
import ProfileNumbers from "../components/Profile/ProfileNumbers";
import { COLORS } from "../resources/theme";
import BoxPostComponent from "../components/Post/BoxPostComponent";
import { useDispatch, useSelector } from "react-redux";
import { useViewOthersProfileQuery } from "../Redux/services/serviceApi";
import ServerError from "../components/Error/ServerError";
import { fetchPostsApi, refetchPostsApi } from "../Redux/customApis/api";
import { useNavigation } from "@react-navigation/native";
import UserBottomSheet from "../components/UserBottomSheet";
import CustomAlert from "../components/CustomAlert";
import { clearAlert } from "../Redux/slices/alertSlice";
import { useBackHandler } from "@react-native-community/hooks";
import UpcomingTrip from "../components/trips/UpcomingTrip";

const { width, height } = Dimensions.get("screen");

const FlatListHeader = ({
  showInstruction,
  userData,
  showToggle,
  showGeoPost,
  showToggleContainer,
  handleNonGeoPost,
  postCount,
  showBottomSheet,
}) => {
  return (
    <View style={{ paddingBottom: 4 }}>
      <View>
        <PostPlaceHeader
          title={userData?.user?.name}
          isProfile={true}
          otherProfile={true}
          showBottomSheet={showBottomSheet}
        />
        <View style={{ marginLeft: -7, width }}>
          <CoverProfile
            userData={userData}
            profileImg={userData?.user?.profileImage?.large?.private_id}
            profileLargeImg={userData?.user?.profileImage?.extraLarge?.private_id}
            coverImg={userData?.user?.coverImage?.large?.private_id}
          />
        </View>
        <View style={{ paddingHorizontal: 5 }}>
          <Details showInstruction={showInstruction} userData={userData} />
          {userData?.tripPlans && userData?.tripPlans.length > 0 &&
            <UpcomingTrip userData={userData} />
          }
          <ProfileNumbers
            userData={userData}
            showToggleContainer={showToggleContainer}
            showGeoPost={showGeoPost}
            postCount={postCount}
          />
        </View>
      </View>
      {showToggle && (
        <View
          style={{
            paddingHorizontal: 10,
            backgroundColor: "#ededed",
            width,
            marginLeft: -4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text>Hide photos without geo-location</Text>
          </View>
          <View>
            <Switch
              trackColor={{
                false: COLORS.foitiGreyLight,
                true: COLORS.foitiGrey,
              }}
              ios_backgroundColor="#3e3e3e"
              thumbColor="#fff"
              value={showGeoPost}
              onValueChange={handleNonGeoPost}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const Profile = ({ route }) => {
  const { userId } = route.params;
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXALERT = useSelector((state) => state.REDUXALERT);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //STATES
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [numberOfSkip, setNumberOfSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [posts, setPosts] = useState([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [lodingMore, setLodingMore] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [showToggle, setShowToggle] = useState(false);
  const [showGeoPost, setShowGeoPost] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [unMounted, setUnMounted] = useState(false);
  const [skip, setSkip] = useState(true);
  const showToggleContainer = () => {
    setShowToggle((prev) => !prev);
  };

  let userData = {};

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
    return true;
  });

  //API QUERIES
  const { data, isLoading, error, isSuccess, isError, refetch } =
    useViewOthersProfileQuery(
      { userId, token: REDUXUSER.token, ip: REDUXIP.ip },
      { refetchOnMountOrArgChange: true }
    );

  //MOUNT AND UNMOUNT
  useEffect(() => {
    setUnMounted(false);
    return () => {
      setUnMounted(true);
      setSkip(true);
    };
  }, []);

  //SHOW ALERT
  useEffect(() => {
    if (!unMounted && REDUXALERT.type == "user") {
      setIsVisible(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        dispatch(clearAlert());
      }, 2000);
    }
  }, [REDUXALERT]);

  useEffect(() => {
    (async () => {
      setFetchData(true);
      setPosts([]);
      await refetchPosts();
      setFetchData(false);
    })();
  }, [showGeoPost]);

  const handleNonGeoPost = async () => {
    if (unMounted) return;
    if (!fetchData) setShowGeoPost((prev) => !prev);
  };

  //FETCH POSTS
  const refetchPosts = async () => {
    if (!fetchData && !unMounted) {
      setFetchData(true);
    }
    const body = {
      skip: 0,
      limit: limit,
      token: REDUXUSER.token,
      ip: REDUXIP.ip,
      user_id: userId,
      showGeoPost,
    };

    const data = await refetchPostsApi(body);
    if (data.posts.length > 0 && !unMounted) {
      setPosts(data.posts);
      setNumberOfSkip(data.newSkip);
      setPostCount(data.postsCount);
    }

    if (!unMounted) {
      if (noMoreData) {
        setNoMoreData(false);
      }
      if (fetchData) {
        setFetchData(false);
      }
      if (isRefreshing) {
        setIsRefreshing(false);
      }
    }
  };

  //FETCH MORE POSTS
  const fetchPosts = async () => {
    const body = {
      skip: numberOfSkip,
      limit: limit,
      token: REDUXUSER.token,
      ip: REDUXIP.ip,
      user_id: userId,
      showGeoPost,
    };

    if (!noMoreData && !unMounted) {
      const data = await fetchPostsApi(body);
      if (data.posts.length > 0 && !unMounted) {
        setPosts([...posts, ...data.posts]);
        setNumberOfSkip(data.newSkip);
      } else {
        setNoMoreData(true);
      }
    }
    setLodingMore(false);
  };

  const showInstruction = () => {
    navigation.push(`FoitiAmbassador via ${REDUXNAVIGATION.name}`)
  };

  if (isSuccess) {
    if (!unMounted) {
      userData = data;
    }
  }

  //set changes
  const makeChanges = async () => {
    userData = data;
    setFetchData(true);
    await fetchPosts();
    setFetchData(false);
  };

  useEffect(() => {
    if (isSuccess) {
      if (!unMounted) {
        makeChanges();
      }
    }
    if (isError) {
      if (error.status == 404 || error.status == 400) {
        navigation.navigate("NotFound");
      } else if (error.status == 401) {
        navigation.navigate("NotFound", {
          text: "This account has been deactivated",
        });
      }
    }
  }, [isSuccess, isError]);

  const _getNewPlaces = async () => {
    setLodingMore(true);
    await fetchPosts();
    setLodingMore(false);
  };

  const reload = async () => {
    refetch();
    await refetchPosts();
  };

  const _onRefresh = async () => {
    setIsRefreshing(true);
    refetch();
    await refetchPosts();
    setFetchData(false);
    setIsRefreshing(false);
  };

  //SHOW BOTTOMSHEET
  const showBottomSheet = () => {
    setIsVisible(true);
  };

  const renderFooter = () => {
    if (!lodingMore) return null;

    return (
      <>
        {!fetchData && (
          <View
            style={{
              paddingVertical: 10,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.foiti} />
          </View>
        )}
      </>
    );
  };

  const renderEmptyList = () => {
    return (
      <>
        {fetchData ? (
          <View style={{ paddingTop: 40 }}>
            <ActivityIndicator size="large" color={COLORS.foiti} />
          </View>
        ) : (
          <View
            style={{
              paddingTop: 40,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              No post to show
            </Text>
          </View>
        )}
      </>
    );
  };

  if (isLoading) {
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

  const handleOpenPost = (post) => {
    navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post });
  };

  return (
    <>
      {isSuccess ? (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View>
            <FlatList
              contentContainerStyle={{ paddingHorizontal: 7 }}
              ListHeaderComponent={
                <FlatListHeader
                  userData={userData}
                  showInstruction={showInstruction}
                  showToggle={showToggle}
                  showGeoPost={showGeoPost}
                  showToggleContainer={showToggleContainer}
                  handleNonGeoPost={handleNonGeoPost}
                  postCount={postCount}
                  showBottomSheet={showBottomSheet}
                />
              }
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 7,
              }}
              numColumns={2}
              data={posts}
              renderItem={(item) => (
                <BoxPostComponent item={item.item} onPress={handleOpenPost} />
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
              onEndReachedThreshold={1}
              onEndReached={_getNewPlaces}
              ListFooterComponent={renderFooter}
            />
          </View>
          <UserBottomSheet
            user={userData?.user}
            isVisible={isVisible}
            hideBottomSheet={() => {
              setIsVisible(false);
            }}
          />
          {showAlert && <CustomAlert text={REDUXALERT?.message} />}
        </View>
      ) : (
        <ServerError onPress={reload} />
      )}
    </>
  );
};

export default Profile;

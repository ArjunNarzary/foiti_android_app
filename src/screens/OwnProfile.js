import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import CoverProfile from "../components/Profile/CoverProfile";
import Details from "../components/Profile/Details";
import ProfileNumbers from "../components/Profile/ProfileNumbers";
import { COLORS } from "../resources/theme";
import BoxPostComponent from "../components/Post/BoxPostComponent";
import ModalComponent from "../components/ModalComponent";
import { useViewOwnProfileQuery } from "../Redux/services/serviceApi";
import ServerError from "../components/Error/ServerError";
import { fetchPostsApi, refetchPostsApi } from "../Redux/customApis/api";
import ProfileBottomSheet from "../components/ProfileBottomSheet";
import UpcomingTrip from "../components/trips/UpcomingTrip";
import MeetupModal from "../components/meetup/MeetupModal";

const { width, height } = Dimensions.get("screen");

const FlatListHeader = ({ showInstruction, userData, ownProfile, posts }) => {
  return (
    <View style={{ paddingBottom: 4 }}>
      <View>
        <PostPlaceHeader title="Profile" isProfile={true} />
        <View style={{ marginLeft: -7, width }}>
          <CoverProfile
            isOwnProfile={ownProfile}
            userData={userData}
            profileImg={userData?.user?.profileImage?.large?.private_id}
            profileLargeImg={userData?.user?.profileImage?.extraLarge?.private_id}
            coverImg={userData?.user?.coverImage?.large?.private_id}
          />
        </View>
        <View style={{ paddingHorizontal:4 }}>
          <Details showInstruction={showInstruction} userData={userData} />
          {userData?.tripPlans && userData?.tripPlans.length > 0 && 
            <UpcomingTrip userData={userData} />
          }
          <ProfileNumbers userData={userData} />
        </View>
      </View>
    </View>
  );
};

const OwnProfile = ({ route }) => {
  const navigation = useNavigation();
  let showMeetupAlert = route?.params?.showMeetupAlert;
  const REDUXDATA = useSelector((state) => state.AUTHUSER);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [numberOfSkip, setNumberOfSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [posts, setPosts] = useState([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [lodingMore, setLodingMore] = useState(false);
  const [unMounted, setUnMounted] = useState(false);
  const [showMeetupModal, setShowMeetupModal] = useState(showMeetupAlert || false);

  let userData = {};

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

  const { data, error, isLoading, isError, isSuccess, refetch } =
    useViewOwnProfileQuery(
      { token: REDUXDATA.token, ip: REDUXIP.ip },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  //MOUNT AND UNMOUNT
  useEffect(() => {
    setUnMounted(false);
    return () => {
      setUnMounted(true);
    };
  }, []);

  const closeModal = () => {
    setShowMeetupModal(false);
  };

  const showInstruction = () => {
    navigation.push(`FoitiAmbassador via ${REDUXNAVIGATION.name}`)
  };

  const reload = async () => {
    refetch();
    await refetchPosts();
  };

  const _onRefresh = async () => {
    setIsRefreshing(true);
    refetch();
    await refetchPosts();
  };

  const _getNewPlaces = async () => {
    setLodingMore(true);
    await fetchPosts();
  };

  if (isSuccess && !unMounted) {
    userData = data;
    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    (async () => {
      if (isSuccess && !unMounted) {
        setFetchData(true);
        await fetchPosts();
        setFetchData(false);
      }
    })();
  }, [isSuccess]);

  //FETCH POSTS
  const refetchPosts = async () => {
    const body = {
      skip: 0,
      limit: limit,
      token: REDUXDATA.token,
      ip: REDUXIP.ip,
      user_id: REDUXDATA.user._id,
    };

    const data = await refetchPostsApi(body);
    if (data.posts.length > 0 && !unMounted) {
      setPosts(data.posts);
      setNumberOfSkip(data.newSkip);
    }
    if (!unMounted) {
      setNoMoreData(false);
      setFetchData(false);
      setIsRefreshing(false);
    }
  };

  //FETCH MORE POSTS
  const fetchPosts = async () => {
    const body = {
      skip: numberOfSkip,
      limit: limit,
      token: REDUXDATA.token,
      ip: REDUXIP.ip,
      user_id: REDUXDATA.user._id,
    };
    if (unMounted) return;
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

  //RENDER FOOTER
  const renderFooter = () => {
    if (!lodingMore) return null;

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

  const renderEmptyList = () => {
    return (
      <>
        <View
          style={{
            paddingTop: 40,
          }}
        >
          {fetchData ? (
            <ActivityIndicator size="large" color={COLORS.foiti} />
          ) : (
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              No post to show
            </Text>
          )}
        </View>
      </>
    );
  };

  const handleOpenPost = (post) => {
    navigation.navigate(`Post via ${REDUXNAVIGATION.name}`, { post });
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
                  showInstruction={showInstruction}
                  userData={userData}
                  posts={posts}
                  ownProfile={
                    userData.length !== 0 ||
                    (REDUXDATA?.user?._id == userData?.user?._id ? true : false)
                  }
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
          <MeetupModal
            body="You have incomplete meetup profile. If you wish to meet locals or other travellers in this trip, continue to Meet Up."
            closeModal={closeModal}
            modalVisible={showMeetupModal}
            openMeetup={() => {
              closeModal();
              navigation.navigate("Meet Up Tab")
            }}
          />
          <ProfileBottomSheet totalTrips = {userData?.tripPlans?.length}/>
        </View>
      ) : (
        <ServerError onPress={reload} />
      )}
    </>
  );
};

export default OwnProfile;

const styles = StyleSheet.create({
  subHeaderContainer: {
    paddingBottom: 10,
  },
});

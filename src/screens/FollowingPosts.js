import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useBackHandler } from "@react-native-community/hooks";

import { COLORS } from "resources";
import Post from "../components/Post/Post";
import ModalComponent from "../components/ModalComponent";
import { getFollowersPosts } from "../Redux/customApis/api";
import ServerError from "../components/Error/ServerError";
import { removeItemFromStore } from "../utils/handle";
import { removeUser } from "../Redux/slices/authSlice";
import PostBottomSheet from "../components/PostBottomSheet";
import { clearAlert } from "../Redux/slices/alertSlice";
import CustomAlert from "../components/CustomAlert";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");

const headerHeight = 55;

const FollowingPosts = () => {
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const REDUXALERT = useSelector((state) => state.REDUXALERT);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [error, setError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMorePost, setNoMorePost] = useState(false);
  //STATES FOR REPORTING AND SHARING BOTTOMSHEET
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [showAlert, setShowAlert] = useState(false);

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
    const body = {
      skip: 0,
      token: REDUXUSER.token,
      ip: REDUXIP,
    };

    const res = await getFollowersPosts(body);
    if (!isUnmounted) {
      if (!res.error) {
        setPosts(res.data.posts);
        setSkip(res.data.skip);
        setNoMorePost(res.data.noMorePosts)
        setIsLoading(false);
        setIsRefreshing(false);
      } else {
        if (res.status === 400 || res.status === 403 || res.status === 401) {
          dispatch(removeUser());
          await removeItemFromStore("userData");
          navigation.navigate("AuthNavigation");
        }
        setError(true);
      }
    }
  };

  useEffect(() => {
    setIsUnmounted(false);
    (async () => {
      setIsLoading(true);
      await firstFetch();
      if (!isUnmounted) {
        setIsLoading(false);
      }
    })();

    return () => {
      setIsUnmounted(true);
    };
  }, []);

  //HIDE SHOW ALERT
  useEffect(() => {
    if (!isUnmounted && (REDUXALERT.type == "post" || REDUXALERT.type == "savePost")) {
      setIsVisible(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        dispatch(clearAlert());
      }, 2000);
    }
  }, [REDUXALERT]);


  const reload = async () => {
    if (isUnmounted) return;
    setError(false);
    setNoMorePost(false);
    setIsLoading(true);
    await firstFetch();
    if (!isUnmounted) {
      setIsLoading(false);
    }
  };

  const _onRefresh = async () => {
    if (isUnmounted) return;
    setIsRefreshing(true);
    setNoMorePost(false);
    await firstFetch();
    if (!isUnmounted) {
      setIsRefreshing(false);
    }
  };

  const fetchMore = async () => {
    const body = {
      skip,
      token: REDUXUSER.token,
      ip: REDUXIP,
    };

    const res = await getFollowersPosts(body);
    if (!isUnmounted) {
      if (!res.error) {
        setPosts([...posts, ...res.data.posts]);
        setSkip(res.data.skip);
        setNoMorePost(res.data.noMorePosts);
        setIsLoading(false);
        setIsRefreshing(false);
      } else {
        setError(true);
      }
    }
  };

  //GET MORE POSTS
  const _getMorePosts = async () => {
    if (isUnmounted) return;
    setLoadingMore(true);
    if (!noMorePost) {
      await fetchMore();
    }
    if (!isUnmounted) {
      setLoadingMore(false);
    }
  };

  const closeModal = () => {
    if (isUnmounted) return;
    setModalVisible(false);
  };

  //SHOW BOTTOMSHEET
  const showBottomSheet = (item) => {
    if (isUnmounted) return;
    setSelectedPost(item);
    if (item._id) {
      setIsVisible(true);
    }
  };

  //RENDER FOR USER THAT HAS NO FOLLOWER
  // const _renderSuggestionText = () => {
  //   return (
  //     <View style={{ marginTop: headerHeight }}>
  //       <UpdateNotification />
  //       <View>
  //         <>
  //           <View style={styles.flatContainer}>
  //             <View style={styles.searchContainer}>
  //               <TouchableOpacity style={styles.searchBox} onPress={() => navigation.navigate("Search via home")}>
  //                 <Ionicons name="search-outline" style={{ marginRight: 4, color: COLORS.foitiGrey }} size={25} />
  //                 <Text style={{ color: COLORS.foitiGrey, fontSize: 13.5 }} numberOfLines={1}>Destination, Travellers, Attractions...</Text>
  //               </TouchableOpacity>
  //             </View>
  //             {!hasFollowingPost && (
  //               <View style={{
  //                 paddingHorizontal: 25, marginTop: 20
  //               }}>
  //                 <Text style={{ textAlign: "center" }}>
  //                   Looks like you have not followed anyone. Why don't you start by
  //                   exploring?
  //                 </Text>
  //               </View>
  //             )}
  //           </View>
  //           <View style={{ backgroundColor: COLORS.foitiGreyLighter }}>
  //             <View
  //               style={{
  //                 paddingTop: 15,
  //                 paddingHorizontal: FOITI_CONTS.padding + 5,
  //                 backgroundColor: "#fff",
  //                 borderTopLeftRadius: 30,
  //                 borderTopRightRadius: 30

  //               }}
  //             >
  //               <Text style={{ fontWeight: "bold" }}>{hasFollowingPost ? "Posts From Travellers You Follow" : "Suggested Posts"}</Text>
  //               <View style={{
  //                 borderBottomWidth: 0.5,
  //                 borderBottomColor: COLORS.foitiGreyLight, marginTop: 15
  //               }} />
  //             </View>
  //           </View>
  //         </>
  //       </View>
  //     </View>
  //   );
  // };
  //RENDER EMPTY COMPONENT
  const _renderEmptyComponent = () => {
    return (
      <View
        style={{
          width,
          height : height - 150,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal:30
        }}
      >
        <Text style={{ textAlign:"center" }}>
          Looks like you have not followed anyone. Why don't you start by exploring?
        </Text>
      </View>
    )
  }

  //RENDER FOOTER COMPONENT
  const _renderFooter = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderTopColor: "#CED0CE",
          }}
        >
          <ActivityIndicator animating size="large" color={COLORS.foiti} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderTopColor: "#CED0CE",
          }}
        >
          <Text style={{ textAlign: "center" }}>No more posts</Text>
        </View>
      );
    }
  };

  //POSTS LOADING
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

  return (
    <View style={{ backgroundColor: "#fff" }}>
      {!error ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 7 }}>
              <PostPlaceHeader title="Following" />
            </View>
          }
          ListEmptyComponent={_renderEmptyComponent}
          data={posts}
          maxToRenderPerBatch={50}
          renderItem={(item) => (
            <Post
              isUnmounted={isUnmounted}
              post={item}
              openBottomSheet={() => {
                showBottomSheet(item?.item);
              }}
            />
          )}
          keyExtractor={(item) => {
            return item._id;
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              progressViewOffset={50}
              onRefresh={_onRefresh}
              tintColor={"#f8852d"}
            />
          }
          onEndReachedThreshold={1}
          onEndReached={_getMorePosts}
          ListFooterComponent={_renderFooter}
          // ref={ref}
        />
      ) : (
        <View>
          <ServerError onPress={reload} />
        </View>
      )}
      <View>
        <ModalComponent
          header={true}
          title="Coming Soon"
          body="We are very excited about this feature and working very hard as well. When it's ready, it's gonna be awesome."
          closeModal={closeModal}
          modalVisible={modalVisible}
        />
      </View>
      <PostBottomSheet
        isVisible={isVisible}
        hideBottomSheet={() => {
          setIsVisible(false);
        }}
        post={selectedPost}
      />
      {showAlert && <CustomAlert text={REDUXALERT?.message} />}
    </View>
  );
};

export default FollowingPosts;

const styles = StyleSheet.create({
  flatContainer: {
    backgroundColor: COLORS.foitiGreyLighter,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30
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
  }
});

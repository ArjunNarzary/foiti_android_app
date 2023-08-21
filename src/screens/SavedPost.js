import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ServerError from "../components/Error/ServerError";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { useSelector } from "react-redux";
import BoxPostComponent from "../components/Post/BoxPostComponent";
import { useGetSavedPostMutation } from "../Redux/services/serviceApi";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../resources/theme";
import { useBackHandler } from "@react-native-community/hooks";
const { width, height } = Dimensions.get("screen");

const SavedPost = () => {
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const [unMounted, setUnMounted] = useState(false);
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [firstFetch, setFirstFetch] = useState(true);
  const [noMoreData, setNoMoreData] = useState(false);

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

  const [getSavedPost, { isLoading, isSuccess, isError, data, error }] =
    useGetSavedPostMutation();

  useEffect(() => {
    setUnMounted(false);
    setFirstFetch(true);
    const body = {
      token: REDUXUSER.token,
      skip,
      limit,
      ip: REDUXIP.ip,
    };
    if (!unMounted) {
      getSavedPost(body);
      setIsRefreshing(false);
    }
    return () => {
      setUnMounted(true);
    };
  }, []);

  useEffect(() => {
    if (!unMounted) {
      if (isSuccess) {
        // setPosts(data.posts);
        setPosts([...posts, ...data.posts]);
        setSkip(data.skipData);
        if (data.posts.length < 8) {
          setNoMoreData(true);
        }
        setFirstFetch(false);
      }
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (!isLoading) {
      if (loadingMore) {
        setLoadingMore(false);
      }
      if (isRefreshing) {
        setIsRefreshing(false);
      }
    }
  }, [isLoading]);

  const loadMoreData = () => {
    if (!noMoreData && !unMounted) {
      setLoadingMore(true);
      const body = {
        token: REDUXUSER.token,
        skip,
        limit,
        ip: REDUXIP.ip,
      };
      getSavedPost(body);
    }
  };

  const _onRefresh = async () => {
    if (!unMounted) {
      setPosts([]);
      setNoMoreData(false);
      setFirstFetch(true);
      setIsRefreshing(true);
      const body = {
        token: REDUXUSER.token,
        skip: 0,
        limit,
        ip: REDUXIP.ip,
      };
      await getSavedPost(body);
      setIsRefreshing(false);
      setFirstFetch(false);
    }
  };

  const reload = () => {
    if (!unMounted) {
      setPosts([]);
      setNoMoreData(false);
      setFirstFetch(true);
      const body = {
        token: REDUXUSER.token,
        skip: 0,
        limit,
        ip: REDUXIP.ip,
      };
      getSavedPost(body);
      setFirstFetch(false);
    }
  };
  const handleOpenPost = (post) => {
    navigation.push("Post via profile", { post });
  };

  const renderEmptyList = () => {
    return (
      <View
        style={{
          paddingTop: 40,
        }}
      >
        {!isLoading && !isRefreshing && (
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

  return (
    <>
      {isSuccess || isLoading ? (
        <>
          {isLoading && firstFetch ? (
            <View
              style={{
                position: "absolute",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height,
                width,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
          ) : (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <View>
                <FlatList
                  contentContainerStyle={{ paddingHorizontal: 7 }}
                  ListHeaderComponent={
                    <View style={{ marginBottom: 5, width }}>
                      <PostPlaceHeader title="Bucket List" />
                    </View>
                  }
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 7,
                  }}
                  numColumns={2}
                  data={posts}
                  renderItem={(item) => (
                    <BoxPostComponent
                      item={item.item}
                      onPress={handleOpenPost}
                    />
                  )}
                  keyExtractor={(item, index) => index}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={_onRefresh}
                      tintColor={"#f8852d"}
                    />
                  }
                  onEndReachedThreshold={0.5}
                  onEndReached={loadMoreData}
                  ListEmptyComponent={renderEmptyList}
                  ListFooterComponent={renderFooter}
                />
              </View>
            </View>
          )}
        </>
      ) : (
        <ServerError onPress={reload} />
      )}
    </>
  );
};

export default SavedPost;

const styles = StyleSheet.create({});

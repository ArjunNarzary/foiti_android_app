import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import UserDetails from "../components/UserDetails";
import { useSelector } from "react-redux";
import { useGetPostLikedUsersMutation } from "../Redux/services/serviceApi";
import { COLORS } from "../resources/theme";
import ServerError from "../components/Error/ServerError";
import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";

const PostLikedUsers = ({ route }) => {
  const post = route.params.post;
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const [limit, setLimit] = useState(20);
  const [skip, setSkip] = useState(0);
  const [isUnMounted, setIsUnMounted] = useState(false);
  const [users, setUsers] = useState([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);

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

  const [getPostLikedUsers, { data, isLoading, isError, isSuccess }] =
    useGetPostLikedUsersMutation();

  useEffect(() => {
    setIsUnMounted(false);
    (async () => {
      await fetchData();
    })();

    return () => {
      setIsUnMounted(true);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && !isUnMounted) {
      if (data.users.length > 0) {
        if (firstFetch) {
          setUsers(data.users);
          setFirstFetch(false);
        } else {
          setUsers([...users, ...data?.users]);
        }
        if (data.users.length < limit) setNoMoreData(true);
        setSkip(data?.skip);
        setLoadingMore(false);
      } else {
        setNoMoreData(true);
        setLoadingMore(false);
      }
    }
  }, [isSuccess, isError]);

  //RELOAD
  const reload = async () => {
    await fetchData();
  };

  //First Fetch
  const fetchData = async () => {
    setNoMoreData(false);
    setFirstFetch(true);
    await getPostLikedUsers({
      postId: post,
      token: REDUXUSER.token,
      limit,
      skip: 0,
    });
  };

  //FETCH MORE DATA
  const fetchMoreData = async () => {
    if (!noMoreData) {
      await getPostLikedUsers({
        postId: post,
        token: REDUXUSER.token,
        limit,
        skip,
      });
    }
  };

  const _getMoreUsers = async () => {
    if (!noMoreData) {
      setLoadingMore(true);
      await fetchMoreData();
    }
  };

  const _onRefresh = async () => {
    setIsRefreshing(true);
    await reload();
    !isUnMounted && setIsRefreshing(false);
  };

  const renderData = ({ item }) => {
    return (
      <View style={{ marginBottom: 15 }}>
        <UserDetails
          isFollwerScreen={false}
          details={item}
          profileUri={item?.profileImage?.thumbnail?.private_id}
        />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <>
        {isLoading && firstFetch && !isRefreshing ? (
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <ActivityIndicator color={COLORS.foiti} size="large" />
          </View>
        ) : (
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            {noMoreData && <Text>No users to show.</Text>}
          </View>
        )}
      </>
    );
  };

  //RENDER FOOTER COMPONENT
  const _renderFooter = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopColor: "#CED0CE",
          }}
        >
          <ActivityIndicator animating size="large" color={COLORS.foiti} />
        </View>
      );
    } else {
      return <View></View>;
    }
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1, paddingHorizontal: 7 }}>
      <PostPlaceHeader title="Likes " />
      {!isError ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={users}
          renderItem={renderData}
          contentContainerStyle={{ paddingVertical: 15, paddingHorizontal: 8 }}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              progressViewOffset={50}
              onRefresh={_onRefresh}
              tintColor={"#f8852d"}
            />
          }
          onEndReachedThreshold={1}
          onEndReached={_getMoreUsers}
          ListFooterComponent={_renderFooter}
        />
      ) : (
        <View>
          <ServerError onPress={reload} />
        </View>
      )}
    </View>
  );
};

export default PostLikedUsers;

const styles = StyleSheet.create({});

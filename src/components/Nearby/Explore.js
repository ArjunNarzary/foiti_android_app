import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import NearByPost from "./NearByPost";
import { useGetNearbyPostMutation } from "../../Redux/services/serviceApi";
import ServerError from "../Error/ServerError";
import { COLORS } from "../../resources/theme";
import FilterBottomSheet from "./FilterBottomSheet";
const { width, height } = Dimensions.get("screen");

const Explore = ({ route }) => {
  const { initialDistance, initialSortBy } = route.params;
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXLOCATION = useSelector((state) => state.LOCATIONCOORD);
  const [skip, setSkip] = useState(0);
  const [distance, setDistance] = useState(initialDistance || 99);
  const [sortBy, setSortBy] = useState(initialSortBy || "popularity");
  const [showSortModal, setShowSortModal] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isUnMounted, setIsUnMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [blankLoading, setBlankLoading] = useState(true);

  const navigation = useNavigation();

  const [getNearbyPost, { data, isLoading, isSuccess, isError, error }] =
    useGetNearbyPostMutation();

  useEffect(() => {
    setIsUnMounted(false);
    if (REDUXLOCATION?.coords?.lat && REDUXLOCATION?.coords?.lng && !isUnMounted) {
      setBlankLoading(false);
      const body = {
        skip: 0,
        ip: REDUXIP.ip,
        token: REDUXUSER.token,
        sortBy,
        distance,
        currentCoordinate: REDUXLOCATION.coords,
      };
      getNearbyPost(body);
    }
    return () => setIsUnMounted(true);
  }, []);

  useEffect(() => {
    if (REDUXLOCATION?.coords?.lat && REDUXLOCATION?.coords?.lng && !isUnMounted) {
      setBlankLoading(false);
      const body = {
        skip: 0,
        ip: REDUXIP.ip,
        token: REDUXUSER.token,
        sortBy,
        distance,
        currentCoordinate: REDUXLOCATION.coords,
      };
      getNearbyPost(body);
    }
  }, [REDUXLOCATION]);

  useEffect(() => {
    if (!isUnMounted){
      setFirstFetch(true);
      setIsRefreshing(true);
      setNoMoreData(false);
      const body = {
        skip: 0,
        ip: REDUXIP.ip,
        token: REDUXUSER.token,
        currentCoordinate: REDUXLOCATION.coords,
        sortBy,
        distance,
      };
      getNearbyPost(body);
    }
  }, [sortBy, distance]);

  useEffect(() => {
    if (isSuccess && !isUnMounted) {
      if (firstFetch) {
        setPosts(data.posts);
      } else {
        setPosts([...posts, ...data.posts]);
      }
      setSkip(data.skip);
      setFirstFetch(false);
      setNoMoreData(data.noMorePost);
      setIsRefreshing(false);
      setLoadingMore(false);
    }

    if (isError && !isUnMounted) {
      setIsRefreshing(false);
      setLoadingMore(false);
    }
  }, [isSuccess, isError]);

  const _onRefresh = () => {
    if (isUnMounted) return;
    setFirstFetch(true);
    setIsRefreshing(true);
    setNoMoreData(false);
    const body = {
      skip: 0,
      ip: REDUXIP.ip,
      token: REDUXUSER.token,
      currentCoordinate: REDUXLOCATION.coords,
      sortBy,
      distance,
    };
    getNearbyPost(body);
  };

  const _onReset = () => {
    if (isUnMounted) return;
    setFirstFetch(true);
    setNoMoreData(false);
    const body = {
      skip: 0,
      ip: REDUXIP.ip,
      token: REDUXUSER.token,
      currentCoordinate: REDUXLOCATION.coords,
      sortBy,
      distance,
    };
    getNearbyPost(body);
  };

  const _getMorePost = () => {
    if (isUnMounted) return;
    if (noMoreData) return false;
    const body = {
      skip,
      ip: REDUXIP.ip,
      token: REDUXUSER.token,
      currentCoordinate: REDUXLOCATION.coords,
      sortBy,
      distance,
    };
    setLoadingMore(true);
    getNearbyPost(body);
  };

  const handleOpenPost = (post) => {
    navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post });
  };

  const closeSortModal = () => {
    if (isUnMounted) return;
    setShowSortModal(false);
  };


  const handleSort = (sort, distance) => {
    if (isUnMounted) return;
    setSortBy(sort);
    setDistance(distance);
    closeSortModal();
  };

  if (blankLoading) {
    return (
      <View
        style={{
          position: "absolute",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: height - 200,
          width,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }

  const FlatListHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setShowSortModal(true)}>
          <View style={styles.containerBody}>
            <Text>Sort By: </Text>
            <Text>
              {sortBy.charAt(0).toUpperCase()}
              {sortBy.split("").splice(1).join("")}
            </Text>
            <Ionicons
              name="md-arrow-down-outline"
              size={15}
              color={COLORS.foitiGrey}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSortModal(true)}>
          <View style={styles.containerBody}>
            <Text>Within </Text>
            <Text>
              {distance}KM{"  "}{" "}
            </Text>
            <Feather name="edit" size={15} color={COLORS.foitiGrey} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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

  const EmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ textAlign: "center" }}>You know what they say: <Text style={{ fontStyle:"italic" }}>Some beautiful paths can't be discovered without getting lost.</Text> So go ahead, explore the unknown.</Text>
        <Text style={{ marginTop:15, textAlign:"center", fontWeight:"bold" }}>In short, no other travellers have posted photos of places with coordinates near you.</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {isSuccess || isLoading ? (
        <>
          {isLoading && firstFetch && !isRefreshing && (
            <View
              style={{
                position: "absolute",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: height - 200,
                width,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
          )}
          <FlatList
            ListHeaderComponent={posts.length > 0 && <FlatListHeader />}
            data={posts}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 7,
              paddingHorizontal: 7
            }}
            showsVerticalScrollIndicator={false}
            renderItem={(item) => (
              <NearByPost item={item.item} onPress={handleOpenPost} />
            )}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={() => !isLoading && <EmptyComponent />}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={_onRefresh}
                tintColor={"#f8852d"}
              />
            }
            onEndReachedThreshold={0.5}
            onEndReached={_getMorePost}
            ListFooterComponent={renderFooter}
          />
          <FilterBottomSheet
            modalVisible={showSortModal}
            closeModal={closeSortModal}
            sortSelected={handleSort}
            sortByText={sortBy}
            distanceText={distance}
          />
        </>
      ) : (
        <View style={{ marginTop: -70 }}>
          <ServerError onPress={_onReset} />
        </View>
      )}
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  headerContainer: {
    width,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginLeft: -4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  containerBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyContainer:{
    marginTop: 40,
    paddingHorizontal: 25
  }
});

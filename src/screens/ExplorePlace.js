import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { addImages, addPlaceData } from "../Redux/slices/addPlaceSlice";
import { COLORS } from "../resources/theme";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { useGetPlaceQuery } from "../Redux/services/serviceApi";
import ServerError from "../components/Error/ServerError";
import { explorePlace } from "../Redux/customApis/api";
import { openPickerFunction } from "../utils/handle";
import { useBackHandler } from "@react-native-community/hooks";

const { width, height } = Dimensions.get("screen");

const FlatListHeader = ({ place }) => {
  return (
    <View style={{ backgroundColor: "#fff" }}>
      <View>
        <PostPlaceHeader title={`Explore ${place?.name}`} isProfile={false} />
      </View>
    </View>
  );
};

const FlatListFooter = ({ firstFetch, isFetchingMore, noMoreData }) => {
  if (firstFetch) return null;

  return (
    <>
      {isFetchingMore && !noMoreData && (
        <View
          style={{
            paddingHorizontal: 10,
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.foiti} />
        </View>
      )}
    </>
  );
};

const ExplorePlace = ({ route }) => {
  const { place_id } = route.params;
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const [unMounted, setUnMounted] = useState(false);
  const [place, setPlace] = useState({});
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(200);
  const [posts, setPosts] = useState([]);
  const [firstFetch, setFirstFetch] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [placesArr, setPlacesArr] = useState([]);

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

  //API
  const { data, isSuccess, isLoading, isError, error, refetch } =
    useGetPlaceQuery({
      place_id,
      token: REDUXUSER.token,
      ip: REDUXIP.ip,
    });

  useEffect(() => {
    setUnMounted(false);
    (async () => {
      if (isSuccess) {
        if (!unMounted && data != undefined) {
          setPlace(data?.place);
        }

        await refetchPosts();
      }

      if (isError) {
        if (error.status == 404 || error.status == 400) {
          navigation.navigate("PlaceNotFound");
        }
      }
    })();

    return () => {
      setUnMounted(true);
    };
  }, [isSuccess, isError]);

  //FIRST FETCH
  const refetchPosts = async () => {
    const body = {
      skip: 0,
      limit,
      placesArr: [],
      place_id,
      token: REDUXUSER.token,
      ip: REDUXIP.ip,
    };

    setFirstFetch(true);
    setNoMoreData(false);
    const res = await explorePlace(body);
    if (res.posts.length > 0) {
      if (!unMounted) {
        setPosts(res.posts);
        setSkip(res.skip);
        setPlacesArr(res.placesArr);
      }
    }
    if (!unMounted) setFirstFetch(false);
  };

  //FETCH MORE
  const fetchMorePosts = async () => {
    setIsFetchingMore(true);
    const body = {
      skip,
      limit,
      placesArr,
      place_id,
      token: REDUXUSER.token,
    };

    const res = await explorePlace(body);
    if (res.posts.length > 0) {
      if (!unMounted) {
        setPosts([...posts, ...res.posts]);
        setSkip(res.skip);
        setPlacesArr(res.placesArr);
      }
    } else {
      setNoMoreData(true);
    }
    if (!unMounted) setIsFetchingMore(false);
  };

  //ADD PHTOT FUNCTION END

  const openPost = (post) => {
    navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post });
  };

  const PostItem = React.memo(
    ({ item }) => {
      const uri = `${process.env.BACKEND_URL}/image/${item?.content[0]?.image?.thumbnail?.private_id}`;
      const formatedAddress =
        item?.place.local_address || item?.place.short_address;
      return (
        <View>
          <TouchableWithoutFeedback onPress={() => openPost(item._id)}>
            <View>
              <View style={styles.imageConatiner}>
                <Image
                  source={{
                    uri,
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.locationName}>
                <View style={{ padding: 5 }}>
                  <View style={{
                    marginLeft: 4,
                    maxWidth: 150
                     }}>
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 12 }}
                    >
                      {item?.place?.name}
                    </Text>
                    {formatedAddress != undefined && formatedAddress != "" && (
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 10,
                        }}
                      >
                        {formatedAddress}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    },
    (prev, next) => {
      if (prev?.item?._id === next?.item?._id) {
        return true;
      }
      return false;
    }
  );

  //Render empty component
  const renderEmptyList = () => {
    return (
      <>
        {firstFetch ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 50,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.foiti} />
          </View>
        ) : (
          <View></View>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }

  const reload = () => {
    refetch();
    // refetchPosts();
  };
  const _refresh = async () => {
    setIsRefreshing(true);
    refetch();
    await refetchPosts();
    if (!unMounted) setIsRefreshing(false);
  };

  return (
    <>
      {isSuccess ? (
        <View style={styles.container}>
          <View>
            <FlatList
              contentContainerStyle={{ paddingHorizontal: 7 }}
              ListHeaderComponent={<FlatListHeader place={place} />}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 7,
              }}
              numColumns={2}
              data={posts}
              renderItem={(item) => <PostItem item={item.item} />}
              keyExtractor={(item) => item._id}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={_refresh}
                  tintColor={"#f8852d"}
                />
              }
              onEndReachedThreshold={1}
              onEndReached={fetchMorePosts}
              ListEmptyComponent={renderEmptyList}
              ListFooterComponent={
                <FlatListFooter
                  posts={posts}
                  firstFetch={firstFetch}
                  isFetchingMore={isFetchingMore}
                  noMoreData={noMoreData}
                />
              }
            />
          </View>
        </View>
      ) : (
        <ServerError onPress={reload} />
      )}
    </>
  );
};

export default ExplorePlace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  directionContainer: {
    width: 125,
    borderBottomColor: "#000",
    borderWidth: 1,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginVertical: 12,
  },
  imageConatiner:{
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: COLORS.foitiGreyLighter
  },
  image: {
    width: (width - 21) / 2,
    height: (width - 21) / 2,
    resizeMode: "cover",
    borderRadius: 12,
    backgroundColor: COLORS.foitiGreyLighter
  },
  FooterButton: {
    flexDirection: "row",
    borderColor: COLORS.foitiGrey,
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    paddingVertical: 6,
    marginTop: 15,
  },
  type: {
    marginTop: 5,
    lineHeight: 13.5,
    fontWeight: "bold",
    fontSize: 13,
    color: COLORS.foitiGrey,
  },

  locationName: {
    width: "100%",
    backgroundColor: COLORS.foitiGreyLighter,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    position: "relative",
    height: 40,
    justifyContent: "center"
  },
});

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGetPopularPlacesMutation } from "../Redux/services/serviceApi";
import ServerError from "../components/Error/ServerError";
import { COLORS } from "../resources/theme";
import { useSelector } from "react-redux";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");
const PopularPlaces = ({ route }) => {
  const navigation = useNavigation();
  const { place } = route.params;
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(20);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  //GET POPULAR PLACES
  const [getPopularPlaces, { data, isLoading, isSuccess, isError }] =
    useGetPopularPlacesMutation();

  useEffect(() => {
    setIsUnmounted(false);
    firstFetchData();

    return () => {
      setIsUnmounted(true);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && !isUnmounted) {
      if (firstFetch) {
        setPopularPlaces(data.popular_places);
        setFirstFetch(false);
      } else {
        setPopularPlaces([...popularPlaces, ...data.popular_places]);
      }

      if (data.popular_places.length < limit) {
        setNoMoreData(true);
      }
      setSkip(data.skip);
      setIsRefreshing(false);
      setLoadingMore(false);
    }

    if (isError && !isUnmounted) {
      setPopularPlaces([]);
      setSkip(0);
      setFirstFetch(true);
      setNoMoreData(false);
      setIsRefreshing(false);
      setLoadingMore(false);
    }
  }, [isSuccess, isError]);

  const firstFetchData = () => {
    setFirstFetch(true);
    getPopularPlaces({
      token: REDUXUSER.token,
      place_id: place._id,
      skip: 0,
      limit,
    });
  };

  const fetchMorePlaces = () => {
    if (!noMoreData) {
      setLoadingMore(true);
      getPopularPlaces({
        token: REDUXUSER.token,
        place_id: place._id,
        skip,
        limit,
      });
    }
  };

  const reload = () => {
    firstFetchData();
  };
  const _refresh = async () => {
    setIsRefreshing(true);
    firstFetchData();
  };

  //HANDLE PUPLAR PLACE PRESS
  const handlePopularPlacePress = (item) => {
    if (
      (item?.types?.length > 1 &&
        (item?.types[1] == "Country" ||
          item?.types[1] == "State" ||
          item?.types[1] == "Union Territory")) ||
      item?.destination
    ) {
      navigation.push(`PlaceHome via ${REDUXNAVIGATION.name}`, { place_id: item._id });
    } else {
      navigation.push(`Place via ${REDUXNAVIGATION.name}`, { place_id: item._id });
    }
  };

  const PostItem = React.memo(
    ({ item }) => {
      return (
        <View>
          <TouchableWithoutFeedback
            onPress={() => handlePopularPlacePress(item)}
          >
            <View>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: `${process.env.BACKEND_URL}/image/${item?.cover_photo?.thumbnail?.private_id}`,
                  }}
                  style={styles.image}
                />
              </View>
              <View
                style={styles.locationName}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: "bold",
                    width: width / 2 - 24,
                    fontSize: 13,
                  }}
                >
                  {item.name}
                </Text>
                <Text numberOfLines={1} style={{ fontSize: 11, lineHeight: 15, width: width / 2 - 24 }}>
                  {item.types[1]}
                </Text>
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

  //REBDER HEADER COMPONENT
  const FlatListHeader = ({ place }) => {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <View>
          <PostPlaceHeader title={`Attractions in ${place.name}`} isProfile={false} />
        </View>
      </View>
    );
  };

  //RENDER FOOTER COMPONENT
  const FlatListFooter = ({ loadingMore }) => {
    if (loadingMore) {
      return (
        <View
          style={{
            paddingVertical: 20,
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
          }}
        >
          <Text style={{ textAlign: "center" }}>No more places</Text>
        </View>
      );
    }
  };

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
              backgroundColor:"#fff"
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

  if (isLoading && !loadingMore) {
    return (
      <View
        style={{
          flex: 1,
          height,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff"
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }

  return (
    <>
      {!isError ? (
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
              data={popularPlaces}
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
              onEndReached={fetchMorePlaces}
              ListEmptyComponent={renderEmptyList}
              ListFooterComponent={
                <FlatListFooter
                  firstFetch={firstFetch}
                  loadingMore={loadingMore}
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

export default PopularPlaces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer:{
    backgroundColor: COLORS.foitiGreyLighter, 
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: (width - 21) / 2,
    height: (width - 21) / 2,
    resizeMode: "cover",
    borderRadius: 12,
    zIndex: 20,
  },
  locationName :{
    paddingHorizontal: 5,
    paddingVertical: 4,
    width: "100%",
    backgroundColor: COLORS.foitiGreyLighter,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  }
});

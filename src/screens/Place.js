import {
  FlatList,
  Image,
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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { addImages, addPlaceData } from "../Redux/slices/addPlaceSlice";
import { COLORS, FOITI_CONTS } from "../resources/theme";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import MapContainer from "../components/Place/MapContainer";
import NameComponent from "../components/Place/NameComponent";
// import RatingReview from "../components/Place/RatingReview";
import { useDirectionClickedOnPlaceMutation, useGetPlaceQuery } from "../Redux/services/serviceApi";
import ServerError from "../components/Error/ServerError";
import { getPlacePosts } from "../Redux/customApis/api";
import { openPickerFunction } from "../utils/handle";
import * as Linking from "expo-linking";
import { useBackHandler } from "@react-native-community/hooks";
import CoverImage from "../components/Place/CoverImage";

const { width, height } = Dimensions.get("screen");

const FlatListHeader = ({ place, rating, totalRating, type, navigationPressed }) => {
  const [showCover, setShowCover] = useState(false);

  useEffect(() => {
    if (
      place?.destination ||
      (place?.types?.length > 1 &&
        (place?.types[1] == "state" ||
          place?.types[1] == "country" ||
          place?.types[1] == "union_territory"))
    ) {
      setShowCover(true);
    } else {
      setShowCover(false);
    }
  }, [place]);

  const sharePlace = async () => {
    const content = {
      title: `Check "${place?.name}" on Foiti`,
      message: `Check "${place?.name}" on Foiti https://foiti.com/place/${place?._id}`,
      url: `https://foiti.com/place/${place?._id}`,
    };
    const options = {
      dialogTitle: `Check "${place?.name}" on Foiti`,
      subject: `Check "${place?.name}" on Foiti`,
    };
    try {
      const result = await Share.share(content, options);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // alert(error.message);
    }
  };

  const openNavigation = () => {
    navigationPressed();
    const nameUrlEncode = place.name.split(" ").join("+");
    const browser_url =
      // "https://www.google.com/maps/dir/?api=1&destination=" +
      "https://maps.google.com/maps?q=" +
      place?.coordinates?.lat +
      "," +
      place?.coordinates?.lng +
      "(" +
      nameUrlEncode +
      ")";
    // "&dir_action=driving";
    Linking.openURL(browser_url);
  };

  const formatedAddress = place?.local_address || place?.short_address;
  return (
    <View style={{ backgroundColor: "#fff" }}>
      <PostPlaceHeader title={place?.name} isProfile={false} />
      <View style={{ marginLeft: -7 }}>
        {showCover ? (
          <CoverImage place={place} />
        ) : (
          <>
            {place?.coordinates && <MapContainer coors={place?.coordinates} />}
          </>
        )}
      </View>
      <View style={styles.containContainer}>
        <NameComponent
          name={place?.name}
          type={type}
          sharePlace={sharePlace}
          openNavigation={openNavigation}
        />
        {/* <RatingReview rating={rating} totalRating={totalRating} /> */}
        {formatedAddress != undefined && formatedAddress != "" && (
          <View>
            <Text numberOfLines={1}>{formatedAddress}</Text>
          </View>
        )}
        {type != null && <Text style={styles.type}>{type}</Text>}
      </View>
    </View>
  );
};

const FlatListFooter = ({
  addPhoto,
  firstFetch,
  isFetchingMore,
  posts,
  noMoreData,
}) => {
  if (firstFetch) return null;

  return (
    <>
      {isFetchingMore && !noMoreData ? (
        <View style={{ paddingHorizontal: 6, alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.foiti} />
        </View>
      ) : (
        <View
          style={{
            paddingVertical: 50,
            paddingHorizontal: width / 6,
            justifyContent: "center",
          }}
        >
          {posts.length == 0 ? (
            <Text style={{ textAlign: "center" }}>No posts found</Text>
          ) : (
            <View style={styles.postEndMessageConatiner}>
              <Text style={{ textAlign: "center" }}>
                That's all the post available
              </Text>
            </View>
          )}
          {/* <View
            style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
          >
            <TouchableOpacity style={styles.FooterButton} onPress={addPhoto}>
              <Ionicons
                name="add-circle-outline"
                style={{ fontSize: 18, marginRight: 5 }}
              />
              <Text>Add A Photo</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      )}
    </>
  );
};

const Place = ({ route }) => {
  const { place_id } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const [rating, setRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [unMounted, setUnMounted] = useState(false);
  const [place, setPlace] = useState({});
  const [type, setType] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(200);
  const [posts, setPosts] = useState([]);
  const [firstFetch, setFirstFetch] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [placesArr, setPlacesArr] = useState([]);

  const [directionClickedOnPlace, {  }] = useDirectionClickedOnPlaceMutation();

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
          if(data?.place?.types[1] == "country" ||
            data?.place?.types[1] == "state" ||
            data?.place?.types[1] == "union_territory" ||
            data?.place?.destination){
            navigation.replace(`PlaceHome via ${REDUXNAVIGATION.name}`, { place_id: data?.place?._id });
            }
          setPlace(data?.place);
          setTotalRating(data?.place?.review_id?.length);
          setRating(data?.avgRating);
          if (data?.place?.types?.length > 1) {
            const typeArray = data?.place?.types[1].split("_");
            const capitalizedArray = typeArray.map((item) => {
              return item.charAt(0).toUpperCase() + item.slice(1);
            });
            const typeString = capitalizedArray.join(" ");
            if (
              data?.place?.address?.country &&
              (data?.place?.types[1] == "union_territory" ||
                data?.place?.types[1] == "state")
            ) {
              const formattedType =
                typeString +
                " of " +
                data?.place?.address?.country.charAt(0).toUpperCase() +
                data?.place?.address?.country.slice(1);
              setType(formattedType);
            } else {
              setType(typeString);
            }
          } else {
            setType(null);
          }
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
    };

    setFirstFetch(true);
    setNoMoreData(false);
    const res = await getPlacePosts(body);
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

    const res = await getPlacePosts(body);
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

  //Image cropper selection
  const addPhoto = async () => {
    const imageData = await openPickerFunction();
    if (!imageData?.status) return;
    dispatch(
      addImages({
        images: imageData.image,
      })
    );

    const address = {
      name: place?.name,
      place_id: place?.google_place_id,
      address: place?.address,
      coordinates: place?.coordinates,
      types: place?.types,
    };
    dispatch(addPlaceData({ ...address }));

    navigation.navigate("New Post");
  };
  //ADD PHTOT FUNCTION END


  const openPost = (post) => {
    navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post });
  };

  //Add location clicked count on direction clicked
  const navigationPressed = () => {
    directionClickedOnPlace({
      placeId: place._id,
      token: REDUXUSER.token,
    });
  }

  const PostItem = React.memo(
    ({ item }) => {
      const uri = `${process.env.BACKEND_URL}/image/${item?.content[0]?.image?.thumbnail?.private_id}`;
      return (
        <View>
          <TouchableWithoutFeedback onPress={() => openPost(item._id)}>
            <View>
              <Image
                source={{
                  uri,
                }}
                style={styles.image}
              />
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
              ListHeaderComponent={
                <FlatListHeader
                  place={place}
                  rating={rating}
                  type={type}
                  totalRating={totalRating}
                  // openMap={openMap}
                  navigationPressed={navigationPressed}
                />
              }
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
                  addPhoto={addPhoto}
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

export default Place;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: FOITI_CONTS.padding + 7,
    backgroundColor: "#fff",
    zIndex: 20,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width,
    marginLeft: -7,
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
  image: {
    width: (width - 21) / 2,
    height: (width - 21) / 2,
    resizeMode: "cover",
    borderRadius: 12,
  },
  FooterButton: {
    flexDirection: "row",
    borderColor: COLORS.foitiGrey,
    borderWidth: 1,
    borderRadius: 25,
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
  postEndMessageConatiner:{
    paddingHorizontal:20,
    paddingVertical:5,
    borderBottomColor: COLORS.foitiGreyLight,
    borderBottomWidth: 1
  }
})

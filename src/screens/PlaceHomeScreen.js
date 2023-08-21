import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Share,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import * as Linking from "expo-linking";
import { useBackHandler } from "@react-native-community/hooks";
import { COLORS, FOITI_CONTS } from "../resources/theme";

import ServerError from "../components/Error/ServerError";
import CoverImage from "../components/Place/CoverImage";
import MapContainer from "../components/Place/MapContainer";
import NameComponent from "../components/Place/NameComponent";
import {
  useDirectionClickedOnPlaceMutation,
  useGetPlaceDestinationsMutation,
  useGetPlaceQuery,
  useGetPopularPlacesMutation,
} from "../Redux/services/serviceApi";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import DestinationContainer from "../components/Place/DestinationContainer";
import PopularPlacesContainer from "../components/Place/PopularPlacesContainer";
import { explorePlace, getPlacePosts } from "../Redux/customApis/api";
import ExploreContainer from "../components/Place/ExploreContainer";
import PlaceHomeContributors from "../components/topContributors/PlaceHomeContributors";

const { width, height } = Dimensions.get("screen");

const PlaceHomeScreen = ({ route }) => {
  const { place_id } = route.params;
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const [showCover, setShowCover] = useState(false);
  const [rating, setRating] = useState(0);
  const [totalRating, setTotalRating] = useState(0);
  const [unMounted, setUnMounted] = useState(false);
  const [place, setPlace] = useState({});
  const [type, setType] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [explorePosts, setExplorePosts] = useState([]);
  const [isFecthingPosts, setIsFecthingPosts] = useState(false);

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

  const [directionClickedOnPlace, {  }] = useDirectionClickedOnPlaceMutation();

  useEffect(() => {
    setUnMounted(false);
    (async () => {
      if (isSuccess) {
        if (!unMounted && data != undefined) {
          //REDIRECT TO PLACE SCREEN
          if (
            data?.place?.types.length <= 1 ||
            (data?.place?.types[1] != "country" &&
              data?.place?.types[1] != "state" &&
              data?.place?.types[1] != "union_territory" &&
              !data?.place?.destination)
          ) {
            navigation.replace(`Place via ${REDUXNAVIGATION.name}`, { place_id });
          }

          if (data?.place?.show_destinations) {
            getPlaceDestinations({ place_id, token: REDUXUSER.token });
          } else {
            getPopularPlaces({
              place_id,
              token: REDUXUSER.token,
              skip: 0,
              limit: 6,
            });
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

            //SHOW HIDE COVER PHOTO
            if (
              data?.place?.destination ||
              (data?.place?.types?.length > 1 &&
                (data?.place?.types[1] == "state" ||
                  data?.place?.types[1] == "country" ||
                  data?.place?.types[1] == "union_territory"))
            ) {
              setShowCover(true);
            } else {
              setShowCover(false);
            }
          } else {
            setType(null);
          }
        }
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

  //GET DESTINATIONS
  const [
    getPlaceDestinations,
    {
      data: destinationsData,
      isSuccess: destinationsIsSuccess,
      isLoading: destinationsIsLoading,
      isError: destinationsIsError,
      error: destinationsError,
    },
  ] = useGetPlaceDestinationsMutation();

  useEffect(() => {
    if (destinationsIsSuccess && !unMounted) {
      setDestinations(destinationsData?.destinations);
      getPopularPlaces({ place_id, token: REDUXUSER.token, skip: 0, limit: 6 });
    }

    if (destinationsIsError && !unMounted) {
      setDestinations([]);
      getPopularPlaces({
        place_id,
        token: REDUXUSER.token,
        skip: 0,
        limit: 6,
      });
    }
  }, [destinationsIsError, destinationsIsSuccess]);

  //GET POPULAR PLACES
  const [
    getPopularPlaces,
    {
      data: popularData,
      isLoading: popularIsLoading,
      isSuccess: popularIsSuccess,
      isError: popularIsError,
    },
  ] = useGetPopularPlacesMutation();

  useEffect(() => {
    if (popularIsSuccess && !unMounted) {
      setPopularPlaces(popularData?.popular_places);
      refetchPosts();
    }

    if (popularIsError && !unMounted) {
      setPopularPlaces([]);
    }
  }, [popularIsSuccess, popularIsError]);

  //GET POSTS
  //FIRST FETCH
  const refetchPosts = async () => {
    setIsFecthingPosts(true);
    const body = {
      skip: 0,
      limit: 200,
      showPost: 10,
      placesArr: [],
      place_id,
      ip: REDUXIP.ip,
      token: REDUXUSER.token,
    };

    const res = await explorePlace(body);
    if (res?.posts?.length > 0) {
      if (!unMounted) {
        setExplorePosts(res.posts);
        setIsFecthingPosts(false);
      }
    } else {
      if (!unMounted) setIsFecthingPosts(false);
    }
  };

  const reload = () => {
    refetch();
  };

  const formatedAddress = place?.local_address || place?.short_address;

  const sharePlace = async () => {
    const content = {
      title: `Check "${place?.name}" on Foiti`,
      message: `Check "${place?.name}" on Foiti https://foiti.com/place-home/${place?._id}`,
      url: `https://foiti.com/place-home/${place?._id}`,
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
      alert(error.message);
    }
  };

  const openNavigation = () => {
    const nameUrlEncode = place.name.split(" ").join("+");
    //Add location clicked count
    directionClickedOnPlace({
      placeId: place._id,
      token: REDUXUSER.token,
    });
    
    const browser_url =
      "https://maps.google.com/maps?q=" +
      place?.coordinates?.lat +
      "," +
      place?.coordinates?.lng +
      "(" +
      nameUrlEncode +
      ")";
    Linking.openURL(browser_url);
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

  return (
    <>
      {isSuccess ? (
        <ScrollView style={{ backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
          <View>
            <View style={{ paddingHorizontal: 7 }}>
              <PostPlaceHeader title={place?.name} isProfile={false} />
            </View>
            {showCover ? (
              <CoverImage place={place} />
            ) : (
              <>
                {place?.coordinates && (
                  <MapContainer coors={place?.coordinates} />
                )}
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
          {/* DESTINATIONS CONTAINER */}
          {place.show_destinations && destinations.length > 0 && (
            <DestinationContainer
              destinations={destinations}
              name={place?.name}
            />
          )}
          {/* POPULAR PLACES CONTAINER */}
          {popularPlaces.length > 0 && (
            <PopularPlacesContainer
              popularPlaces={popularPlaces}
              place={place}
            />
          )}
      
          {/* Top contributor of current place */}
          {place && place?.types && place?.types.length > 0 && 
          <PlaceHomeContributors 
              isUnmounted={unMounted} 
              placeName={place?.name} 
              place={place}
              type={place.types[1]} 
              destination={place?.destination}
          />}

          {popularPlaces.length > 0 && explorePosts.length > 0 && (
            <View style={styles.horLine} />
          )}
          
          {/* POSTS */}
          {explorePosts.length > 0 && (
            <ExploreContainer explorePosts={explorePosts} place={place} />
          )}
          {(destinationsIsLoading || popularIsLoading || isFecthingPosts) && (
            <View
              style={{
                width,
                height: 150,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
          )}
        </ScrollView>
      ) : (
        <ServerError onPress={reload} />
      )}
    </>
  );
};

export default PlaceHomeScreen;

const styles = StyleSheet.create({
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
  },
  type: {
    marginTop: 5,
    lineHeight: 13.5,
    fontWeight: "bold",
    fontSize: 13,
    color: COLORS.foitiGrey,
  },
  horLine:{
    height: 10,
    backgroundColor:COLORS.foitiGreyLighter,
    width
  },
});

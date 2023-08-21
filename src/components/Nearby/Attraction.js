import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import EmptyComponent from "./EmptyComponent";
import { useGetAttractionsMutation } from "../../Redux/services/serviceApi";
import { useEffect } from "react";
import ServerError from "../Error/ServerError";
import { COLORS } from "../../resources/theme";
import NearByPlace from "./NearbyPlace";
import { addCoords } from "../../Redux/slices/locationSlice";
const { width, height } = Dimensions.get("screen");

const Attraction = () => {
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXLOCATION = useSelector((state) => state.LOCATIONCOORD);
  const [skip, setSkip] = useState(0);
  const [noMoreData, setNoMoreData] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [places, setPlaces] = useState([]);
  const [isUnMounted, setIsUnMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [blankLoading, setBlankLoading] = useState(true);

  const navigation = useNavigation();

  const [getAttractions, { data, isLoading, isSuccess, isError, error }] =
    useGetAttractionsMutation();

  useEffect(() => {
    (async () => {
      if (REDUXLOCATION?.coords?.lat && REDUXLOCATION?.coords?.lng && !isUnMounted) {
        setBlankLoading(false);
        const body = {
          skip: 0,
          token: REDUXUSER.token,
          currentCoordinate: REDUXLOCATION.coords,
        };
        getAttractions(body);
      } else {
        let location = await Location.getCurrentPositionAsync({});
        if (location?.coords?.latitude) {
          const data = {
            lat: location?.coords?.latitude,
            lng: location?.coords?.longitude,
          };

          dispatch(addCoords({ coords: data }));
        } else {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: "Home Navigation" }],
            });
          }
        }
      }
    })();
    return () => setIsUnMounted(true);
  }, []);

  useEffect(() => {
    if (REDUXLOCATION?.coords?.lat && REDUXLOCATION?.coords?.lng && !isUnMounted) {
      setBlankLoading(false);
      const body = {
        skip: 0,
        token: REDUXUSER.token,
        currentCoordinate: REDUXLOCATION.coords,
      };
      getAttractions(body);
    }
  }, [REDUXLOCATION]);

  useEffect(() => {
    if (isSuccess && !isUnMounted) {
      if (firstFetch) {
        setPlaces(data.attractions);
      } else {
        setPlaces([...places, ...data.attractions]);
      }
      setSkip(data.skip);
      setNoMoreData(data.noMorePost);
      setFirstFetch(false);
      setIsRefreshing(false);
      setLoadingMore(false);
    }

    if (isError && !isUnMounted) {
      setIsRefreshing(false);
      setLoadingMore(false);
    }
  }, [isSuccess, isError]);


  const onPressPlace = (item) => {
    if (isUnMounted) return;
    const placeId = item.original_place_id || item._id;
    if (
      (item?.types?.length > 1 &&
        (item?.types[1] == "country" ||
          item?.types[1] == "state" ||
          item?.types[1] == "union_territory")) ||
      item?.destination
    ) {
      navigation.push(`PlaceHome via ${REDUXNAVIGATION.name}`, { place_id: placeId });
    } else {
      navigation.push(`Place via ${REDUXNAVIGATION.name}`, { place_id: placeId });
    }
  };

  const _onRefresh = () => {
    if (isUnMounted) return;
    const body = {
      skip: 0,
      token: REDUXUSER.token,
      currentCoordinate: REDUXLOCATION.coords,
    };
    setIsRefreshing(true);
    setFirstFetch(true);
    setNoMoreData(false);
    getAttractions(body);
  };

  const _getMorePlaces = () => {
    if (isUnMounted) return;
    if (noMoreData || isLoading || loadingMore) return false;

    const body = {
      skip,
      token: REDUXUSER.token,
      currentCoordinate: REDUXLOCATION.coords,
    };

    setLoadingMore(true);
    getAttractions(body);
  };

  const _onReset = () => {
    if (isUnMounted) return;
    const body = {
      skip: 0,
      token: REDUXUSER.token,
      currentCoordinate: REDUXLOCATION.coords,
    };
    setFirstFetch(true);
    setNoMoreData(false);
    getAttractions(body);
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
            data={places}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 7,
              paddingHorizontal: 7
            }}
            showsVerticalScrollIndicator={false}
            renderItem={(item) => (
              <NearByPlace item={item.item} onPressPlace={onPressPlace} />
            )}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={() => !isLoading && <EmptyComponent text="attraction" />}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={_onRefresh}
                tintColor={"#f8852d"}
              />
            }
            onEndReachedThreshold={0.5}
            onEndReached={_getMorePlaces}
            ListFooterComponent={renderFooter}
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

export default Attraction;

const styles = StyleSheet.create({});

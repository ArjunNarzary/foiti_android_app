import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  View,
  RefreshControl,
  Text
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
import { SingleChat } from '../components/chat'
import { COLORS, FOITI_CONTS } from "../resources/theme";
import ServerError from "../components/Error/ServerError";
import { useGetAllChatsMutation } from "../Redux/services/serviceApi";
const { width, height } = Dimensions.get("screen");


const Chat = () => {
  const navigation = useNavigation();
  const REDUXDATA = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

  const [chats, setChats] = useState([]);
  const [skip, setSkip] = useState(0);
  const [isUnMounted, setIsUnmounted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [firstFetchChats, setFirstFetchChats] = useState(true);
  const [getAllChats, { data, isLoading, isError, isSuccess, error }] = useGetAllChatsMutation()

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
    setChats([]);
    setFirstFetchChats(true);
    setLoadingMore(false);
    setNoMoreData(false);
    getAllChats({ skip: 0, token: REDUXDATA.token });
  }

  useEffect(() => {
    setIsUnmounted(false);
    firstFetch();
    return() => setIsUnmounted(true);
  },[]);

  useEffect(() => {
    if(isSuccess && !isUnMounted){
      if (firstFetchChats){
        setChats(data.chats);
      }else{
        setChats([...chats, ...data.chats]);
      }
      setLoadingMore(false);
      setFirstFetchChats(false);
      setSkip(data.skip);
      setNoMoreData(data.noMoreData);
      setIsRefreshing(false);
    }
  },[isSuccess]);

  const _onRefresh = () => {
    setIsRefreshing(true);
    firstFetch();
  }

  const _getMoreChats = async() =>{
    if(noMoreData) return;
    setLoadingMore(true);
    getAllChats({ skip, token: REDUXDATA.token });
  }

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

  if (isLoading && firstFetchChats) {
    return (
      <View
        style={{
          width,
          height: height - 120,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: '#fff'
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }

  const _renderEmpytComponent = () => {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff", justifyContent:"center", alignItems:"center", paddingHorizontal:30, height: height - 280 }}>
          <Text style={{ textAlign:"center" }}>You have no message from other travellers. Sometimes, it's better to be the first one to send.</Text>
        </View>
      )
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {
          isError ? 
            <ServerError onPress={firstFetch} />
          : 
          (
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle = {{ 
                paddingHorizontal: 7
                }}
              data={chats}
                  renderItem={({ item }) => <View style={{ paddingHorizontal: FOITI_CONTS.padding }}>
                <SingleChat item={item} logeduser={REDUXDATA} />
              </View>}
              keyExtractor={item => item._id}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={_onRefresh}
                  tintColor={"#f8852d"}
                />
              }
              onEndReachedThreshold={0.5}
              onEndReached={_getMoreChats}
              ListEmptyComponent={_renderEmpytComponent}
              ListFooterComponent={renderFooter}
            />
          </View>
          )
        }
      </View>
    </>
  );
};

export default Chat;

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "resources";
const height = Dimensions.get("window").height - 67;
const width = Dimensions.get("window").width;
import axios from "axios";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import UserBottomSheet from "../components/UserBottomSheet";
import io from 'socket.io-client';
import { FOITI_CONTS } from "../resources/theme";
import { TouchableOpacity } from "react-native";
import Message from "../components/chat/Message";
import { GET_ALL_MEETUP_MESSAGES } from "../Redux/customApis/api";
import ServerError from "../components/Error/ServerError";
import CustomAlert from "../components/CustomAlert";
import { clearAlert } from "../Redux/slices/alertSlice";
import { useNavigation } from "@react-navigation/native";
import { useGetReceiverUserQuery, useMeetupRequestResponseMutation } from "../Redux/services/serviceApi";
import UserProfile from "../components/meetup/UserProfile";
import { useBackHandler } from "@react-native-community/hooks";
const ENDPOINT = process.env.BACKEND_URL_FOR_SOCKET;
var socket;

const MeetupChatBox = ({ route }) => {
  let { chatId, request_receiver } = route.params;
  // const socket = io(ENDPOINT);
  const inputRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXALERT = useSelector((state) => state.REDUXALERT);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [recipientUserGetBlocked, setRecipientUserGetBlocked] = useState(false);

  const [messages, setMessages] = useState("");
  const [hasRequestData, setHasRequestData] = useState(request_receiver)
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [recipientUser, setRecipientUser] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [rerenderFlatlist, setRerenderFlatlist] = useState(false);
  const [isUnMounted, setIsUnmounted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [meetupResponseText, setMeetupResponseText] = useState("");

  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
    isSuccess: userIsSuccess,
    refetch: userRefetch,
    error: userError
  } = useGetReceiverUserQuery({ token: REDUXUSER?.token, chatId },
    {
      refetchOnMountOrArgChange: true,
    });

  const [meetupRequestResponse, { data:meetupData, isLoading: meetupIsLoading, isSuccess: meetupIsSuccess, isError: meetupIsError, error: meetupError }] = useMeetupRequestResponseMutation()

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

  useEffect(() => {
    if (userIsSuccess && !isUnMounted) {
      setRecipientUser(userData?.user);
      if (Array.isArray(userData?.myBlockedUser) && userData?.myBlockedUser.length > 0) {
        let isBlocked = userData?.myBlockedUser.filter((item) => item === userData?.user?._id);
        if (isBlocked.length > 0) {
          setRecipientUserGetBlocked(true);
        } else {
          setRecipientUserGetBlocked(false);
        }
      }
    }
  }, [userIsSuccess]);

  const firstFetchMessages = async () => {
    setMessages([]);
    setError(false);
    setLoadingMore(false);
    setIsLoading(true);
    setNoMoreData(false);

    const { data, status, error } = await GET_ALL_MEETUP_MESSAGES({ skip: 0, token: REDUXUSER?.token, chatId });
    if (isUnMounted) return;
    if (error || status !== 200) {
      setIsLoading(false);
      setError(true);
    } else {
      setError(false);
      setMessages(data.messages);
      setNoMoreData(data.noMoreData);
      setIsLoading(false);
      setIsRefreshing(false);
      socket.emit("join chat", chatId);
    }
  }

  //socket code
  useEffect(() => {
    setIsUnmounted(false);
    socket = io(ENDPOINT);
    socket.emit('setup', REDUXUSER);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.off();
      setIsUnmounted(true);
    }
  }, [])

  useEffect(() => {
    socket.on('chatMeetupMessageRecieved', (newMessageRecieved) => {
      if (!isUnMounted && newMessageRecieved?.chat?._id.toString() === chatId.toString()) {
        setMessages([newMessageRecieved, ...messages]);
      }
    })
  })
  // end of socket io

  //SHOW ALERT
  useEffect(() => {
    if (!isUnMounted && REDUXALERT.type == "user") {
      setIsVisible(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        dispatch(clearAlert());
      }, 2000);
    }
  }, [REDUXALERT]);

  //SHOW BOTTOMSHEET
  const showBottomSheet = () => {
    setIsVisible(true);
  };

  useEffect(() => {
    firstFetchMessages();
    updateMessageStatus();
  }, []);

  const updateMessageStatus = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.patch(
        `${process.env.BACKEND_URL}/meetup-message/updatestatus/${chatId}`, {},
        {
          headers: { token: REDUXUSER?.token },
        }
      );

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage) {
      return false;
    }
    setNewMessage("");
    try {
      const { data } = await axios.post(
        `${process.env.BACKEND_URL}/meetup-message/`,
        { chatId: chatId, content: newMessage },
        {
          headers: { token: REDUXUSER?.token },
        }
      );
      setMessages([data, ...messages]);
      inputRef.current.blur();
      setRerenderFlatlist((prev) => !prev);

      socket.emit('new meetup message', data)
    } catch (error) {
      console.log(error.response);
    }
  };

  const _getMoreMessages = async () => {
    if (noMoreData) return;
    setLoadingMore(true);
    const skip = messages.length;
    const { data, status, error } = await GET_ALL_MEETUP_MESSAGES({ skip, token: REDUXUSER?.token, chatId });
    if (isUnMounted) return;
    if (error || status !== 200) {
      setLoadingMore(false);
      setError(true);
    } else {
      setMessages([...messages, ...data.messages]);
      setNoMoreData(data.noMoreData);
      setLoadingMore(false);
    }
  }

  const _onRefresh = () => {
    setIsRefreshing(true);
    firstFetchMessages();
  }

  const showProfile = () => {
    navigation.push(`Others profile via ${REDUXNAVIGATION.name}`, { userId: recipientUser?._id });
  }

  const meetResponse = (response) => {
    const body = {
      meetupResponse: response,
      sender: recipientUser?._id,
      token: REDUXUSER.token
    }
    setMeetupResponseText(response);
    meetupRequestResponse(body);
  }
  const resendResponse = () =>{
    const body = {
      meetupResponse: meetupResponseText,
      sender: recipientUser?._id,
      token: REDUXUSER.token
    }
    meetupRequestResponse(body);
  }
  useEffect(() => {
    (async() => {
        if (meetupIsSuccess){
          setHasRequestData(null);
          let message =""
          if (meetupResponseText === 'accept'){
            message = "Meetup request accepted";
          }else{
            message = "Meetup request cancelled";
          }
    
          try {
            const { data } = await axios.post(
              `${process.env.BACKEND_URL}/meetup-message/`,
              { chatId: chatId, content: message },
              {
                headers: { token: REDUXUSER?.token },
              }
            );
            setMessages([data, ...messages]);
            inputRef.current.blur();
            setRerenderFlatlist((prev) => !prev);
    
            socket.emit('new meetup message', data)
          } catch (error) {
            console.log(error.response);
          }
        }
    })()
  },[meetupIsSuccess])

  //RENDER HEADER IF BLOCKED
  const renderHeader = () => {
    if (recipientUserGetBlocked !== true) return null;
    return (
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20
        }}
      >
        <Text style={{ color: "#AAAAAA", fontSize: 12, textAlign: "center", marginTop: 10 }}>You have blocked this user</Text>
      </View>
    )
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
        <Text>ok</Text>
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  };

  const renderEmptyComponent = () =>{
    if (!hasRequestData) return null;
    return (
    <View style={{ marginBottom: 20, paddingHorizontal: 30, transform: [{ scaleY: -1 }] }}>
      {
        hasRequestData.toString() == REDUXUSER?.user?._id.toString() ?
          <Text style={{ color: COLORS.foitiGrey, fontSize: 13, textAlign: "center" }}>You can chat and get to know more about the traveller before accepting or cancelling the request</Text> :
          <Text style={{ color: COLORS.foitiGrey, fontSize: 13, textAlign: "center" }}>You can start by saying something about yourself, your trip or why you wish to meet up.</Text>
      }
    </View>
  )}

  if (userIsLoading) {
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
    )
  }


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal: FOITI_CONTS.padding }}>
        <PostPlaceHeader
          title="Meet Up"
          isProfile={true}
          otherProfile={true}
          showBottomSheet={showBottomSheet}
          showProfile={showProfile}
        />
      </View>
      {error || userIsError || meetupIsError ?
        <ServerError onPress={() => {
          firstFetchMessages();
          userRefetch();
          resendResponse();
        }} />
        :
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 32 })}
          style={styles.container}
        >
          {/* chat list */}
          {isLoading ? (
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
          ) : (
            <>
              <View>
                  {hasRequestData && hasRequestData.toString() == REDUXUSER?.user?._id.toString() &&
                  <View style={styles.meetupRequestContainer}>
                    <Text style={{ color: COLORS.foiti, fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 15 }}>Meet Up Request</Text>
                    <View style={styles.meetupRequestButtons}>
                      <TouchableOpacity style={styles.meetupResponse} onPress={() => meetResponse('accept')} disabled={meetupIsLoading}>
                        {
                            meetupIsLoading && meetupResponseText === 'accept' ? (
                                <ActivityIndicator size="small" color={COLORS.foiti} />
                            ):(
                              <Text style={{ color: COLORS.foitiGreyLighter }}>Accept</Text>
                            )
                        }
                      </TouchableOpacity>
                            <TouchableOpacity style={styles.meetupResponse} onPress={() => meetResponse('cancel')} disabled={meetupIsLoading}>
                              {
                                meetupIsLoading && meetupResponseText === 'cancel' ? (
                                  <ActivityIndicator size="small" color={COLORS.foiti} />
                                ) : (
                                  <Text style={{ color: COLORS.foitiGreyLighter }}>Cancel</Text>
                                )
                              }
                      </TouchableOpacity>
                    </View>
                  </View>
                }
                <View style={styles.userDetails}>
                  <UserProfile user={recipientUser} profileUri={recipientUser?.profileImage?.thumbnail?.private_id} isChat={true} />
                </View>
              </View>
              <FlatList
                contentContainerStyle={{ paddingHorizontal: FOITI_CONTS.padding + 7, paddingVertical: 5 }}
                showsVerticalScrollIndicator={false}
                data={messages}
                renderItem={(item) =>
                  <Message
                    isMeetupMessage={true}
                    hasRequest={hasRequestData}
                    lastIndex={messages.length - 1}
                    index={item.index}
                    message={item.item}
                    loggedUser={REDUXUSER?.user?._id}
                    recipientUserBlockStatus={recipientUserGetBlocked}
                  />}
                keyExtractor={(item, index) => index}
                extraData={rerenderFlatlist}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={_onRefresh}
                    tintColor={"#f8852d"}
                  />
                }
                onEndReachedThreshold={0.5}
                onEndReached={_getMoreMessages}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmptyComponent}
                inverted={true}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  multiline={true}
                  style={styles.txtInput}
                  placeholder="Message"
                  onChangeText={(val) => setNewMessage(val)}
                  value={newMessage}
                  onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={newMessage.trim().length === 0 ? true : false}>
                  <Ionicons name="ios-send-sharp" size={20} color={newMessage.trim().length === 0 ? COLORS.foitiGreyLight : COLORS.foiti} />
                </TouchableOpacity>
              </View>
              {showAlert && <CustomAlert text={REDUXALERT?.message} />}
            </>
          )}
          {/* end of chat list */}
        </KeyboardAvoidingView>
      }
      <UserBottomSheet
        user={recipientUser}
        isChat={true}
        isVisible={isVisible}
        hideBottomSheet={() => {
          setIsVisible(false);
        }}
      />
    </View>

  );
};

export default MeetupChatBox;

const styles = StyleSheet.create({
  container: {
    // height: height - 60,
    position: "relative",
    flex:1
  },
  inputContainer: {
    width,
    backgroundColor: "transparent",
    paddingHorizontal: FOITI_CONTS.padding + 5,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom: 15
  },
  txtInput: {
    maxHeight: 150,
    paddingVertical: 10,
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    backgroundColor: "#E8E8E8",
  },
  sendBtn: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },
  meetupRequestContainer: {
    backgroundColor: COLORS.foitiGreyLighter,
    paddingVertical: 15,
    paddingHorizontal: 40
  },
  meetupRequestButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center"
  },
  meetupResponse: {
    backgroundColor: COLORS.foitiGrey,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 25,
    justifyContent: "center",
    alignContent: "center"
  },
  userDetails: {
    // flexDirection:"row",
    // justifyContent:"flex-start",
    // alignItems:"center",
    padding: FOITI_CONTS.padding + 7,
    borderBottomWidth: 1,
    borderColor: COLORS.foitiGreyLight
  },
  thumbnailImage: {
    height: 82,
    width: 82,
    borderRadius: 41,
    resizeMode: "cover",
    marginRight: 10
  }
});

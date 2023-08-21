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
  RefreshControl,
  Pressable
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "resources";
const height = Dimensions.get("window").height - 67;
const width = Dimensions.get("window").width;
import axios from "axios";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { getRecieptName, getSenderProfile } from "../utils/chatHelper";
import UserBottomSheet from "../components/UserBottomSheet";
import { isEmpty } from '../utils/chatHelper'
import io from 'socket.io-client';
import { FOITI_CONTS } from "../resources/theme";
import { TouchableOpacity } from "react-native";
import Message from "../components/chat/Message";
import { GET_ALL_MESSAGES } from "../Redux/customApis/api";
import ServerError from "../components/Error/ServerError";
import CustomAlert from "../components/CustomAlert";
import { clearAlert } from "../Redux/slices/alertSlice";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
const ENDPOINT = process.env.BACKEND_URL_FOR_SOCKET;
var socket;

const ChatBox = ({ route }) => {
  const { chatId, user } = route.params;
  const inputRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXALERT = useSelector((state) => state.REDUXALERT);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [recipientUserGetBlocked, setRecipientUserGetBlocked] = useState(false);

  const [messages, setMessages] = useState("");
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

  const firstFetchMessages = async () => {
    setMessages([]);
    setError(false);
    setLoadingMore(false);
    setIsLoading(true);
    setNoMoreData(false);

    const { data, status, error } = await GET_ALL_MESSAGES({ skip: 0, token: REDUXUSER.token, chatId });
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
      setIsUnmounted(true)
    };
  }, [])

  useEffect(() => {
    socket.on('chatMessageRecieved', (newMessageRecieved) => {
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
    // getChatMessage();
    firstFetchMessages();
    updateMessageStatus();
    getBlockedUsers();
  }, []);

  const getBlockedUsers = () => {
    if (!isEmpty(user.chatUsers.length)) {
      let chatUsr = user.chatUsers.filter((item) => item._id != REDUXUSER?.user?._id)

      setRecipientUser(chatUsr[0])
      let logedChatUser = user.chatUsers.filter((item) => item._id === REDUXUSER?.user?._id)
      if (!isEmpty(logedChatUser[0]) && logedChatUser[0]?.blocked_users?.length > 0) {
        let isBlocked = logedChatUser[0]?.blocked_users.filter((item) => item === chatUsr[0]._id)
        if (isBlocked.length > 0) {
          setRecipientUserGetBlocked(true);
        } else {
          setRecipientUserGetBlocked(false);
        }
      }

    }
  }

  const updateMessageStatus = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.patch(
        `${process.env.BACKEND_URL}/message/updatestatus/${chatId}`, {},
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
        `${process.env.BACKEND_URL}/message/`,
        { chatId: chatId, content: newMessage },
        {
          headers: { token: REDUXUSER?.token },
        }
      );
      setMessages([data, ...messages]);
      inputRef.current.blur();
      setRerenderFlatlist((prev) => !prev);

      socket.emit('new message', data)
    } catch (error) {
      console.log(error.response);
    }
  };

  const _getMoreMessages = async () => {
    if (noMoreData) return;
    setLoadingMore(true);
    const skip = messages.length;
    const { data, status, error } = await GET_ALL_MESSAGES({ skip, token: REDUXUSER?.token, chatId });
    if (isUnMounted) return;
    if (error || status !== 200) {
      setLoadingMore(false);
      setError(true);
    } else {
      setMessages([...messages, ...data.messages]);
      setNoMoreData(data?.noMoreData);
      setLoadingMore(false);
    }
  }

  const _onRefresh = () => {
    setIsRefreshing(true);
    firstFetchMessages();
  }

  const showProfile = () =>{
    const userId = getSenderProfile(REDUXUSER, user?.chatUsers)?._id;
    if(userId){
      navigation.push(`Others profile via ${REDUXNAVIGATION?.name}`, { userId });
    }
  }

  //RENDER HEADER IF BLOCKED
  const renderHeader = () => {
    if (recipientUserGetBlocked !== true) return null;
    return (
      <View
        style={{
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: "#AAAAAA", fontSize: 12, textAlign:"center" }}>You have blocked this user</Text>
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
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal: FOITI_CONTS.padding }}>
        <PostPlaceHeader
          title={user.chatUsers && getRecieptName(REDUXUSER, user?.chatUsers)}
          isChat={true}
          profileImage={(user.chatUsers && 
                        getSenderProfile(REDUXUSER, user?.chatUsers) && 
                        getSenderProfile(REDUXUSER, user?.chatUsers)?.profileImage?.thumbnail?.private_id) ? 
                        getSenderProfile(REDUXUSER, user?.chatUsers)?.profileImage?.thumbnail?.private_id : 
                        "profile_picture.jpg"
                      }
          isProfile={true}
          otherProfile={true}
          showBottomSheet={showBottomSheet}
          showProfile={showProfile}
        />
      </View>
      {error ?
        <ServerError onPress={firstFetchMessages} />
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
              <FlatList
                inverted
                contentContainerStyle={{ paddingHorizontal: FOITI_CONTS.padding + 7, paddingVertical: 5 }}
                showsVerticalScrollIndicator={false}
                data={messages}
                renderItem={(item) =>
                  <Message
                    message={item.item}
                    loggedUser={REDUXUSER?.user?._id}
                    recipientUserBlockStatus={recipientUserGetBlocked}
                  />}
                keyExtractor={(item, index) => index}
                ListEmptyComponent={() => <Text></Text>}
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

export default ChatBox;

const styles = StyleSheet.create({
  container: {
    // height: height - 60,
    position: "relative",
    flex:1,
  },
  inputContainer: {
    width,
    backgroundColor: "transparent",
    paddingHorizontal: FOITI_CONTS.padding + 5,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingBottom:15
  },
  txtInput: {
    // height: 50,
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
});

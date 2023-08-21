import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import SwitchComponent from "../components/Notification/SwitchComponent";
import {
  useGetNotificationSettingsQuery,
  useSetNotificationSettingsMutation,
} from "../Redux/services/serviceApi";

const Notification = () => {
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);

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

  const { data, isLoading, isSuccess } = useGetNotificationSettingsQuery({
    token: REDUXUSER.token,
  });
  const [
    setNotifcationData,
    {
      data: notifcationData,
      isLoading: notifcationLoading,
      isSuccess: notifcationIsSuccess,
    },
  ] = useSetNotificationSettingsMutation();
  const [pushNotification, setPushNotification] = useState(false);
  const [newPost, setNewPost] = useState(false);
  const [comments, setComments] = useState(false);
  const [likes, setLikes] = useState(false);
  const [newFollowers, setNewFollowers] = useState(false);
  const [chat, setChat] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    setIsUnmounted(false);
    return () => {
      setIsUnmounted(true);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && !isUnmounted) {
      setNewPost(data.notification.new_post);
      setLikes(data.notification.post_likes);
      setNewFollowers(data.notification.new_followers);
      setChat(data.notification.chat_message);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!isUnmounted) {
      if (newPost == true || likes == true || newFollowers == true || chat == true) {
        setPushNotification(true);
      } else if (newPost == false || likes == false || newFollowers == false || chat == false) {
        setPushNotification(false);
      }
    }
  }, [newPost, likes, newFollowers, chat]);


  const handlePushNotification = async () => {
    setNotifcationData({
      notification: "notifcation",
      status: !pushNotification,
      token: REDUXUSER.token
    });
    setPushNotification((previousState) => !previousState);
    setNewPost(!pushNotification);
    setComments(!pushNotification);
    setLikes(!pushNotification);
    setNewFollowers(!pushNotification);
    setChat(!pushNotification);
  };

  const handleNewPost = () => {
    setNotifcationData({
      notification: "new_post",
      status: !newPost,
      token: REDUXUSER.token,
    });
    if (!isUnmounted) {
      setNewPost(!newPost);
    }
  };

  const handleLikes = () => {
    setNotifcationData({
      notification: "post_likes",
      status: !likes,
      token: REDUXUSER.token,
    });
    if (!isUnmounted) {
      setLikes(!likes);
    }
  };
  const handleNewFollowers = () => {
    setNotifcationData({
      notification: "new_followers",
      status: !newFollowers,
      token: REDUXUSER.token,
    });
    if (!isUnmounted) {
      setNewFollowers(!newFollowers);
    }
  };

  const handleChat = () => {
    setNotifcationData({
      notification: "chat_message",
      status: !chat,
      token: REDUXUSER.token,
    });
    if (!isUnmounted) {
      setChat(!chat);
    }
  };

  // const handleEmailNotification = () => {
  //   setNotifcationData({
  //     notification: "email_notitications",
  //     status: !emailNotification,
  //     token: REDUXUSER.token,
  //   });
  //   if (!isUnmounted) {
  //     setEmailNotification(!emailNotification);
  //   }
  // };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <PostPlaceHeader title="Notification" isProfile={false} />
      <View>
        <View>
          <SwitchComponent
            title="Push Notification"
            isBold={true}
            isEnabled={pushNotification}
            setCheck={handlePushNotification}
            disabled={notifcationLoading}
          />
        </View>
        <View>
          <SwitchComponent
            title="New Post"
            isBold={false}
            isEnabled={newPost}
            setCheck={handleNewPost}
            disabled={notifcationLoading}
          />
        </View>

        <View>
          <SwitchComponent
            title="Likes"
            isBold={false}
            isEnabled={likes}
            setCheck={handleLikes}
            disabled={notifcationLoading}
          />
        </View>
        <View>
          <SwitchComponent
            title="New Followers"
            isBold={false}
            isEnabled={newFollowers}
            setCheck={handleNewFollowers}
            disabled={notifcationLoading}
          />
        </View>
        <View>
          <SwitchComponent
            title="Chat"
            isBold={false}
            isEnabled={chat}
            setCheck={handleChat}
            disabled={notifcationLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default Notification;

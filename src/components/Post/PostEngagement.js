import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Share,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import { Dimensions } from "react-native";
import * as Linking from "expo-linking"

import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons"
import { COLORS, FOITI_CONTS } from "resources";
import {
  useDirectionClickedOnPostMutation,
  useLikeUnlikePostQuery,
  useSaveUnsavePostMutation,
} from "../../Redux/services/serviceApi";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "../ModalComponent";
import { setAlert } from "../../Redux/slices/alertSlice";

const PostEngagement = ({ post, isHome = false, showDirection=false }) => {
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [skip, setSkip] = useState(true)
  const [likePressCount, setLikePressCount] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [unmounted, setUnmounted] = useState(false)

  //RTK QUERY
  const { data, isSuccess, refetch, isLoading, isError } =
    useLikeUnlikePostQuery(
      { postId: post?._id, token: REDUXUSER?.token },
      { skip }
    )

  const [directionClickedOnPost, { }] = useDirectionClickedOnPostMutation();

  const [
    saveUnsavePost,
    {
      data: saveData,
      isSuccess: saveIsSuccess,
      refetch: saveRefetch,
      isLoading: saveIsLoading,
      isError: saveIsError,
    },
  ] = useSaveUnsavePostMutation()

  useEffect(() => {
    setUnmounted(false)

    return () => {
      setUnmounted(true)
    }
  }, [])

  useEffect(() => {
    if (!unmounted) {
      if (isError || saveIsError) {
        setModalVisible(true)
      }
    }
  }, [isError, saveIsError])

  const closeModal = () => {
    if (!unmounted) {
      setModalVisible(false)
    }
  }

  useEffect(() => {
    if (post?.like?.includes(REDUXUSER?.user?._id)) {
      setLiked(true)
    } else {
      setLiked(false)
    }

    if (post?.saved?.includes(REDUXUSER?.user?._id)) {
      setSaved(true)
    } else {
      setSaved(false)
    }
  }, [post])

  //RESET STATE ON UNMOUNT;
  useEffect(() => {
    return () => {
      setLiked(false)
      setSaved(false)
      setSkip(true)
      setLikePressCount(0)
    }
  }, [])

  const likePress = async () => {
    setLiked(!liked)
    if (likePressCount <= 5) {
      if (skip) {
        setSkip(false)
      } else {
        refetch()
      }

      setLikePressCount((prevCount) => prevCount + 1)
    }
  }

  const savePress = async () => {
  const data = {
    postId: post?._id, 
    token: REDUXUSER?.token
  }

  saveUnsavePost(data);
  }
  
  useEffect(() => {
    if(saveIsSuccess){
      setSaved(saveData.saved);
      if(saveData.saved){
        dispatch(setAlert({ type: "savePost", message: "Added to bucketlist" }))
      }
    }
  }, [saveIsSuccess, saveIsError])

  const sharePost = async () => {
    const content = {
      title: `Check this ${post?.user?.name}'s post on Foiti`,
      message: `Check this ${post?.user?.name}'s post on Foiti https://foiti.com/post/${post?._id}`,
      url: `https://foiti.com/post/${post?._id}`,
    }
    const options = {
      dialogTitle: `Check this ${post?.user?.name}'s post on Foiti`,
      subject: `Check this ${post?.user?.name}'s post on Foiti`,
    }
    try {
      const result = await Share.share(content, options)
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const openNavigation = () => {
    let firstName = post?.user.name.split(" ")[0]
    let displayName = ""
    if (firstName.length > 15) {
      const selectedName = firstName.slice(0, 15)
      displayName = `${selectedName}..'s`
    } else {
      displayName = `${firstName}'s`
    }

    directionClickedOnPost({
      postId: post?._id,
      token: REDUXUSER.token,
    });

    if(post?.content && post?.content.length > 0 && post?.content[0].location && post?.content[0].location?.coordinates && post?.content[0].location?.coordinates.length > 0){
      const browser_url =
        // "https://www.google.com/maps/dir/?api=1&destination=" +
        "https://maps.google.com/maps?q=" +
        post?.content[0]?.location?.coordinates[1] +
        "," +
        post?.content[0]?.location?.coordinates[0] +
        "(" +
        displayName +
        "+Post+Coordinates)"
      // "&dir_action=driving";
      Linking.openURL(browser_url)
    }
  }

  return (
    <View
      style={{
        // flex: 1,
        paddingVertical: FOITI_CONTS.padding,
      }}
    >
      {/* <View style={styles.iconContainer}> */}
      <View style={styles.leftIconContainer}>
        <TouchableWithoutFeedback onPress={likePress} disabled={isLoading}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            style={[
              liked ? styles.redIconColor : styles.blackIconColor,
              styles.icons,
            ]}
          />
        </TouchableWithoutFeedback>

        <TouchableOpacity onPress={savePress} disabled={saveIsLoading}>
          {saveIsLoading ? (
            <ActivityIndicator size="small" color={COLORS.foiti} />
          ) : (
            <MaterialCommunityIcons
              name={saved ? "book-marker" : "book-marker-outline"}
              style={[{ fontSize: 18 }, styles.blackIconColor]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={sharePost}>
          <Ionicons
            name="share-social-outline"
            style={[styles.icons, styles.blackIconColor]}
          />
        </TouchableOpacity>

        {showDirection && (
          <TouchableOpacity onPress={openNavigation}>
            <FontAwesome5
              name="directions"
              style={[styles.icons, styles.blackIconColor]}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* </View> */}
      <ModalComponent
        body="Opps! Something went wrong. Please try again."
        closeModal={closeModal}
        modalVisible={modalVisible}
        hasButton={true}
      />
    </View>
  )
}

export default memo(PostEngagement);

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  icons: {
    fontSize: 20,
  },
  redIconColor: {
    color: "#ef2828",
  },
  blackIconColor: {
    color: COLORS.foitiGrey,
  },
  comments_Likes: {
    color: COLORS.foitiGrey,
    fontSize: 12,
  },
});

import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetSingleReplyMutation } from '../../Redux/services/serviceApi';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FOITI_CONTS } from '../../resources/theme';
import ReadMore from '@fawazahmed/react-native-read-more';
const {width, height} = Dimensions.get("screen");

const ShowReplay = ({ comment, showMoreReply }) => {
    const navigation = useNavigation();
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
    const [firstReply, setFirstReply] = useState({});
    const [moreReplies, setMoreReplies] = useState(0);
    const [profileImage, setProfileImage] = useState("profile_picture.jpg");
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [getSingleReply, {isLoading, isSuccess, isError, data, error} ] = useGetSingleReplyMutation();

    useEffect(() => {
        setIsUnmounted(false);
        const body = {
            token: REDUXUSER.token,
            parent_id: comment._id,
            skip: 0,
            limit: 1,
            noMoreComment: false
        }

        getSingleReply(body);
        return() => setIsUnmounted(true);
    }, []);

    useEffect(() => {
        if(isSuccess && !isUnmounted){
            if(data.replies.length > 0){
                setFirstReply(data.replies[0]);
                setMoreReplies(data.moreCommentToShow);
                if (data?.replies[0]?.author?.profileImage){
                    setProfileImage(data?.replies[0]?.author?.ileImage?.thumbnail?.private_id || "profile_picture.jpg")
                }
            }
        }
    }, [isSuccess, isError]);

    //REDIRECT USER TO OWN PROFILE
    const redirectToOwnProfile = () => {
        const currentNav = REDUXNAVIGATION.name;
        dispatch(
            addNavigation({
                name: "profile",
            })
        );

        if (currentNav === "profile") {
            navigation.navigate("Profile Nav");
        } else {
            navigation.navigate("Profile");
        }
    };

    const redirectToProfile = () => {
        navigation.push(`Others profile via ${REDUXNAVIGATION.name}`, { userId: data?.replies[0]?.author?._id });
    };
    const showProfile = () => {
        if (data?.replies[0]?.author?._id?.toString() === REDUXUSER?.user?._id?.toString()) {
            redirectToOwnProfile();
        } else {
            redirectToProfile();
        }
    };



  return ( 
    <View style={styles.container}>
          <TouchableWithoutFeedback onPress={showProfile}>
              <View style={styles.alignContent}>
                  <View>
                      <Image
                          source={{
                              uri: `${process.env.BACKEND_URL}/image/${profileImage}`,
                          }}
                          style={styles.profile}
                      />
                  </View>
                  <View style={{ paddingLeft: 10 }}>
                      <View style={styles.nameConatiner}>
                          <Text style={styles.name} numberOfLines={1}>
                              {firstReply?.author?.name}
                          </Text>
                          {firstReply?.author?.foiti_ambassador && (
                              <MaterialCommunityIcons
                                  name="shield-check"
                                  style={{ color: COLORS.foiti, fontSize: 15 }}
                              />
                          )}
                      </View>
                  </View>
              </View>
          </TouchableWithoutFeedback>
          <View style={styles.commentContainer}>
              <TouchableOpacity onPress={showMoreReply}>
                <Text numberOfLines={5} style={{ lineHeight: 20 }}>{firstReply.body}</Text>
              </TouchableOpacity>
          </View>
          {moreReplies > 0 && <TouchableOpacity onPress={showMoreReply} style={{ paddingHorizontal: FOITI_CONTS.padding }}>
              <Text style={{ fontWeight: "bold" }}>{moreReplies} more {moreReplies === 1 ? 'reply' : 'replies'}</Text>
          </TouchableOpacity>}
    </View>
  )
}

export default ShowReplay

const styles = StyleSheet.create({
    container:{
        paddingLeft: 37,
        marginTop:8
    },
    alignContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    commentContainer:{
        borderRadius: 12, 
        padding: FOITI_CONTS.padding, 
        backgroundColor: COLORS.foitiGreyLighter, 
        marginVertical: 5
    },
    profile: {
        height: 24,
        width: 24,
        borderRadius: 12,
    },
    nameConatiner: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: width - 210,
        alignItems: "center",
    },
    name: {
        fontWeight: "bold",
        fontSize: 14,
    },
})
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Image from "react-native-scalable-image";
import { Entypo } from "@expo/vector-icons";

import UserDetails from "../UserDetails";
import PostEngagement from "./PostEngagement";
import { COLORS, FOITI_CONTS } from "../../resources/theme";
import CoordinateComponent from "./CoordinateComponent";
import { useGetCommentAndCountQuery } from "../../Redux/services/serviceApi";
import { useSelector } from "react-redux";
import AddComment from "../Comment/AddComment";

const { width, height } = Dimensions.get("screen");

const Post = React.memo(
  ({ post, openBottomSheet }) => {
    const navigation = useNavigation();
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION)
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [hasSize, setHasSize] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [myComment, setMyComment] = useState({});
    const { isError, isSuccess, data, error } = useGetCommentAndCountQuery({ post_id: post?.item?._id, token: REDUXUSER.token  });


    useEffect(() => {
      setIsUnmounted(false);
      return() => setIsUnmounted(true);
    }, []);

    useEffect(() => {
      if(isSuccess && !isUnmounted){
        setCommentCount(data.totalComments);
        setMyComment(data.currentComment);
      }

      if(isError && !isUnmounted){
        setCommentCount(0);
        setMyComment({});
      }
    }, [isSuccess, isError])



    const openPost = () => {
      navigation.navigate(`Post via ${REDUXNAVIGATION.name}`, { post: post?.item?._id });
    };

    const openPlace = () => {
      const placeId =
        post?.item?.place?.original_place_id || post?.item?.place?._id;
      if (
        post?.item?.place?.types[1] == "country" ||
        post?.item?.place?.types[1] == "state" ||
        post?.item?.place?.types[1] == "union_territory" ||
        post?.item?.place?.destination
      ) {
        navigation.navigate(`PlaceHome via ${REDUXNAVIGATION.name}`, {
          place_id: placeId,
        });
      } else {
        navigation.navigate(`Place via ${REDUXNAVIGATION.name}`, {
          place_id: placeId,
        });
      }
    };
    //OPEN LIKED USERS
    const openLikedUsers = () => {
      navigation.navigate(`PostLikedUsers via ${REDUXNAVIGATION.name}`, { post: post?.item?._id });
    };

    //OPEN POST COMMENT
    const openComment = () => {
      navigation.navigate(`Comments via ${REDUXNAVIGATION.name}`, { post: post?.item });
    };

    return (
      <View style={{ backgroundColor: "#fff" }}>
        <View style={{ marginTop: 5  }}>
          <View style={{ paddingLeft: FOITI_CONTS.padding + 5, paddingRight: FOITI_CONTS.padding, paddingVertical: FOITI_CONTS.padding }}>
            <UserDetails
              details={post?.item?.user}
              profileUri={post?.item?.user?.profileImage?.thumbnail?.private_id}
              isHome={true}
              openBottomSheet={openBottomSheet}
            />
          </View>
          <Pressable onPress={openPost} style={{ zIndex:30 }}>
            <View
              style={[
                !hasSize && { height: 320 },
                {
                  maxHeight: 600,
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 7,
                  borderRadius: 12,
                  backgroundColor:COLORS.foitiGreyLighter
                },
              ]}
            >
                <Image
                  onSize={() => !hasSize && setHasSize(true)}
                  width={width}
                  progressiveRenderingEnabled={true}
                  source={{
                    uri: `${process.env.BACKEND_URL}/image/${post?.item?.content[0]?.image?.large?.private_id}`,
                  }}
                />
            </View>
          </Pressable>
          {post?.item?.coordinate_status && (
            <View style={{ marginHorizontal: 7 }}>
              <CoordinateComponent post={post?.item} />
            </View>
          )}
          {/* POST DETAILS FROM HERE */}
          <View style={styles.containContainer}>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%"
                  // width: width - FOITI_CONTS.padding * 3,
                }}
              >
                <TouchableOpacity onPress={openPlace} style={{ maxWidth: "68%" }}>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                    numberOfLines={1}
                  >
                    {post?.item?.place?.name}
                    {post?.item?.place?.local_address ||
                      post?.item?.place?.short_address}
                  </Text>
                </TouchableOpacity>
                <View style={{ width: "28%" }}>
                  <PostEngagement post={post?.item} isHome={true} />
                </View>
              </View>
            </View>
            {post?.item?.caption != undefined && post?.item?.caption != "" && (
              <>
                <View style={styles.caption}>
                  <TouchableOpacity onPress={openPost}>
                    <Text
                      numberOfLines={2}
                      style={{ color: "#000", lineHeight: 20 }}
                    >
                      {post?.item?.caption}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

          {/* LIKE AND COMMENT */}
            {post?.item?.like_count > 0 && commentCount > 0 ? (
              <View style={[styles.caption, { flexDirection: "row", alignItems:"center" }]}>
              <TouchableOpacity onPress={openLikedUsers}>
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  {post?.item?.like_count}{" "}
                  {post?.item?.like_count === 1 ? "Like" : "Likes"}
                </Text>
              </TouchableOpacity>
              <Entypo name="dot-single" style={{ marginLeft: 2 }} />
                <TouchableOpacity onPress={openComment} style={{ marginLeft: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  {commentCount}{" "}
                  {commentCount === 1 ? "Comment" : "Comments"}
                </Text>
              </TouchableOpacity>
            </View>
            ) : (
              <>
              {post?.item?.like_count > 0 && (
                <View style={[styles.caption, { flexDirection: "row" }]}>
                  <TouchableOpacity onPress={openLikedUsers}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {post?.item?.like_count}{" "}
                      {post?.item?.like_count === 1 ? "traveller" : "travellers"}{" "}
                      liked this post
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {commentCount > 0 && (
                <View style={[styles.caption, { flexDirection: "row" }]}>
                      <TouchableOpacity onPress={openComment}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {commentCount}{" "}
                      {commentCount === 1 ? "traveller" : "travellers"}{" "}
                      commented on this post
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              </>
            )}

            <View style={{ paddingBottom: FOITI_CONTS.padding, marginTop:5 }}>
              <AddComment myComment={myComment} post={post.item} />
            </View>


            <View style={styles.border} />
          </View>
        </View>
      </View>
    );
  },
  (prev, next) => {
    if (prev.post?.item?._id === next.post?.item?._id) {
      return true;
    }
    return false;
  }
);

// export default React.memo(Post);
export default Post;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 500,
    resizeMode: "cover",
  },
  containContainer:{
    paddingHorizontal: FOITI_CONTS.padding + 5,
  },
  caption: {
    // paddingHorizontal: FOITI_CONTS.padding + 5,
    paddingBottom: FOITI_CONTS.padding,
  },
  border: {
    borderBottomColor: "#ededed",
    width: "100%",
    borderBottomWidth: 1,
    marginTop:5
  },
  locationName: {
    paddingHorizontal: FOITI_CONTS.padding + 5,
    paddingVertical: 5,
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    bottom: 0,
    left: 0,
  },
});

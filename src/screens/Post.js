// ORIGINAL
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Text,
  FlatList,
  ActivityIndicator,
  Image as ImageNative,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FOITI_CONTS } from "../resources/theme";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { Entypo } from "@expo/vector-icons";
import PostEngagement from "../components/Post/PostEngagement";
import UserDetails from "../components/UserDetails";
import BoxPostComponent from "../components/Post/BoxPostComponent";
import Image from "react-native-scalable-image";
import ServerError from "../components/Error/ServerError";
import { useDispatch, useSelector } from "react-redux";
import ReadMore from "@fawazahmed/react-native-read-more";
import {
  useGetCommentAndCountQuery,
  useGetRandomPostsMutation,
  useGetSinglePostQuery,
} from "../Redux/services/serviceApi";
import { addImages, addPlaceData } from "../Redux/slices/addPlaceSlice";
import { addPostDetails } from "../Redux/slices/editPostSlice";
import PostBottomSheet from "../components/PostBottomSheet";
import CustomAlert from "../components/CustomAlert";
import { clearAlert } from "../Redux/slices/alertSlice";
import { useBackHandler } from "@react-native-community/hooks";
import CoordinateComponent from "../components/Post/CoordinateComponent";
import AddComment from "../components/Comment/AddComment";

const { width, height } = Dimensions.get("screen");

const PostImage = ({ post, prevRoute }) => {

  return (
    <View
      style={{
        minHeight: 150,
        position: "relative",
        borderRadius:12,
        overflow:"hidden",
        backgroundColor:COLORS.foitiGreyLighter
      }}
    >
      {/* <Image */}
      {prevRoute?.name == "Following Stack" ? (
        <>
          <Image
            progressiveRenderingEnabled={true}
            source={{
              uri: `${process.env.BACKEND_URL}/image/${post?.content[0]?.image?.large?.private_id}`,
            }}
            width={width - 14}
            style={{ borderRadius:12 }}
          />
        </>
      ) : (
        <>
          <Image
            source={{
              uri: `${process.env.BACKEND_URL}/image/${post?.content[0]?.image?.thumbnail?.private_id}`,
            }}
            width={width - 14}
            style={{ borderRadius:12 }}
          />
          <Image
            progressiveRenderingEnabled={true}
            source={{
              uri: `${process.env.BACKEND_URL}/image/${post?.content[0]?.image?.large?.private_id}`,
            }}
            width={width - 14}
            style={{ position: "absolute", left: 0, top: 0, zIndex: 100, borderRadius: 12 }}
          />
        </>
      )}
    </View>
  );
};

const FlatListHeader = ({
  post,
  onPressPlace,
  isOwnPost,
  editPost,
  openBottomSheet,
  prevRoute,
  openLikedUsers,
  commentCount,
  myComment,
  openComment
}) => {
  const formatedAddress =
    post?.place?.local_address || post?.place?.short_address;
  return (
    <View>
      <PostPlaceHeader
        title="Post"
        isProfile={false}
        isOwnPost={isOwnPost}
        editPost={editPost}
        openBottomSheet={openBottomSheet}
        isPostScreen={true}
      />
      <View style={{ zIndex: 20 }}>
        <PostImage post={post} prevRoute={prevRoute} />
      </View>
      {post?.content[0]?.location &&
        post?.content[0]?.location?.coordinates && 
        post?.content[0]?.location?.coordinates.length > 1 && (
          <View style={{ width: "100%" }}>
            <CoordinateComponent post={post} />
          </View>
        )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 7,
          paddingVertical: FOITI_CONTS.padding,
        }}
      >
        <View style={{ maxWidth: "65%" }}>
          <UserDetails
            details={post?.user}
            profileUri={post?.user?.profileImage?.thumbnail?.private_id}
          />
        </View>
        <View style={{ width: "28%", marginRight: 3 }}>
          <PostEngagement post={post} />
        </View>
      </View>
      <View>
        {post?.caption != undefined && post?.caption != "" && (
          <View style={styles.caption}>
            {post?.caption && (
              <ReadMore
                numberOfLines={5}
                seeMoreText="more"
                seeMoreStyle={{ marginRight:10, color: COLORS.foitiGrey }}
                seeMoreContainerStyleSecondary={{ position: 'relative' }}
                expandOnly={true}
                style={{ lineHeight: 20 }}
              >
                {post?.caption}
              </ReadMore>
            )}
          </View>
        )}
      </View>
      {/* LIKE AND COMMENT */}
      {post?.like_count > 0 && commentCount > 0 ? (
        <View
          style={[
            styles.caption,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <TouchableOpacity onPress={openLikedUsers}>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              {post?.like_count} {post?.like_count === 1 ? "Like" : "Likes"}
            </Text>
          </TouchableOpacity>
          <Entypo name="dot-single" style={{ marginLeft: 2 }} />
          <TouchableOpacity onPress={openComment} style={{ marginLeft: 2 }}>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {post?.like_count > 0 && (
            <View style={[styles.caption, { flexDirection: "row" }]}>
              <TouchableOpacity onPress={openLikedUsers}>
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  {post?.like_count}{" "}
                  {post?.like_count === 1 ? "Traveller" : "Travellers"} liked
                  this post
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {commentCount > 0 && (
            <View style={[styles.caption, { flexDirection: "row" }]}>
              <TouchableOpacity onPress={openComment}>
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  {commentCount}{" "}
                  {commentCount === 1 ? "Traveller" : "Travellers"} commented on
                  this post
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <View
        style={{
          paddingBottom: FOITI_CONTS.padding,
          paddingHorizontal: FOITI_CONTS.padding,
          maxWidth: width - 38,
        }}
      >
        <AddComment myComment={myComment} post={post} />
      </View>

      <View style={[styles.placeConatiner, { width, marginLeft: -7 }]}>
        <Pressable
          onPress={() => onPressPlace(post?.place)}
          style={{
            paddingVertical: 5,
          }}
        >
          <View
            style={
              post?.content[0]?.coordinate?.lat.trim() && styles.addressLength
            }
          >
            <Text numberOfLines={1} style={{ fontWeight: "bold" }}>
              {post?.place?.name}
            </Text>
            {formatedAddress != undefined && formatedAddress != "" && (
              <View style={{ flexDirection: "row" }}>
                <Text numberOfLines={2} style={{ fontSize: 12 }}>
                  {formatedAddress}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
        <View>
          <Pressable
            style={styles.directionContainer}
            onPress={() => onPressPlace(post?.place)}
          >
            <Entypo
              name="chevron-with-circle-right"
              size={26}
              color={COLORS.foitiGrey}
            />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          paddingTop: FOITI_CONTS.padding + 10,
          paddingBottom: FOITI_CONTS.padding + 2,
          paddingHorizontal: FOITI_CONTS.padding,
        }}
      >
        <Text style={{ fontWeight: "bold", color: COLORS.foitiGrey }}>
          Suggested Posts
        </Text>
      </View>
    </View>
  )
};

const Post = ({ route, navigation }) => {
  const postId = route.params.post;
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXIP = useSelector((state) => state.IPADDRESS);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXALERT = useSelector((state) => state.REDUXALERT);
  const [unMounted, setUnMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [myComment, setMyComment] = useState({});
  const dispatch = useDispatch();
  let post = {};
  let randomPosts = [];

  const routesNames = navigation.getState()?.routes;
  const prevRoute = routesNames[routesNames.length - 2];

  //Query POST
  const { data, error, isLoading, isError, isSuccess, refetch } =
    useGetSinglePostQuery(
      { postId, token: REDUXUSER.token, ip: REDUXIP },
      { refetchOnMountOrArgChange: true }
    );

    //GET FIRST COMMENT AND TOTAL COMMENT
  const { 
    isError:commentIsError, 
    isSuccess:commentIsSuccess, 
    data:commentData, 
    error:commentErrror 
  } = useGetCommentAndCountQuery({ post_id: postId, token: REDUXUSER.token });
  const [
    getRandomPosts,
    {
      data: data1,
      error: error1,
      isLoading: isLoading1,
      isError: isError1,
      isSuccess: isSuccess1,
    },
  ] = useGetRandomPostsMutation();

  const getRandPostFunc = async () => {
    await getRandomPosts({ ip: REDUXIP, token: REDUXUSER.token });
  };

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
    setUnMounted(false);
    if (!unMounted) {
      getRandPostFunc();
    }

    return () => {
      post = {};
      randomPosts = [];
      setUnMounted(true);
    };
  }, []);

  //SET COMMENT
  useEffect(() => {
    if (commentIsSuccess && !unMounted) {
      setCommentCount(commentData.totalComments);
      setMyComment(commentData.currentComment);
    }

    if (commentIsError && !unMounted) {
      setCommentCount(0);
      setMyComment({});
    }
  }, [commentIsSuccess, commentIsError])

  //SHOW ALERT
  useEffect(() => {
    if (!unMounted && (REDUXALERT.type == "post" || REDUXALERT.type == "savePost")) {
      setIsVisible(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        dispatch(clearAlert());
      }, 2000);
    }
  }, [REDUXALERT]);

  const reload = async () => {
    refetch();
    getRandPostFunc();
  };

  if (isSuccess) {
    if (!unMounted) {
      post = data.post;
      const uri = `${process.env.BACKEND_URL}/image/${data?.post?.content[0]?.image?.thumbnail?.private_id}`;

      ImageNative.getSize(uri, (width, height) => {
        setImageHeight(height);
      });
    }
  }

  if (isError) {
    if (error.status == 404 || error.status == 400) {
      navigation.navigate("PostNotFound");
    }
  }

  if (isSuccess1) {
    if (data1) {
      if (!unMounted) {
        randomPosts = data1.randomPosts;
      }
    }
  }

  const openBottomSheet = () => {
    setIsVisible(true);
  };

  const handleOpenPost = (post) => {
    navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post });
  };

  const onPressPlace = (item) => {
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

  const openLikedUsers = () => {
    navigation.push(`PostLikedUsers via ${REDUXNAVIGATION.name}`, { post: post._id });
  };

  const openComment = () => {
    navigation.push(`Comments via ${REDUXNAVIGATION.name}`, { post: post });
  };

  //SHOW BOTTOMSHEET
  const editPost = () => {
    const img = {
      name: post?.content[0]?.image?.large?.private_id,
      uri: `${process.env.BACKEND_URL}/image/${post?.content[0]?.image?.large?.private_id}`,
    };
    const image = [
      {
        file: img,
        coordinates: {
          lat: post?.content[0]?.coordinate?.lat || "",
          lng: post?.content[0]?.coordinate?.lng || "",
        },
      },
    ];

    const address = {
      name: post?.place?.name,
      place_id: post?.place?.google_place_id,
      address: post?.place?.address,
      coordinates: post?.place?.coordinates,
      types: post?.place?.types,
    };
    const storeData = {
      edit: true,
      captionText: post?.caption,
      postId: post?._id,
    };

    dispatch(addImages({ images: image }));
    dispatch(addPlaceData({ ...address }));
    dispatch(addPostDetails({ ...storeData }));

    navigation.navigate("New Post");
  };

  if (isLoading) {
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
    );
  }

  const renderEmptyList = () => {
    return (
      <>
        <View
          style={{
            paddingTop: 40,
          }}
        >
          {isLoading1 ? (
            <ActivityIndicator size="large" color={COLORS.foiti} />
          ) : (
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              No post to show
            </Text>
          )}
        </View>
      </>
    );
  };

  return (
    <>
      {isSuccess ? (
        <>
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View>
              <FlatList
                contentContainerStyle={{ paddingHorizontal: 7 }}
                ListHeaderComponent={
                  <FlatListHeader
                    isOwnPost={post?.user?._id === REDUXUSER?.user?._id}
                    post={post}
                    onPressPlace={onPressPlace}
                    openLikedUsers={openLikedUsers}
                    editPost={editPost}
                    openBottomSheet={openBottomSheet}
                    prevRoute={prevRoute}
                    commentCount={commentCount}
                    myComment={myComment}
                    openComment={openComment}
                  />
                }
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginBottom: 7,
                }}
                numColumns={2}
                data={randomPosts}
                renderItem={(item) => (
                  <BoxPostComponent item={item.item} onPress={handleOpenPost} />
                )}
                keyExtractor={(item, index) => index}
                ListEmptyComponent={renderEmptyList}
              />
            </View>
            <PostBottomSheet
              isVisible={isVisible}
              hideBottomSheet={() => {
                setIsVisible(false);
              }}
              post={post}
            />
            {showAlert && <CustomAlert text={REDUXALERT?.message} />}
          </View>
        </>
      ) : (
        <ServerError onPress={reload} />
      )}
    </>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    fontSize: 28,
    color: COLORS.foitiGrey,
  },
  reportIcon: {
    position: "absolute",
    top: 5,
    right: 2,
  },
  placeConatiner: {
    backgroundColor: "#ededed",
    paddingVertical: FOITI_CONTS.padding - 5,
    paddingHorizontal: FOITI_CONTS.padding + 7,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  directionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  reportButton: {
    position: "absolute",
    top: 5,
    right: 2,
    zIndex: 20,
  },
  footerButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width / 2,
    borderColor: COLORS.foitiGrey,
    borderWidth: 0.8,
    borderRadius: 2,
    paddingVertical: 7,
    borderRadius: 2,
  },
  buttonContent: {
    color: "#fff",
  },
  caption: {
    paddingHorizontal: FOITI_CONTS.padding,
    paddingBottom: FOITI_CONTS.padding,
  },
  addressLength: {
    width: width - 75,
  },
});

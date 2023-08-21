import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SimpleLineIcons, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { COLORS, FOITI_CONTS } from "resources";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { addNavigation } from "../Redux/slices/addNavigationSlice";
import { useFollowUnfollowUserMutation } from "../Redux/services/serviceApi";
const { width, height } = Dimensions.get("screen");

const UserDetails = ({
  isFollwerScreen = false,
  isBlockList = false,
  showLoading = false,
  details,
  profileUri = "profile_picture.jpg",
  isHome = false,
  openBottomSheet,
  handleUnBlock,
  hideReport = false,
  showTime={showTime}
}) => {
  //REDUX DATA
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  //APIS
  const [followUnfollowUser, { data, isSuccess, isError, error, isLoading }] =
    useFollowUnfollowUserMutation();

  useEffect(() => {
    setIsUnmounted(false);
    return () => setIsUnmounted(true);
  }, []);

  useEffect(() => {
    if (!isUnmounted) {
      setIsFollowing(details?.follower?.includes(REDUXUSER?.user?._id));
    }
  }, [details]);

  //FOLLOW UNFOLLOW USER
  const handleFollow = async () => {
    await followUnfollowUser({
      ownerId: details._id,
      token: REDUXUSER.token,
    });
    if (!isUnmounted) {
      setIsFollowing((prev) => !prev);
    }
  };

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
    navigation.push(`Others profile via ${REDUXNAVIGATION.name}`, { userId: details?._id });
  };
  const showProfile = () => {
    if (details?._id?.toString() === REDUXUSER?.user?._id?.toString()) {
      redirectToOwnProfile();
    } else {
      redirectToProfile();
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableWithoutFeedback onPress={showProfile}>
        <View style={styles.alignContent}>
          <View>
            <Image
              source={{
                uri: `${process.env.BACKEND_URL}/image/${profileUri}`,
              }}
              style={styles.profile}
            />
          </View>
          <View style={{ paddingLeft: 10 }}>
            <View style={styles.nameConatiner}>
              {/* Added dummy text to fix dots issue */}
              <Text style={styles.name} numberOfLines={1}>
                {details?.name} <Text style={{ color: 'rgba(0,0,0,0)'}}>x</Text>
              </Text>
              {details?.foiti_ambassador && (
                <MaterialCommunityIcons
                  name="shield-check"
                  style={{ color: COLORS.foiti, fontSize: 15, marginLeft: -9 }}
                />
              )}
            </View>
            <Text numberOfLines={1} style={styles.username}>
              {details?.total_contribution}{" "}
              {details?.total_contribution > 1
                ? "Contributions"
                : "Contribution"}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {(isHome && !hideReport) && (
        <View style={styles.alignContent}>
          <TouchableOpacity onPress={openBottomSheet}>
            <AntDesign
              name="ellipsis1"
              style={{ fontSize: 20, transform: [{rotateZ: "90deg"}] }}
            />
          </TouchableOpacity>
        </View>
      )}

      {(hideReport && showTime) && (
        <View style={{ marginTop: -20 }}>
          <Text>{showTime}</Text>
        </View>
      )}

      {isFollwerScreen && (
        <View style={styles.alignContent}>
          {details?._id?.toString() !== REDUXUSER?.user?._id?.toString() && (
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleFollow}
              style={[
                styles.followBox,
                isFollowing ? styles.followingButton : styles.followButton,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isFollowing ? COLORS.foitiGrey : "#fff"}
                  style={{ color: "#000" }}
                />
              ) : (
                <Text
                  style={
                    isFollowing
                      ? styles.followingTextColor
                      : styles.followTextColor
                  }
                >
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      {isBlockList && (
        <View style={styles.alignContent}>
          {details?._id?.toString() !== REDUXUSER?.user?._id?.toString() && (
            <TouchableOpacity
              disabled={showLoading}
              onPress={() => {
                setCurrentUser(details?._id);
                handleUnBlock(details?._id);
              }}
              style={[
                styles.followBox,
                isFollowing ? styles.followingButton : styles.followButton,
              ]}
            >
              {showLoading && details?._id === currentUser ? (
                <ActivityIndicator
                  size="small"
                  color={isFollowing ? COLORS.foitiGrey : "#fff"}
                  style={{ color: "#000" }}
                />
              ) : (
                <Text
                  style={
                    isFollowing
                      ? styles.followingTextColor
                      : styles.followTextColor
                  }
                >
                  Unblock
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  alignContent: {
    flexDirection: "row",
    alignItems: "center",
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
  username: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.foitiGrey,
  },
  iconColor: {
    color: COLORS.foitiRating,
  },
  blackIconColor: {
    color: COLORS.foitiGrey,
  },
  profile: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  followBox: {
    width: 90,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
  },
  followingButton: {
    borderColor: COLORS.foitiGrey,
    borderWidth: 0.3,
  },
  followingTextColor: {
    color: COLORS.foitiGrey,
  },
  followTextColor: {
    color: "#fff",
  },

  followButton: {
    backgroundColor: COLORS.foiti,
  },
});

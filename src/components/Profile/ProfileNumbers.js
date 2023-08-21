import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { COLORS } from "../../resources/theme";
import { useSelector } from "react-redux";

const ProfileNumbers = ({
  userData,
  showToggleContainer,
  showGeoPost,
  postCount,
}) => {
  const navigation = useNavigation();
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const [totalUploads, setTotalUploads] = useState(userData?.totalPosts);

  useEffect(() => {
    if (showGeoPost === true && postCount !== 0) {
      setTotalUploads(postCount);
    } else {
      setTotalUploads(userData?.totalPosts);
    }
  }, [showGeoPost, postCount]);

  const shareProfile = async () => {
    const content = {
      title: `Here is ${userData?.user?.name}'s profile on Foiti`,
      message: `Here is ${userData?.user?.name}'s profile on Foiti https://foiti.com/${userData?.user?._id}`,
      url: `https://foiti.com/${userData?.user?._id}`,
    };
    const options = {
      dialogTitle: `Here is ${userData?.user?.name}'s profile on Foiti`,
      subject: `Here is ${userData?.user?.name}'s profile on Foiti`,
    };
    try {
      const result = await Share.share(content, options);
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
      alert(error.message);
    }
  };

  const openFollowDetails = (name) => {
    navigation.push(`FollowDetails via ${REDUXNAVIGATION.name}`, {
      name: userData?.user?.name,
      ownerId: userData?.user?._id,
      initialRoute: name,
    });
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <View style={styles.numberContainer}>
          <TouchableOpacity>
            <Text style={styles.number}>{totalUploads}</Text>
            <Text>Uploads</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numberContainer}>
          <TouchableOpacity onPress={() => openFollowDetails("Followers")}>
            <Text style={styles.number}>
              {userData?.user?.follower?.length}
            </Text>
            <Text>Followers</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.numberContainer}>
          <TouchableOpacity onPress={() => openFollowDetails("Following")}>
            <Text style={styles.number}>
              {userData?.user?.following?.length}
            </Text>
            <Text>Following</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableWithoutFeedback onPress={shareProfile}>
          <Ionicons
            name="share-social-outline"
            color={COLORS.foitiGrey}
            size={20}
            style={{ marginRight: 15 }}
          />
          {/* <FontAwesome
            name="gear"
            color={COLORS.foitiGrey}
            size={20}
            style={{ marginRight: 10 }}
          /> */}
        </TouchableWithoutFeedback>
        {userData?.user?._id?.toString() !==
          REDUXUSER?.user?._id?.toString() && (
          <TouchableWithoutFeedback onPress={showToggleContainer}>
            <Ionicons
              name="settings-outline"
              color={COLORS.foitiGrey}
              size={20}
              style={{ marginRight: 10 }}
            />
            {/* <FontAwesome
            name="gear"
            color={COLORS.foitiGrey}
            size={20}
            style={{ marginRight: 10 }}
          /> */}
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

export default ProfileNumbers;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  numberContainer: {
    paddingRight: 15,
  },
  number: {
    fontWeight: "bold",
  },
});

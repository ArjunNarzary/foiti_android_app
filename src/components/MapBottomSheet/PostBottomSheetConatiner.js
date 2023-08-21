import React from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native"
import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons"
import { BACKEND_URL } from "@env"
import { COLORS } from "../../resources/theme"
import { useNavigation } from "@react-navigation/native"
import { useSelector } from "react-redux"
import {
  Placeholder,
  PlaceholderMedia,
  Shine,
} from "rn-placeholder"
import PostEngagement from "../Post/PostEngagement"
import { addNavigation } from "../../Redux/slices/addNavigationSlice"

const PostBottomSheetContainer = ({ post, closeBottomSheet, loading }) => {
  const navigation = useNavigation()
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION)
  const REDUXUSER = useSelector((state) => state.AUTHUSER)

  //REDIRECT USER TO OWN PROFILE
  const redirectToOwnProfile = () => {
    const currentNav = REDUXNAVIGATION.name
    dispatch(
      addNavigation({
        name: "profile",
      })
    )

    if (currentNav === "profile") {
      navigation.navigate("Profile Nav")
    } else {
      navigation.navigate("Profile")
    }
  }

  const redirectToProfile = () => {
    navigation.push(`Others profile via ${REDUXNAVIGATION.name}`, {
      userId: post.user?._id,
    })
  }

  const showProfile = () => {
    if (post.user?._id?.toString() === REDUXUSER?.user?._id?.toString()) {
      redirectToOwnProfile()
    } else {
      redirectToProfile()
    }
  }

  const openPost = () => {
    navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post: post?._id })
  }

  const RenderUserDetails = ({ details, loading }) => (
    <TouchableWithoutFeedback onPress={showProfile}>
      <View style={styles.alignContent}>
          <View style={{ flex: 1 }}>
            <View style={styles.nameContainer}>
              {/* Added dummy text to fix dots issue */}
              <Text style={styles.name} numberOfLines={1}>
                {details?.name}{" "}
                <Text style={{ color: "rgba(0,0,0,0)" }}>x</Text>
              </Text>
              {details?.foiti_ambassador && (
                <MaterialCommunityIcons
                  name="shield-check"
                  style={{ color: COLORS.foiti, fontSize: 15, marginLeft: -8 }}
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
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeContainer}
        onPress={closeBottomSheet}
      >
        <Ionicons style={{ fontSize: 13, color: "white" }} name="close" />
      </TouchableOpacity>
      <View style={styles.placeContainer}>
        <TouchableOpacity style={styles.imageStyle} onPress={openPost}>
          {loading ? (
            <Placeholder Animation={Shine}>
              <PlaceholderMedia style={styles.imageStyle} />
            </Placeholder>
          ) : (
            <>
              {post?.content &&
                post?.content.length > 0 &&
                post?.content[0].location &&
                post?.content[0].location?.coordinates &&
                post?.content[0].location?.coordinates.length > 0 && (
                  <Image
                    source={{
                      uri: `${BACKEND_URL}/image/${post?.content[0]?.image?.thumbnail?.private_id}`,
                    }}
                    style={styles.imageStyle}
                  />
                )}
            </>
          )}
        </TouchableOpacity>
        <View style={styles.placeDetails}>
          <View>
            <RenderUserDetails
              details={post?.user}
              // profileUri={post?.user?.profileImage?.thumbnail?.private_id}
              loading={loading}
            />
          </View>
          <View style={styles.hrLine} />
          <Text
            style={{
              fontStyle: "italic",
              fontSize: 11,
              color: COLORS.foitiGrey,
              marginTop: 2,
            }}
          >
            This photo was captured in this exact location
          </Text>
          <View style={{ maxWidth: "70%" }}>
            <PostEngagement post={post} showDirection={true} />
          </View>
        </View>
      </View>
    </View>
  )
}

export default PostBottomSheetContainer

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "#fff",
    // padding: 12,
    borderRadius: 17,
    elevation: 2,
    overflow: "hidden",
    height: 130,
  },
  closeContainer: {
    position: "absolute",
    left: 5,
    top: 5,
    zIndex: 100,
    height: 18,
    width: 18,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  placeContainer: {
    flexDirection: "row",
  },
  imageStyle: {
    height: 130,
    width: 130,
    borderRadius: 17,
    zIndex: 1,
  },
  placeDetails: {
    marginLeft: 10,
    paddingRight: 10,
    flex: 1,
  },
  hrLine: {
    width: "100%",
    height: 0.5,
    backgroundColor: COLORS.foitiGreyLight,
    marginBottom: 5,
  },
  alignContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
    position: "relative",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "98%",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    maxWidth: "90%",
  },
  username: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.foitiGrey,
  },
})

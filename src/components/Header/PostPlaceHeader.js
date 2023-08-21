import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons, Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../resources/theme";
import { useNavigation } from "@react-navigation/native";

const PostPlaceHeader = ({
  isNotification = false,
  markAllRead,
  title,
  isProfile,
  isOwnPost = false,
  editPost,
  otherProfile = false,
  showBottomSheet,
  openBottomSheet,
  profileImage,
  isPostScreen = false,
  isChat= false,
  showProfile
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.reset({
                index: 0,
                // routes: [{ name: "Home Navigation" }],
                routes: [{ name: "WelcomeStack" }],
              });
            }
          }}
        >
          <Ionicons name="md-chevron-back-sharp" style={{ fontSize: 25 }} />
        </Pressable>
        <Pressable
          onPress={showProfile}
          style={{
            width: Dimensions.get("window").width - 100,
            flexDirection:"row",
            justifyContent:"flex-start",
            alignItems:"center",
            marginLeft: 10
          }}
        >
          {isChat && <Image
            source={{
              uri: `${process.env.BACKEND_URL}/image/${profileImage}`,
            }}
            style={styles.thumbnail}
          />}
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {title}
          </Text>
        </Pressable>
      </View>

      {isProfile && (
        <View>
          <TouchableOpacity
            onPress={() => {
              if (otherProfile) {
                showBottomSheet();
              } else {
                navigation.openDrawer();
              }
            }}
          >
            {otherProfile ? 
              <AntDesign
                name="ellipsis1"
                style={{ fontSize: 25, transform: [{ rotateZ: "90deg" }] }}
              />
              :
              <MaterialCommunityIcons
                name="menu-open"
                style={styles.icon}
              />

            }
          </TouchableOpacity>
        </View>
      )}

      {isNotification && (
        <View>
          <TouchableOpacity onPress={markAllRead}>
            {/* <MaterialCommunityIcons name="dots-vertical" style={styles.icon} /> */}
            <AntDesign
              name="ellipsis1"
              style={{ fontSize: 25, transform: [{ rotateZ: "90deg" }] }}
            />
          </TouchableOpacity>
        </View>
      )}

      {isOwnPost ? (
        <View>
          <TouchableOpacity onPress={editPost} style={{ paddingRight: 7 }}>
            <Feather
              name="edit"
              style={{
                fontSize: 20,
                color: COLORS.foitiGrey,
              }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {!isProfile && isPostScreen && (
            <View>
              <TouchableOpacity onPress={openBottomSheet}>
                  <AntDesign
                    name="ellipsis1"
                    style={{ fontSize: 25, transform: [{ rotateZ: "90deg" }] }}
                  />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default PostPlaceHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  icon: {
    fontSize: 28,
  },
  thumbnail:{
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 5,
  }
});

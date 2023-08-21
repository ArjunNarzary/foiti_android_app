import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} from "react-native";
import React, { useEffect, useState } from "react";
import ImageViewer from 'react-native-image-zoom-viewer';
import { COLORS } from "../../resources/theme";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../../Redux/slices/addAddressSlice";
import { useFollowUnfollowUserMutation } from "../../Redux/services/serviceApi";
import axios from "axios";

const { width, height } = Dimensions.get("screen");

const CoverProfile = ({
  isOwnProfile = false,
  isEdit = false,
  profileImg = `profile_picture.jpg`,
  profileLargeImg = null,
  coverImg = `default_cover.jpg`,
  userData,
  selectImage,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [followUnfollowUser, { data, isSuccess, isError, error, isLoading }] =
    useFollowUnfollowUserMutation();

  const handleFollow = async () => {
    await followUnfollowUser({
      ownerId: userData.user._id,
      token: REDUXUSER.token,
    });
    setIsFollowing((prev) => !prev);
  };

  useEffect(() => {
    setIsFollowing(userData?.isFollowed);
  }, [userData]);

  const showEditProfile = () => {
    if (userData?.user?.place?._id){
      dispatch(
        addAddress({
          name: userData?.user?.place?.name,
          administrative_area_level_1: userData?.user?.place?.display_address?.admin_area_1 ||
            userData?.user?.place?.address?.administrative_area_level_1 || "",
          country: userData?.user?.place?.display_address?.country || userData?.user?.place?.address?.country || "",
          short_country: userData?.user?.place?.address?.short_country || "",
        })
      );
    }
    else if (userData?.user?.address?.name != undefined) {
      dispatch(
        addAddress({
          name: userData?.user?.address?.name,
          administrative_area_level_1:
            userData?.user?.address?.administrative_area_level_1 || "",
          country: userData?.user?.address?.country || "",
          short_country: userData?.user?.address?.short_country || "",
        })
      );
    }
    navigation.navigate("Edit Profile", userData);
  };

  const createChat = async () => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/chat`, { userId: userData.user._id },
        {
          headers: { token: REDUXUSER.token },
        }
      );
      if (data) {
        navigation.push(`ChatBox via ${REDUXNAVIGATION.name}`, { "chatId": data._id, "user": data })
      }

    } catch (err) {
      console.log("err ", err)
    }
  }

  const images = [{
    url: profileLargeImg ? `${BACKEND_URL}/image/${profileLargeImg}` : `${BACKEND_URL}/image/${profileImg}`,
    width: 500,
    height: 500
  }]

  const renderLoading = () => {
    return (<ActivityIndicator color={'white'} size={'large'} />)
  }

  const renderImage = ({ source }) => {
    return (
      <Image
        // source={{ uri: source?.uri }}
        source={{ uri: source?.uri, priority: 'high' }}
        style={{ width: 300, height: 300, borderRadius: 300/2, borderWidth:2, borderColor:"#fff", alignSelf:'center' }}
        resizeMode="contain"
        indicator={renderLoading}
      />
    )
  }

  return (
    <View>
      <View style={styles.coverConatiner}>
        <Image
          source={{
            uri: `${BACKEND_URL}/image/${coverImg}`,
          }}
          style={styles.cover}
        />
        {isEdit && (
          <View style={styles.overlayContainer}>
            <TouchableOpacity
              onPress={() => {
                selectImage("cover");
              }}
            >
              <Ionicons name="camera-outline" style={styles.changeIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.profileContainer}>
        <View>
          <View style={[isEdit ? styles.profileBoxEdit : styles.profileBox]}>
            <TouchableOpacity onPress={() => setShowImageModal(true)}>
              <Image
                source={{
                  uri: `${BACKEND_URL}/image/${profileImg}`,
                }}
                style={styles.profile}
                // blurRadius={isEdit ? 2 : 0}
              />
            </TouchableOpacity>

            {isEdit && (
              <View style={styles.overlayContainer}>
                <TouchableOpacity
                  onPress={() => {
                    selectImage("profile");
                  }}
                >
                  <Ionicons name="camera-outline" style={styles.changeIcon} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {!isEdit && (
          <View>
            {isOwnProfile ? (
              <TouchableOpacity
                style={[styles.changeButton, styles.editButton]}
                onPress={showEditProfile}
              >
                <Text style={{ fontWeight: "bold", color: COLORS.foitiGrey }}>
                  Edit
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection:"row", justifyContent:"flex-end", alignItems:"center"  }}>
                  <TouchableOpacity style={styles.messageButton} onPress={createChat}>
                    <Ionicons name="chatbubble-ellipses-outline" style={{ fontSize:20, color:"#fff" }} />
                  </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.changeButton,
                    isFollowing ? styles.followingButton : styles.followButton,
                  ]}
                  onPress={handleFollow}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={isFollowing ? COLORS.foitiGrey : "#fff"}
                      style={{ color: "#000" }}
                    />
                  ) : (
                    <Text
                      style={[
                        isFollowing
                          ? styles.followingTextColor
                          : styles.followTextColor,
                        { fontWeight: "bold" },
                      ]}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
      <Modal 
        visible={showImageModal} 
        transparent={true} 
        onRequestClose={() => {
          setShowImageModal(false);
        }}>
        <ImageViewer 
            enablePreload={true}
            index={0}
            renderIndicator={(currentIndex, allSize) => {
              return <Text style={{ color: 'rgba(0,0,0,0.6)' }}>{currentIndex} / {allSize}</Text>
            }}
            imageUrls={images} 
            useNativeDriver={true}
            enableSwipeDown={true}
            onSwipeDown={() => setShowImageModal(false)}
            onClick={() => setShowImageModal(false)}
            renderImage={renderImage}
            loadingRender={renderLoading}
            backgroundColor={'rgba(0,0,0,0.6)'}
            />
      </Modal>
    </View>
  );
};

export default CoverProfile;

const styles = StyleSheet.create({
  coverConatiner: {
    width,
    height: 220,
    backgroundColor: "#334D5C",
  },
  cover: {
    width,
    height: 220,
    resizeMode: "cover",
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingTop: 8,
    paddingBottom:5,
    paddingHorizontal: 14,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff",
    position:"relative",
    minHeight:45,
  },
  profileBoxEdit: {
    position: "absolute",
    top: -43,
    height: 86,
    width: 86,
    borderRadius: 86 / 2,
    backgroundColor: "#334D5C",
    borderColor: "#fff",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileBox: {
    position: "absolute",
    top: -70,
    height: 86,
    width: 86,
    borderRadius: 86 / 2,
    backgroundColor: "#A0A0A0",
    borderColor: "#fff",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    height: 82,
    width: 82,
    borderRadius: 41,
    resizeMode: "cover",
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
  editButton: {
    borderColor: COLORS.foitiGrey,
    borderWidth: 0.3,
  },

  changeButton: {
    paddingVertical: 6,
    borderRadius: 20,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },
  overlayContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2 )",
  },
  changeIcon: {
    color: "#fff",
    fontSize: 40,
  },
  messageButton:{
    width: 34,
    height: 34,
    borderRadius:17,
    marginRight:10,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:COLORS.foitiGrey,
    elevation:5
  }
});

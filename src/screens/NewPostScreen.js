import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/NewPlace/Header";
import ImageContainer from "../components/NewPlace/ImageContainer";
import CaptionEditior from "../components/NewPlace/CaptionEditior";
import { useDispatch, useSelector } from "react-redux";
import { removePlaceData } from "../Redux/slices/addPlaceSlice";
import { useBackHandler } from "@react-native-community/hooks";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  useAddPostMutation,
  useDeletePostMutation,
  useEditPostMutation,
} from "../Redux/services/serviceApi";
import { COLORS } from "../resources/theme";
import ModalComponent from "../components/ModalComponent";
import { removePostDetails } from "../Redux/slices/editPostSlice";
const { width, height } = Dimensions.get("window");

const NewPostScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const REDUXDATA = useSelector((state) => state.NEWPLACE);
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXEDITPOSTDETAILS = useSelector((state) => state.EDITPOST);

  const [postActive, setPostActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [caption, setCaption] = useState("");
  const [percent, setPercent] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [hideBottomContainer, setHideBottomContainer] = useState(false);
  const [emptyPlace, setEmptyPlace] = useState(false);

  const [addPost, { isLoading, isSuccess, isError, error, data }] =
    useAddPostMutation();

  const [
    editPost,
    {
      isLoading: editIsLoading,
      isSuccess: editIsSuccess,
      isError: editIsError,
      data: editData,
    },
  ] = useEditPostMutation();

  const [
    deletePost,
    {
      isLoading: deleteIsLoading,
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      data: deleteData,
    },
  ] = useDeletePostMutation();

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }

    dispatch(removePlaceData());
    dispatch(removePostDetails());
    return true;
  });

  useEffect(() => {
    if (REDUXEDITPOSTDETAILS.edit && REDUXEDITPOSTDETAILS.captionText != "") {
      setCaption(REDUXEDITPOSTDETAILS.captionText);
    }
  }, []);

  useEffect(() => {
    if (
      REDUXDATA?.images[0]?.file.uri != null &&
      REDUXDATA?.images[0]?.file.uri != undefined &&
      REDUXDATA.place_id != "" &&
      REDUXDATA.place_id != undefined
    ) {
      setPostActive(true);
    }
  }, [REDUXDATA]);

  useEffect(() => {
    if (isSuccess) {
      setModalVisible(false);
      dispatch(removePostDetails());
      dispatch(removePlaceData());
      if (
        data?.post.coordinate_status === true &&
        data?.uploadedBefore === false &&
        data?.typeAddress === false
      ) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Review",
              params: {
                place_id: data?.post.place || editData?.post.place,
                place_name: data?.post.name || editData?.post.name,
                post_id: data?.post._id || editData?.post._id,
              },
            },
          ],
        });
      } else {
        if (data?.post.coordinate_status === false) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "AddCoordinates",
                params: {
                  post: data?.post,
                  place: data?.place,
                },
              },
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Home Navigation",
                state: {
                  routes: [
                    {
                      name: "Drawer Home",
                      state: { routes: [{ name: "Profile" }] },
                    },
                  ],
                },
              },
            ],
          });
        }
      }
    }
    if (isError) {
      setModalVisible(true);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (editIsSuccess || deleteIsSuccess) {
      closeModal();
    }
    if (editIsError || deleteIsError) {
      setModalVisible(true);
    }
  }, [editIsSuccess, editIsError, deleteIsSuccess, deleteIsError]);

  const backPressed = () => {
    dispatch(removePlaceData());
    dispatch(removePostDetails());
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
  };

  const isValid = () => {
    if (
      REDUXDATA?.images[0]?.file.uri == null ||
      REDUXDATA?.images[0]?.file.uri === undefined ||
      REDUXDATA?.place_id == "" ||
      REDUXDATA?.place_id === undefined
    ) {
      setErrorMsg({ location: "Location is required" });
      setEmptyPlace(true);
      return false;
    } else if (caption.trim().length > 5000) {
      setErrorMsg({ caption: "Please write caption within 5000 characeters" });
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (isLoading) {
      setPostActive(false);
    }
  }, [isLoading]);

  const onPost = async () => {
    if (isValid()) {
      const body = {
        details: JSON.stringify(REDUXDATA),
        caption,
        file: REDUXDATA?.images[0]?.file,
        token: REDUXUSER?.token,
      };
      await addPost(body);
    }
  };

  const onEditPost = async () => {
    if (isValid()) {
      const body = {
        postId: REDUXEDITPOSTDETAILS.postId,
        details: REDUXDATA,
        caption,
        token: REDUXUSER?.token,
      };

      await editPost(body);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    dispatch(removePlaceData());
    dispatch(removePostDetails());

    if (deleteData != undefined && deleteData?.success == true) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Home Navigation",
            state: {
              routes: [
                {
                  name: "Drawer Home",
                  state: { routes: [{ name: "Profile" }] },
                },
              ],
            },
          },
        ],
      });
    } else if (editData != undefined && editData?.success == true) {
      navigation.dispatch((state) => {
        const routes = state.routes.filter((r) => r.name !== "New Post");
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
  };

  //DELETE POST
  const handleDeletePost = async () => {
    setConfirmDeleteModal(true);
  };
  const confirmDelete = async () => {
    setConfirmDeleteModal(false);
    const body = {
      postId: REDUXEDITPOSTDETAILS.postId,
      token: REDUXUSER?.token,
    };

    await deletePost(body);
  };

  const closeConfirmModal = () => {
    setConfirmDeleteModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}>
      <Header
        activeStatus={postActive}
        backPressed={backPressed}
        onPost={onPost}
        onEditPost={onEditPost}
        isEdit={REDUXEDITPOSTDETAILS.edit}
      />
      {/* <View> */}
      {(isLoading || editIsLoading || deleteIsLoading) && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            width,
            marginTop: 50,
            height: height - 50,
            backgroundColor: "#00000080",
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.foiti} />
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ minHeight: height - 100 }}>
          <ImageContainer error={errorMsg?.location} />
          <CaptionEditior
            profile={REDUXUSER?.user?.profileImage?.thumbnail?.private_id}
            error={errorMsg?.caption}
            value={caption}
            setValue={(value) => {
              setErrorMsg({ caption: undefined });
              setCaption(value);
            }}
          />
          {/* IF IMAGE HAS NO COORDINATES */}
          {(!REDUXEDITPOSTDETAILS?.edit &&
            REDUXDATA?.images[0]?.coordinates?.lat) ? (
              <>
                <View
                  style={{
                    width: "90%",
                    alignSelf: "center",
                  }}
                >
                  <Text style={{ color: COLORS.foitiGrey, width: "100%" }}>
                    We were able to detect coordinates from your photo, which means other travellers will be able to navigate to the exact location where you took the photo.
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                    onPress={() => navigation.navigate("Help")}
                  >
                    <Feather
                      name="info"
                      style={{ marginRight: 6 }}
                      size={14}
                      color="black"
                    />
                    <Text style={{ color: "#000" }}>
                      Learn how to capture photos with coordinates
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          {REDUXEDITPOSTDETAILS.edit && (
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={handleDeletePost}
                disabled={deleteIsLoading}
                style={{
                  paddingVertical: 7,
                  paddingHorizontal: 30,
                  borderRadius: 2,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "bold",
                    color: COLORS.foitiGrey,
                  }}
                >
                  Delete Post
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {/* <CommentFooter /> */}
        </View>
      </ScrollView>

      {/* </View> */}
      <ModalComponent
        body={
          editIsSuccess
            ? "Your post has been successfully edited."
            : deleteIsSuccess
              ? "Your post has been successfully deleted."
              : `Something went wrong while ${isError ? "uploading" : editIsError ? "editing" : "deleting"
              } your post. Please try again.`
        }
        closeModal={closeModal}
        modalVisible={modalVisible}
        hasButton={true}
      />

      <ModalComponent
        body="Are you sure you want to delete this post?"
        closeModal={closeConfirmModal}
        modalVisible={confirmDeleteModal}
        confirmModal={true}
        confirmDelete={confirmDelete}
        cancelDelete={closeConfirmModal}
      />
    </View>
  );
};

export default NewPostScreen;


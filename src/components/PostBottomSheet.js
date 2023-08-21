import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BottomSheet } from "react-native-elements";
import { COLORS } from "../resources/theme";
import { useNavigation } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../Redux/slices/alertSlice";
import { useReportPostMutation } from "../Redux/services/serviceApi";
const { width, height } = Dimensions.get("window");

const PostBottomSheet = ({ isVisible, hideBottomSheet, post }) => {
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const navigation = useNavigation();
  const [reportPost, { data, error, isError, isSuccess, isLoading }] =
    useReportPostMutation();
  const [visibleScreen, setVisibleScreen] = useState("1");
  const [reportText, setReportText] = useState("");
  const [isUnMounted, setIsUnMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsUnMounted(false);
    return () => {
      setIsUnMounted(true);
    };
  }, []);

  const sharePost = async () => {
    const content = {
      title: `Check this ${post?.user?.name}'s post on Foiti`,
      message: `Check this ${post?.user?.name}'s post on Foiti https://foiti.com/post/${post?._id}`,
      url: `https://foiti.com/post/${post?._id}`,
    };
    const options = {
      dialogTitle: `Check this ${post?.user?.name}'s post on Foiti`,
      subject: `Check this ${post?.user?.name}'s post on Foiti`,
    };
    try {
      const result = await Share.share(content, options);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
          if (isUnMounted) return;
          hideBottomSheet();
          setVisibleScreen("1");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      //   alert(error.message);
      if (isUnMounted) return;
      hideBottomSheet();
      setVisibleScreen("1");
    }
  };

  const hideBottomSheet1 = () => {
    if (isUnMounted) return;
    setVisibleScreen("1");
    hideBottomSheet();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAlert({ type: "post", message: "Reported" }));
      if (!isUnMounted) {
        hideBottomSheet();
        setVisibleScreen("1");
      }
    }
    if (isError) {
      if (!isUnMounted) {
        dispatch(
          setAlert({ type: "post", message: "Opps! Please try again." })
        );
        hideBottomSheet();
        setVisibleScreen("1");
      }
    }
  }, [isSuccess, isError]);

  const submitReport = () => {
    if (reportText.trim() != "") {
      reportPost({
        post_id: post?._id,
        token: REDUXUSER.token,
        message: reportText,
      });
    }
  };

  return (
    <BottomSheet isVisible={isVisible}>
      <TouchableOpacity
        style={{
          width,
          height: height - StatusBar.currentHeight,
          alignItems: "baseline",
        }}
        onPress={hideBottomSheet1}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 10,
            justifyContent: "center",
            minHeight: 40,
            width,
            position: "absolute",
            bottom: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          {isLoading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 30,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
          ) : (
            <>
              {visibleScreen == "1" ? (
                <View>
                  <TouchableOpacity style={{ padding: 10 }} onPress={sharePost}>
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Share
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => setVisibleScreen("2")}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Report
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : visibleScreen == "2" ? (
                <View>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      setReportText("Spam");
                      setVisibleScreen("3");
                    }}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Spam
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      setReportText("False Location");
                      setVisibleScreen("3");
                    }}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      False Location
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      setReportText("Nudity");
                      setVisibleScreen("3");
                    }}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Nudity
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      if (isUnMounted) return;
                      hideBottomSheet();
                      setVisibleScreen("1");
                      navigation.navigate("Report", {
                        id: post?._id,
                        type: "post",
                      });
                    }}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Something Else
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.bottomContainer}>
                  <Text style={{ paddingVertical: 10 }}>
                    You chose to report this post for
                  </Text>
                  <Text style={{ fontWeight: "bold", paddingVertical: 10 }}>
                    {reportText}
                  </Text>
                  <View>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={submitReport}
                    >
                      <Text
                        style={{
                          paddingVertical: 10,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
    </BottomSheet>
  );
};

export default PostBottomSheet;

const styles = StyleSheet.create({
  bottomContainer: {
    padding: 15,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: COLORS.foiti,
    marginTop: 10,
    width: width - 180,
    alignItems: "center",
    borderRadius: 3,
  },
});

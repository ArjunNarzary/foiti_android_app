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
import {
  useBlockUserMutation,
  useReportUserMutation,
} from "../Redux/services/serviceApi";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../Redux/slices/alertSlice";
const { width, height } = Dimensions.get("window");

const UserBottomSheet = ({ isVisible, hideBottomSheet, user, isChat=false }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const [visibleScreen, setVisibleScreen] = useState("1");
  const [reportText, setReportText] = useState("");
  const [isUnMounted, setIsUnMounted] = useState(false);

  const [blockUser, { isLoading, isError, isSuccess }] = useBlockUserMutation();
  const [
    reportUser,
    {
      isLoading: userReportIsLoading,
      isError: userReportIsError,
      isSuccess: userReportIsSuccess,
    },
  ] = useReportUserMutation();

  useEffect(() => {
    setIsUnMounted(false);
    return () => {
      setIsUnMounted(true);
    };
  },[]);

  const shareProfile = async () => {
    const content = {
      title: `Here is ${user?.name}'s profile on Foiti`,
      message: `Here is ${user?.name}'s profile on Foiti https://foiti.com/${user?._id}`,
      url: `https://foiti.com/${user?._id}`,
    };
    const options = {
      dialogTitle: `Here is ${user?.name}'s profile on Foiti`,
      subject: `Here is ${user?.name}'s profile on Foiti`,
    };
    try {
      const result = await Share.share(content, options);
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
          if (isUnMounted) return;
          hideBottomSheet();
          setVisibleScreen("1");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        if (isUnMounted) return;
        hideBottomSheet();
        setVisibleScreen("1");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //BLOCKED SUCCESS
  useEffect(() => {
    if (isSuccess) {
      dispatch(setAlert({ type: "user", message: "Blocked" }));
      if (!isUnMounted) {
        hideBottomSheet();
        setVisibleScreen("1");
      }
    }
    if (isError) {
      if (!isUnMounted) {
        dispatch(
          setAlert({ type: "user", message: "Opps! Please try again." })
        );
        hideBottomSheet();
        setVisibleScreen("1");
      }
    }
  }, [isSuccess, isError]);

  //USER REPORT SUCCESS
  useEffect(() => {
    if (userReportIsSuccess) {
      dispatch(setAlert({ type: "user", message: "Reported" }));
      if (!isUnMounted) {
        hideBottomSheet();
        setVisibleScreen("1");
      }
    }
    if (userReportIsError) {
      if (!isUnMounted) {
        dispatch(
          setAlert({ type: "user", message: "Opps! Please try again." })
        );
        hideBottomSheet();
        setVisibleScreen("1");
      }
    }
  }, [userReportIsError, userReportIsSuccess]);

  const hideBottomSheet1 = () => {
    if (isUnMounted) return;
    setVisibleScreen("1");
    hideBottomSheet();
  };

  const submitReport = () => {
    if (reportText.trim() != "") {
      reportUser({
        user_id: user?._id,
        token: REDUXUSER.token,
        message: reportText,
      });
    }
  };

  const handleBlockUser = () => {
    blockUser({
      user_id: user?._id,
      token: REDUXUSER.token,
    });
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
          {isLoading || userReportIsLoading ? (
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
                  {!isChat && <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={shareProfile}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Share
                    </Text>
                  </TouchableOpacity>}
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => setVisibleScreen("2")}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Report
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={handleBlockUser}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Block
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : visibleScreen == "2" ? (
                <View>
                  {isChat ? 
                  <>
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
                              setReportText("Bullying or Harassment");
                              setVisibleScreen("3");
                            }}
                          >
                            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                              Bullying or Harassment
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => {
                              setReportText("Scam");
                              setVisibleScreen("3");
                            }}
                          >
                            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                              Scam
                            </Text>
                          </TouchableOpacity>
                  </>  :
                  <>
                          <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => {
                              setReportText("Fake Account");
                              setVisibleScreen("3");
                            }}
                          >
                            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                              Fake Account
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => {
                              setReportText("Posting Inappropriate Things");
                              setVisibleScreen("3");
                            }}
                          >
                            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                              Posting Inappropriate Things
                            </Text>
                          </TouchableOpacity>
                  </>
                }
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      setReportText("Inappropriate Profile Info");
                      setVisibleScreen("3");
                    }}
                  >
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                      Inappropriate Profile Info
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      if (isUnMounted) return;
                      hideBottomSheet();
                      setVisibleScreen("1");
                      navigation.navigate("Report", {
                        id: user?._id,
                        type: "user",
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
                    You chose to report this user for
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

export default UserBottomSheet;

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
    borderRadius: 17,
  },
});

import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BottomSheet } from "react-native-elements";
import { COLORS } from "../resources/theme";
import { useNavigation } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../Redux/slices/alertSlice";
import { useReportCommentMutation } from "../Redux/services/serviceApi";
const { width, height } = Dimensions.get("window");

const CommentBottomSheet = ({ isVisible, hideBottomSheet, comment, editComment, deleteComment }) => {
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
    const navigation = useNavigation();
    const [reportComment, { data, error, isError, isSuccess, isLoading }] =
        useReportCommentMutation();
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


    const hideBottomSheet1 = () => {
        if (isUnMounted) return;
        setVisibleScreen("1");
        hideBottomSheet();
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(setAlert({ type: "comment", message: "Reported" }));
            if (!isUnMounted) {
                hideBottomSheet();
                setVisibleScreen("1");
            }
        }
        if (isError) {
            if (!isUnMounted) {
                dispatch(
                    setAlert({ type: "comment", message: "Opps! Please try again." })
                );
                hideBottomSheet();
                setVisibleScreen("1");
            }
        }
    }, [isSuccess, isError]);

    const submitReport = () => {
        if (reportText.trim() != "") {
            reportComment({
                comment_id: comment?._id,
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
                                    {comment?.author?._id.toString() === REDUXUSER?.user?._id.toString() ? (
                                        <>
                                            <TouchableOpacity style={{ padding: 10 }} onPress={editComment}>
                                                <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                                                    Edit
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ padding: 10 }} onPress={deleteComment}>
                                                <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                                                    Delete
                                                </Text>
                                            </TouchableOpacity>
                                        </>

                                    ): (
                                        <TouchableOpacity
                                            style={{ padding: 10 }}
                                            onPress={() => setVisibleScreen("2")}
                                        >
                                            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                                                Report
                                            </Text>
                                        </TouchableOpacity>
                                    )}
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
                                            setReportText("False Information");
                                            setVisibleScreen("3");
                                        }}
                                    >
                                        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                                            False Information
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ padding: 10 }}
                                        onPress={() => {
                                            setReportText("Hate Speech");
                                            setVisibleScreen("3");
                                        }}
                                    >
                                        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                                            Hate Speech
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ padding: 10 }}
                                        onPress={() => {
                                            if (isUnMounted) return;
                                            hideBottomSheet();
                                            setVisibleScreen("1");
                                            navigation.navigate("Report", {
                                                id: comment?._id,
                                                type: "comment",
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

export default CommentBottomSheet;

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

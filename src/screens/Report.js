import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { useState } from "react";
import { COLORS, FOITI_CONTS } from "../resources/theme";
import { ActivityIndicator } from "react-native";
import {
  useReportCommentMutation,
  useReportPostMutation,
  useReportUserMutation,
} from "../Redux/services/serviceApi";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../Redux/slices/alertSlice";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";

const Report = ({ route }) => {
  const { id, type } = route.params;
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [report, setReport] = useState("");
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [isUnMounted, setIsUnMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  const [reportPost, { isError, isSuccess, isLoading }] =
    useReportPostMutation();

  const [
    reportUser,
    {
      isLoading: userReportIsLoading,
      isError: userReportIsError,
      isSuccess: userReportIsSuccess,
    },
  ] = useReportUserMutation();

  const [
    reportComment,
    {
      isLoading: commentReportIsLoading,
      isError: commentReportIsError,
      isSuccess: commentReportIsSuccess,
    },
  ] = useReportCommentMutation();

  useEffect(() => {
    setIsUnMounted(false);
    return () => {
      setIsUnMounted(true);
    };
  }, []);

  //Enable Button on text change
  useEffect(() => {
    if (!isUnMounted) {
      if (report.trim().length > 5) {
        setDisabledSubmit(false);
      } else {
        setDisabledSubmit(true);
      }
    }
  }, [report]);

  //ON POST REPORT SUCCESS
  useEffect(() => {
    if (isSuccess) {
      dispatch(setAlert({ type: "post", message: "Reported" }));
      navigation.goBack();
    }
    if (isError) {
      dispatch(setAlert({ type: "post", message: "Opps! Please try again." }));
      navigation.goBack();
    }
  }, [isSuccess, isError]);

  //ON USER REPORT SUCCESS
  useEffect(() => {
    if (userReportIsSuccess) {
      dispatch(setAlert({ type: "user", message: "Reported" }));
      navigation.goBack();
    }
    if (userReportIsError) {
      dispatch(setAlert({ type: "user", message: "Opps! Please try again." }));
      navigation.goBack();
    }
  }, [userReportIsSuccess, userReportIsError]);

  //ON COMMENT REPORT SUCCESS
  useEffect(() => {
    if (commentReportIsSuccess) {
      dispatch(setAlert({ type: "comment", message: "Reported" }));
      navigation.goBack();
    }
    if (commentReportIsError) {
      dispatch(setAlert({ type: "comment", message: "Opps! Please try again." }));
      navigation.goBack();
    }
  }, [commentReportIsSuccess, commentReportIsError]);

  const handleSubmit = () => {
    if (type == "post") {
      reportPost({
        post_id: id,
        token: REDUXUSER.token,
        message: report,
      });
    }

    if (type == "user") {
      reportUser({
        user_id: id,
        token: REDUXUSER.token,
        message: report,
      });
    }

    if (type == "comment") {
      reportComment({
        comment_id: id,
        token: REDUXUSER.token,
        message: report,
      });
    }
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: FOITI_CONTS.padding }} showsVerticalScrollIndicator={false}>
        <PostPlaceHeader title="Report" isProfile={false} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="What are you willing to report about?"
          multiline={true}
          numberOfLines={10}
          maxLength={4000}
          onChangeText={(text) => {
            setErrorMsg("");
            setReport(text);
          }}
          style={styles.input}
        />
        <Text style={{ color: "red", fontSize: 11 }}>{errorMsg}</Text>
      </View>
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: disabledSubmit
                ? COLORS.foitiGreyLight
                : COLORS.foiti,
            },
          ]}
          disabled={isLoading || disabledSubmit || userReportIsLoading}
          onPress={handleSubmit}
        >
          {isLoading || userReportIsLoading || commentReportIsLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Report;

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 0.5,
    borderColor: COLORS.foitiGrey,
    textAlignVertical: "top",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  submitContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  submitButton: {
    backgroundColor: COLORS.foiti,
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 17,
  },
});

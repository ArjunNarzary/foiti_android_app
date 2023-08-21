import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { Fontisto } from "@expo/vector-icons";
import { COLORS } from "../resources/theme";
import { useCreateFeedbackMutation } from "../Redux/services/serviceApi";
import { useSelector } from "react-redux";
import { validateForm } from "../Redux/customApis/validator";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";

const Feedback = () => {
  const navigation = useNavigation();
  //STATES
  const [feedback, setFeedback] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  //REDUX USER
  const REDUXUSER = useSelector((state) => state.AUTHUSER);

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

  //API
  const [createFeedback, { data, error, isSuccess, isLoading, isError }] =
    useCreateFeedbackMutation();

  useEffect(() => {
    if (isSuccess) {
      setErrorMsg("");
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("Settings");
      }
    }
    if (isError) {
      setErrorMsg(error.data.message.feedback || error.data.message.general);
    }
  }, [isSuccess, isError]);

  //HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ feedback });
    if (checkForm.valid) {
      const body = {
        feedback,
        token: REDUXUSER.token,
      };

      await createFeedback(body);
    } else {
      setErrorMsg(checkForm.errors.feedback);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 7 }}>
        <PostPlaceHeader title="Feedback" isProfile={false} />
      </View>
      <View style={styles.container}>
        <View>
          <View style={styles.messageConatiner}>
            <Text>
              The app is still in beta version and we look forward to your
              feedback to improve the app in every way.
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Feedback"
              multiline={true}
              numberOfLines={5}
              maxLength={4000}
              onChangeText={(text) => {
                setErrorMsg("");
                setFeedback(text);
              }}
              style={styles.input}
            />
            <Text style={{ color: "red", fontSize: 11 }}>{errorMsg}</Text>
          </View>
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              disabled={isLoading}
              onPress={handleSubmit}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.iconContainer}>
            <Fontisto name="email" style={styles.icon} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={{ textAlign: "center" }}>Send us an email</Text>
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              support@foiti.com
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  inputContainer: {
    paddingVertical: 20,
  },
  input: {
    borderWidth: 0.5,
    borderColor: COLORS.foitiGrey,
    textAlignVertical: "top",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },

  submitContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  submitButton: {
    backgroundColor: COLORS.foiti,
    paddingHorizontal: 55,
    paddingVertical: 12,
    borderRadius: 21,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 150,
  },
  iconContainer: {
    backgroundColor: "#ededed",
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70 / 2,
  },
  icon: {
    fontSize: 35,
    color: COLORS.foitiGrey,
  },
  infoContainer: {
    paddingVertical: 15,
  },
});

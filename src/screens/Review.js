import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import Header from "../components/NewPlace/Header";
import { COLORS } from "../resources/theme";
import { Rating } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useBackHandler } from "@react-native-community/hooks";
import { validateForm } from "../Redux/customApis/validator";
import { useAddEditReviewMutation } from "../Redux/services/serviceApi";
import { useSelector } from "react-redux";
import ModalComponent from "../components/ModalComponent";
const { width, height } = Dimensions.get("screen");

const Review = ({ route }) => {
  const { place_id, place_name, post_id } = route.params;
  const navigation = useNavigation();
  const [postActive, setPostActive] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  //REDUX USER
  const REDUXUSER = useSelector((state) => state.AUTHUSER);

  // SERVER API CALL
  const [addEditReview, { data, error, isLoading, isError, isSuccess }] =
    useAddEditReviewMutation();

  useEffect(() => {
    if (rating > 0 && review != "") {
      setPostActive(true);
    } else {
      setPostActive(false);
    }
  }, [review, rating]);

  const ratingCompleted = (rating) => {
    setRating(rating);
  };

  const onSkip = () => {
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
  };

  //ON BACK PRESS
  useBackHandler(() => {
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
    return true;
  });

  const onPost = async () => {
    const checkForm = validateForm({ rating, review });
    if (checkForm.valid) {
      const data = { rating, review, token: REDUXUSER.token, place_id };
      await addEditReview(data);
    } else {
      setErrorMsg(checkForm.errors);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onSkip();
    }
    if (isError) {
      setModalVisible(true);
    }
    if (isLoading) {
      setPostActive(true);
    }
  }, [isError, isSuccess, isLoading]);

  const closeModal = () => {
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home Navigation" }],
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", height }}>
      {isLoading && (
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
      <Header
        backStatus={false}
        title="Review"
        activeStatus={postActive}
        onPost={onPost}
      />
      <View>
        <ScrollView style={{ paddingHorizontal: 10 }} showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View>
              <Text>
                This is your first ever post of{" "}
                <Text style={{ fontWeight: "bold" }}>{place_name}.</Text> Your
                review would help the community.
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                How would you rate your experience?
              </Text>
              <View style={{ justifyContent: "flex-start" }}>
                <Rating
                  type="custom"
                  startingValue={0}
                  ratingCount={5}
                  ratingColor="#19AA99"
                  ratingBackgroundColor={COLORS.foitiDisabled}
                  tintColor="#fff"
                  style={{
                    BackgroundColor: "#fff",
                    alignItems: "flex-start",
                  }}
                  onFinishRating={ratingCompleted}
                  imageSize={30}
                />
              </View>
            </View>
            <View style={styles.reviewContainer}>
              <Text style={{ fontWeight: "bold" }}>Write Your Review</Text>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder={`The world is waiting for your review, share the experience you had in ${place_name}`}
                  multiline={true}
                  numberOfLines={5}
                  onChangeText={(text) => setReview(text)}
                />
              </View>
              <Text style={{ color: "red", fontSize: 12 }}>
                {errorMsg.rating || errorMsg.review}
              </Text>
            </View>
          </View>
          <View style={styles.skipContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={{ fontWeight: "bold", color: COLORS.foitiGrey }}>Skip</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <ModalComponent
        body="Opps! Something went wrong. Please try again later."
        closeModal={closeModal}
        modalVisible={modalVisible}
        hasButton={true}
      />
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    minHeight: height - 130,
  },
  contributionContainer: {
    paddingVertical: 20,
    marginBottom: 20,
  },
  contributionText: {
    color: COLORS.foitiGreyLight,
    fontStyle: "italic",
  },
  ratingContainer: {
    paddingVertical: 30,
    marginBottom: 10,
  },
  reviewContainer: {
    paddingVertical: 10,
  },
  input: {
    marginTop: 10,
    textAlignVertical: "top",
  },
  skipContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  skipButton: {
    backgroundColor: COLORS.foitiGreyLight,
    paddingHorizontal: 30,
    paddingVertical: 7,
    borderRadius: 3,
    marginBottom: 20,
    borderRadius: 30
  },
});

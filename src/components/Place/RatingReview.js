import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  TouchableOpacityBase,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { Rating } from "react-native-elements";
import { COLORS } from "../../resources/theme";

const RatingReview = ({ rating, totalRating }) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback>
        <View style={styles.ratingContainer}>
          <Text>{rating}</Text>
          <View>
            <Rating
              type="custom"
              fractions={1}
              startingValue={rating}
              ratingColor="#19AA99"
              ratingBackgroundColor={COLORS.foitiDisabled}
              tintColor="#fff"
              style={{ BackgroundColor: "#fff" }}
              readonly
              imageSize={20}
            />
          </View>
          <Text>({totalRating})</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.reviewContainer}>
        <TouchableOpacity>
          <Text>Write a review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RatingReview;

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewContainer: {
    marginLeft: 20,
  },
});

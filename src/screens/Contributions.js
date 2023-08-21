import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useContribututionsQuery } from "../Redux/services/serviceApi";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import ServerError from "../components/Error/ServerError";
import { COLORS } from "../resources/theme";
import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");

const Contributions = ({ route }) => {
  const user = route.params.user;
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const { data, isLoading, isError, isSuccess, refetch } =
    useContribututionsQuery({ token: REDUXUSER?.token, user_id: user?._id });
  const [contributions, setContributions] = useState({});
  const [isMounted, setIsMounted] = useState(true);

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

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (isSuccess) {
        setContributions(data.contribution);
      }
    }
  }, [isSuccess, isError]);

  const reload = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <PostPlaceHeader title="Contributions" />
      {isSuccess ? (
        <View style={{ padding: 20 }}>
          <Text>
            Here you will see the total number of contributions made by{" "}
            <Text style={{ fontWeight: "bold" }}>
              {user._id.toString() != REDUXUSER?.user?._id.toString()
                ? user.name
                : "you"}
            </Text>{" "}
            to the community.
          </Text>
          {/* TABLE */}
          <View style={styles.tableContainer}>
            {/* ROW */}
            <View style={styles.row}>
              <View style={styles.col1}>
                <Text style={{ fontWeight: "bold" }}>Photos</Text>
              </View>
              <View style={styles.col2}>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {contributions?.photos?.length || 0}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.col1, styles.col1Rest]}>
                <Text style={{ fontWeight: "bold" }}>
                  Photos with coordinates
                </Text>
              </View>
              <View style={[styles.col2, styles.col2Rest]}>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {contributions?.photos_with_coordinates?.length || 0}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.col1, styles.col1Rest]}>
                <Text style={{ fontWeight: "bold" }}>Places added</Text>
              </View>
              <View style={[styles.col2, styles.col2Rest]}>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {contributions?.added_places?.length || 0}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.col1, styles.col1Rest]}>
                <Text style={{ fontWeight: "bold" }}>Reviews</Text>
              </View>
              <View style={[styles.col2, styles.col2Rest]}>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {contributions?.reviews?.length || 0}
                </Text>
              </View>
            </View>
            {/* <View style={styles.row}>
              <View style={[styles.col1, styles.col1Rest]}>
                <Text style={{ fontWeight: "bold" }}>
                  Reviews with 250+ characters
                </Text>
              </View>
              <View style={[styles.col2, styles.col2Rest]}>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {contributions?.review_200_characters?.length || 0}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.col1, styles.col1Rest]}>
                <Text style={{ fontWeight: "bold" }}>Ratings</Text>
              </View>
              <View style={[styles.col2, styles.col2Rest]}>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  {contributions?.ratings?.length || 0}
                </Text>
              </View>
            </View> */}
          </View>
        </View>
      ) : (
        <ServerError onPress={reload} />
      )}
    </View>
  );
};

export default Contributions;

const styles = StyleSheet.create({
  tableContainer: {
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  col1: {
    width: "80%",
    borderWidth: 1,
    borderColor: COLORS.foitiGrey,
    padding: 6,
  },
  col1Rest: {
    borderTopWidth: 0,
  },
  col2: {
    width: "20%",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: COLORS.foitiGrey,
    textAlign: "center",
    padding: 6,
  },
  col2Rest: {
    borderTopWidth: 0,
  },
});

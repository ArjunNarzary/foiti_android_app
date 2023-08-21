import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserDetails from "../components/UserDetails";
import { COLORS, FOITI_CONTS } from "../resources/theme";
import { useSelector } from "react-redux";
import { useViewFollowersFollowingListQuery } from "../Redux/services/serviceApi";
import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";

const Following = ({ route }) => {
  const { ownerId } = route.params;
  const navigation = useNavigation();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const [followingUser, setFollowingUser] = useState([]);

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

  const { data, isSuccess, isError, isLoading, refetch } =
    useViewFollowersFollowingListQuery({
      userId: ownerId,
      token: REDUXUSER.token,
    });

  useEffect(() => {
    if (isSuccess) {
      setFollowingUser(data?.owner?.following);
    }
  }, [isSuccess, isError]);

  const renderData = ({ item }) => {
    return (
      <View style={{ marginBottom: 15 }}>
        <UserDetails
          isFollwerScreen={true}
          details={item}
          profileUri={item?.profileImage?.thumbnail?.private_id}
        />
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <>
        {isLoading ? (
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <ActivityIndicator color={COLORS.foiti} size="large" />
          </View>
        ) : (
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <Text>You have not followed any user yet.</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: FOITI_CONTS.padding + 5 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={followingUser}
        renderItem={renderData}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingVertical: 10 }}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

export default Following;

const styles = StyleSheet.create({});

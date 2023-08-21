import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import UserDetails from "../components/UserDetails";
import { COLORS } from "../resources/theme";
import {
  useUnblockUserMutation,
  useUserBlockListQuery,
} from "../Redux/services/serviceApi";
import { useSelector } from "react-redux";
import { useBackHandler } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import ServerError from "../components/Error/ServerError";
const { width, height } = Dimensions.get("screen");

const BlockedUsers = () => {
  const navigation = useNavigation();
  const [blockedUser, setBlockedUser] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const [isUnmounted, setIsUnmounted] = useState(false);

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
    setIsUnmounted(false);
    return () => setIsUnmounted(true);
  }, []);

  const { data, isSuccess, isError, isLoading, refetch } =
    useUserBlockListQuery(
      { token: REDUXUSER.token },
      { refetchOnMountOrArgChange: true }
    );

  const [
    unblockUser,
    {
      data: unBlockData,
      isSuccess: unBlockIsSuccess,
      isError: unBlockIsError,
      isLoading: unBlockIsLoading,
    },
  ] = useUnblockUserMutation();

  useEffect(() => {
    if (isSuccess && !isUnmounted) {
      setBlockedUser(data?.user?.blocked_users);
      setIsRefreshing(false);
    }

    if (isError && !isUnmounted) {
      setIsRefreshing(false);
    }
  }, [isSuccess, isError]);

  const reload = () => {
    refetch();
  };

  const _onRefresh = () => {
    setIsRefreshing(true);
    reload();
  };

  const handleUnBlock = (id) => {
    if (id && id != REDUXUSER?.user?._id) {
      const body = {
        token: REDUXUSER?.token,
        user_id: id,
      };

      unblockUser(body);
    }
  };

  useEffect(() => {
    if (unBlockIsSuccess && !isUnmounted) {
      setBlockedUser(unBlockData?.updatedUser?.blocked_users);
    }
  }, [unBlockIsSuccess, unBlockIsError]);

  const renderData = ({ item }) => {
    return (
      <View style={{ marginBottom: 15 }}>
        <UserDetails
          isBlockList={true}
          showLoading={unBlockIsLoading}
          handleUnBlock={handleUnBlock}
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
            <Text>No blocked users.</Text>
          </View>
        )}
      </>
    );
  };

  if (isLoading && !isRefreshing) {
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
    <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal:7 }}>
      <PostPlaceHeader title="Blocked Users " />
      {!isError || !unBlockIsError ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={blockedUser}
          renderItem={renderData}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ paddingVertical: 15, paddingHorizontal:8 }}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={isRefreshing}
          //     progressViewOffset={50}
          //     onRefresh={_onRefresh}
          //     tintColor={"#f8852d"}
          //   />
          // }
        />
      ) : (
        <View>
          <ServerError onPress={reload} />
        </View>
      )}
    </View>
  );
};

export default BlockedUsers;

const styles = StyleSheet.create({});

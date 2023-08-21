import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteNotificationMutation,
  useGetAllInAppNotificationMutation,
  useMarkAllNotificationReadMutation,
  useReadInAppNotificationMutation,
} from "../Redux/services/serviceApi";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import ServerError from "../components/Error/ServerError";
import moment from "moment";
import { COLORS } from "../resources/theme";
import { useNavigation } from "@react-navigation/native";
import { BottomSheet, ListItem } from "react-native-elements";
import ModalComponent from "../components/ModalComponent";
import { addNotifications } from "../Redux/slices/addNotificationSlice";
import { useDispatch } from "react-redux";
const { width, height } = Dimensions.get("window");
import { useBackHandler } from "@react-native-community/hooks";

const InAppNotification = () => {
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const [notification, setNotification] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(20);
  const [noMoreData, setNoMoreData] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      console.log("Not back pressed");
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home Navigation" }],
      });
    }
    return true;
  });

  const [
    getAllInAppNotification,
    { data, isSuccess, isError, error, isLoading, refetch },
  ] = useGetAllInAppNotificationMutation({
    refetchOnMountOrArgChange: true,
  });

  const [readInAppNotification, {}] = useReadInAppNotificationMutation();
  const [deleteNotification, {}] = useDeleteNotificationMutation();
  const [
    markAllNotificationRead,
    { data: readData, isLoading: readIsLoading },
  ] = useMarkAllNotificationReadMutation();

  useEffect(() => {
    setIsUnmounted(false);
    setFirstFetch(true);
    (async () => {
      await getAllInAppNotification({
        token: REDUXUSER?.token,
        skip: 0,
        limit,
      });
    })();
    return () => {
      setIsUnmounted(true);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && !isUnmounted) {
      setNotification([...notification, ...data.allNotification]);
      setSkip(data.skipData);
      if (data.allNotification < 20) {
        setNoMoreData(true);
      }
      setFirstFetch(false);
      dispatch(addNotifications({ notification: 0 }));
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (!isLoading) {
      if (loadingMore) {
        setLoadingMore(false);
      }
      if (isRefreshing) {
        setIsRefreshing(false);
      }
    }
  }, [isLoading]);

  //RELOAD
  const reload = () => {
    if (isUnmounted) return;
    setNotification([]);
    setNoMoreData(false);
    setFirstFetch(true);
    getAllInAppNotification({
      token: REDUXUSER?.token,
      skip: 0,
      limit,
    });
    setFirstFetch(false);
  };
  const _onRefresh = async () => {
    if (isUnmounted) return;
    setNotification([]);
    setNoMoreData(false);
    setFirstFetch(true);
    setIsRefreshing(true);
    await getAllInAppNotification({
      token: REDUXUSER?.token,
      skip: 0,
      limit,
    });
    setIsRefreshing(false);
    setFirstFetch(false);
  };

  const _getNewMoreNotification = async () => {
    if (!noMoreData && !isUnmounted) {
      setLoadingMore(true);
      await getAllInAppNotification({
        token: REDUXUSER?.token,
        skip,
        limit,
      });
    }
  };

  //SHOW BOTTOM SHEET
  const showBottomSheet = () => {
    setIsVisible(true);
  };

  //MARK ALL AS READ
  const markAllRead = async () => {
    markAllNotificationRead({ token: REDUXUSER.token });
    const newNotification = notification.map((noti) => {
      if (noti.status != "read") {
        return { ...noti, status: "read" };
      }
      return noti;
    });
    setNotification(newNotification);
    setIsVisible(false);
  };

  //DELETE NOTIFICATION AND CLOSE MODAL
  const closeModal = () => {
    if (activeNotification == null) {
      setModalVisible(false);
      return true;
    }
    const body = {
      token: REDUXUSER.token,
      notification: activeNotification,
    };

    deleteNotification(body);
    const newNotification = notification.filter((noti) => {
      if (noti._id != activeNotification) {
        return noti;
      }
    });

    setNotification(newNotification);

    setModalVisible(false);
  };

  //HEADER
  const FlatListHeader = ({ showBottomSheet }) => {
    return (
      <PostPlaceHeader
        title="Notification"
        isNotification={true}
        markAllRead={showBottomSheet}
      />
    );
  };

  const NotificationConatiner = ({ item }) => {
    let image = "";
    if (item.type === "new_post" || item.type === "like") {
      image = item?.post?.content[0]?.image?.thumbnail?.private_id;
    } else {
      image =
        item?.action_taken_by?.profileImage?.thumbnail?.private_id ||
        "profile_picture.jpg";
    }
    //FORMATE DATA
    const formatted = moment(item.createdAt).fromNow();
    // const formatted = moment(item.createdAt).format("MMM Do YY, h:mm:ss a");

    //Handle Notification Pressed
    const handleNotificationPressed = (item) => {
      const body = {
        token: REDUXUSER.token,
        notification: item._id,
      };
      readInAppNotification(body);
      const newNotification = notification.map((noti) => {
        if (noti._id === item._id) {
          return { ...noti, status: "read" };
        }
        return noti;
      });

      setNotification(newNotification);

      if (item.type === "follow") {
        let routeName = "";
        if (REDUXNAVIGATION?.name === "home") {
          routeName = "FollowDetails via home";
        } else {
          routeName = "FollowDetails via explore";
        }

        navigation.push(routeName, {
          name: REDUXUSER?.user?.name,
          ownerId: REDUXUSER?.user?._id,
          initialRoute: "Followers",
        });
      }else if (item.type === "chat") {
        let routeName = "";
        if (REDUXNAVIGATION?.name === "home") {
          routeName = "Chat via home";
        } else {
          routeName = "Chat via explore";
        }

        navigation.push(routeName);
      } else {
        if (item.post == undefined || item.post == null) {
          setActiveNotification(item._id);
          setModalVisible(true);
        } else {
          navigation.push(`Post via ${REDUXNAVIGATION?.name}`, {
            post: item?.post?._id,
          });
        }
      }
    };

    return (
      <TouchableOpacity onPress={() => handleNotificationPressed(item)}>
        <View
          style={[
            styles.container,
            item.status != "read" && styles.unreadBackground,
          ]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `${process.env.BACKEND_URL}/image/${image}`,
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.mainContainer}>
            <Text style={{ width: width - 90 }}>
              <Text style={{ fontWeight: "bold" }}>
                {item.action_taken_by?.name}{" "}
              </Text>
              {item.message}
            </Text>
            <Text>{formatted}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //RENDER FOOTER
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View
        style={{
          paddingVertical: 10,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  };

  const renderEmptyList = () => {
    // if (isRefreshing) return;
    return (
      <View
        style={{
          paddingTop: 40,
          height,
        }}
      >
        {(!isLoading && !isRefreshing) ?? (
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            No post to show
          </Text>
        )}
      </View>
    );
  };

  return (
    <>
      {isSuccess || isLoading || readIsLoading ? (
        <>
          {(isLoading && firstFetch) || readIsLoading ? (
            <View
              style={{
                position: "absolute",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height,
                width,
              }}
            >
              <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
          ) : (
            <>
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View>
                  <FlatList
                    contentContainerStyle={{ paddingHorizontal: 4 }}
                    ListHeaderComponent={
                      <FlatListHeader showBottomSheet={showBottomSheet} />
                    }
                    showsVerticalScrollIndicator={false}
                    data={notification}
                    renderItem={(item) => (
                      <NotificationConatiner item={item.item} />
                    )}
                    ListEmptyComponent={renderEmptyList}
                    refreshControl={
                      <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={_onRefresh}
                        tintColor={"#f8852d"}
                      />
                    }
                    keyExtractor={(item, index) => index}
                    onEndReachedThreshold={0.5}
                    onEndReached={_getNewMoreNotification}
                    ListFooterComponent={renderFooter}
                  />
                </View>
                <BottomSheet isVisible={isVisible}>
                  <TouchableOpacity
                    style={{
                      width,
                      height: height - StatusBar.currentHeight,
                      alignItems: "baseline",
                    }}
                    onPress={() => setIsVisible(false)}
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
                      }}
                    >
                      <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={markAllRead}
                      >
                        <Text
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Mark all as read
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </BottomSheet>
              </View>
              <ModalComponent
                body={"This post has been removed by the owner"}
                closeModal={closeModal}
                modalVisible={modalVisible}
                hasButton={true}
              />
            </>
          )}
        </>
      ) : (
        <ServerError onPress={reload} />
      )}
    </>
  );
};

export default InAppNotification;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginVertical: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    marginRight: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBackground: {
    backgroundColor: "#faf7f7",
  },
  mainContainer: {},
  text: {},
});

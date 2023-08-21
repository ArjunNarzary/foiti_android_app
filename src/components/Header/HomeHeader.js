import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { images, STYLES, COLORS } from "resources";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setBSVisibility } from "../../Redux/slices/bottomSheetVisibilitySlice";

const HomeHeader = ({ messagePressed, inAppNotCount, openNotification, hasUnreadMsg }) => {
  const REDUXNOTIFICATION = useSelector((state) => state.CURRENTNOTIFICATIONS);
  const dispatch = useDispatch();

  return (
    <View style={styles.header}>
      <View>
        <Image source={images.logo} style={STYLES.headerLogo} />
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => dispatch(setBSVisibility({ type: "profile", visible: true }))}>
          <Feather name="plus-circle" style={styles.icons} />
        </TouchableOpacity>

        <TouchableOpacity onPress={messagePressed}>
          {hasUnreadMsg && (
            <View style={styles.notificationCount}></View>
          )}
          <View style={{ zIndex: 10 }}>
          <Ionicons name="chatbubble-ellipses-outline" style={styles.icons} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={openNotification}>
          {REDUXNOTIFICATION.notifications > 0 && (
            <View style={styles.notificationCount}></View>
          )}
          <View style={{ zIndex: 10 }}>
            <Ionicons name="notifications-outline" style={styles.icons} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 10,
    // borderBottomWidth: 0.5,
    // borderBottomColor: "red",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconContainer: {
    flex:1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  icons: {
    zIndex: 40,
    elevation: 10,
    fontSize: 25,
    color: "#000",
    marginHorizontal: 8,
  },
  notificationCount: {
    height: 12,
    width: 12,
    position: "absolute",
    top: -1,
    right: 8,
    backgroundColor: COLORS.foiti,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15 / 2,
    zIndex: 20,
  },
});

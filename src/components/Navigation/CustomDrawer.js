import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import { DrawerContentScrollView } from "@react-navigation/drawer";
import { COLORS } from "resources";
import NavButton from "./NavButton";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";;
import { BACKEND_URL } from "@env";
import { setBSVisibility } from "../../Redux/slices/bottomSheetVisibilitySlice";

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);
  let profileImage = "";
  if (REDUXUSER?.user?.profileImage?.large?.private_id != undefined) {
    profileImage = `${BACKEND_URL}/image/${REDUXUSER?.user?.profileImage?.large?.private_id}`;
  } else {
    profileImage = `${BACKEND_URL}/image/profile_picture.jpg`;
  }

  // const openImagePickerAsync = async () => {
  //   const imageData = await openPickerFunction();
  //   if (!imageData?.status) return;
  //   dispatch(
  //     addImages({
  //       images: imageData.image,
  //     })
  //   );

  //   navigation.navigate("New Post");
  // };

  const handlelogout = async () => {
    navigation.push("LogoutScreen");
  };

  const openCustomBrowser = async (link, title) => {
    navigation.navigate("WebViewScreen", { link, title });
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 10,
            paddingBottom: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: COLORS.foitiGreyLight,
          }}
        >
          <TouchableWithoutFeedback
          // onPress={() => navigation.navigate("Profile")}
          >
            <View style={{ marginLeft: 10 }}>
              <Image
                source={{
                  uri: profileImage,
                }}
                style={styles.avatar}
              />
              <Text style={styles.name}>
                {REDUXUSER?.user?.name}
                {REDUXUSER?.user?.foiti_ambassador && (
                  <MaterialCommunityIcons
                    name="shield-check"
                    style={{
                      color: COLORS.foiti,
                      fontSize: 20,
                    }}
                  />
                )}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: COLORS.foitiGreyLight,
          }}
        >
          <NavButton
            icon={
              <Feather
                name="plus-circle"
                style={[styles.contents, { marginRight: 10 }]}
              />
            }
            title="New"
            onTab={() => {
              dispatch(setBSVisibility({ type: "profile", visible: true }))
            }}
          />
          {/* <NavButton
            icon={<FontAwesome5 name="hiking" style={[styles.contents, { marginRight: 10 }]} />}
            title="Trip Plans"
            isFA={true}
            onTab={() => {
              // navigation.push(`TripPlanList via ${REDUXNAVIGATION.name}`, { trips: userData.tripPlans })
              navigation.push(`TripPlanList via ${REDUXNAVIGATION?.name}`)
              // dispatch(setBSVisibility({ type: "profile", visible:true}))
            }}
          /> */}
          <NavButton
            // icon={<MaterialCommunityIcons name="bookmark" style={[styles.contents, { marginRight: 10 }]} />}
            icon={
              <MaterialCommunityIcons
                name="book-marker"
                style={[styles.contents, { marginRight: 10 }]}
              />
            }
            title="Bucket List"
            isFA={true}
            onTab={() => navigation.navigate("SavedPost via profile")}
          />
          <NavButton
            // icon="bell"
            icon={
              <Feather
                name="bell"
                style={[styles.contents, { marginRight: 10 }]}
              />
            }
            title="Notifications"
            onTab={() => navigation.navigate("Notification")}
          />
          <NavButton
            // icon="settings"
            icon={
              <MaterialIcons
                name="settings"
                style={[styles.contents, { marginRight: 10 }]}
              />
            }
            title="Settings"
            onTab={() => navigation.navigate("Settings")}
          />
        </View>
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={{ paddingVertical: 5 }}
            onPress={() =>
              openCustomBrowser("https://foiti.com/cg", "Community Guidelines")
            }
          >
            <Text style={{ color: COLORS.foitiGrey }}>
              Community Guidelines
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 5 }}
            onPress={() =>
              openCustomBrowser("https://foiti.com/tou", "Terms of Service")
            }
          >
            <Text style={{ color: COLORS.foitiGrey }}>Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 5 }}
            onPress={() =>
              openCustomBrowser("https://foiti.com/privacy", "Privacy Policy")
            }
          >
            <Text style={{ color: COLORS.foitiGrey }}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 5 }}
            onPress={() => navigation.navigate("Feedback")}
          >
            <Text style={{ color: COLORS.foitiGrey }}>Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 5 }}
            onPress={() => navigation.navigate("HelpSupport")}
          >
            <Text style={{ color: COLORS.foitiGrey }}>Help Center</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
        >
          {/* <NavButton title="Log Out" onTab={handlelogout} /> */}
          <TouchableOpacity
            style={{ paddingVertical: 12 }}
            onPress={handlelogout}
          >
            <Text
              style={{
                color: COLORS.foitiGrey,
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  )
};

export default CustomDrawer;

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
  },
  name: {
    paddingVertical: 2,
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    color: COLORS.foitiGrey,
  },
  contents: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

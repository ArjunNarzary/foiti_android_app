import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  SimpleLineIcons,
  MaterialCommunityIcons,
  Entypo
} from "@expo/vector-icons";
import { COLORS } from "../../resources/theme";
import ReadMore from "@fawazahmed/react-native-read-more";
import * as WebBrowser from "expo-web-browser";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useRemoveCurrentLocationMutation } from "../../Redux/services/serviceApi";
import moment from "moment";

const Details = ({ showInstruction, userData }) => {
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const navigation = useNavigation();
  const [stripLink, setStripLink] = useState("");
  const [genderAge, setGenderAge] = useState("");
  const [removeCurrentAddress, { data, isLoading, isError }] =
    useRemoveCurrentLocationMutation();

  useEffect(() => {
    if (
      userData?.user?.website != undefined &&
      userData?.user?.website != null
    ) {
      let strip = userData.user.website.replace(/^https?:\/\//i, "");
      setStripLink(strip.replace(/^http?:\/\//i, ""));
    }

    //Format gender and dob
    const detailArr = [];
    if (userData?.user?.dob) {
      const age = Math.floor(moment().diff(userData?.user?.dob, 'years', true));
      detailArr.push(age);
    }

    if (userData?.user?.gender) {
      const gender = userData?.user?.gender;
      const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1);
      detailArr.push(capitalizedGender);
    }

    let converToString = ""
    if (detailArr.length > 0) {
      converToString = detailArr.join(', ');
    }
    setGenderAge(converToString);

  }, [userData]);

  const openWebBrowser = async (link) => {
    if (/^http/.test(link)) {
      await WebBrowser.openBrowserAsync(link);
    } else {
      await WebBrowser.openBrowserAsync("http://" + link);
    }
  };

  const openContribution = () => {
    navigation.push(`Contribution via ${REDUXNAVIGATION.name}`, {
      user: userData?.user,
    });
  };

  const openPlacesVisited = () => {
    navigation.push(`PlacesVisited via ${REDUXNAVIGATION.name}`, {
      user: userData?.user,
    });
  };
  //FORMATE ADDRESS
  let userAddress = "";
  if(userData?.user?.place?._id){
    userAddress = userData.user?.place?.local_address || userData.user?.place?.short_address || "";
    // userAddress = userData?.user?.place?.name + address;
  }else{
    if (
      userData.user?.address?.name != undefined &&
      userData.user?.address?.name != ""
    ) {
      let arr = [];
      arr.push(userData.user?.address?.name);
      if (userData.user?.address?.administrative_area_level_1 != undefined &&
        userData.user?.address?.administrative_area_level_1 != ""){
        arr.push(userData.user?.address?.administrative_area_level_1);
        }
      else if (
        userData.user?.address?.country != undefined &&
        userData.user?.address?.country != ""
      ) {
        arr.push(userData.user?.address?.country);
      }
      if (arr.length > 0) {
        userAddress = arr.join(", ");
      }
    }
  }



  //NAVIGATION TO ADD ADDRESS
  const navigateToAddCurrentLocation = () => {
    navigation.navigate("Add Place Location", {
      prev_screen: "addCurrentAddress",
    });
  };

  //REMOVE CURRENT LOCATION
  const handleRemoveCurrentAddress = () => {
    removeCurrentAddress({ token: REDUXUSER.token });
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 5 }}>
        {userData?.user?.name}
      </Text>
      {/* <Text style={{ lineHeight: 15 }}>@{user.username}</Text> */}
      {/* SHOW BELOW LINE ONLY ON PROFILE */}
      {userData?.user?.foiti_ambassador && (
        <TouchableOpacity
          onPress={showInstruction}
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="shield-check"
            style={{ color: COLORS.foiti, fontSize: 15 }}
          />
          <Text
            style={{ color: COLORS.foiti, fontWeight: "bold", marginLeft: 2 }}
          >
            Foiti Ambassador
          </Text>
        </TouchableOpacity>
      )}
      <View style={{ paddingVertical: 6 }}>
        {(genderAge || userAddress) ? (
          <View style={styles.genderAddress}>
            {genderAge ? <Text style={{ fontWeight: 'bold' }}>{genderAge}</Text> : null}
            {(genderAge && userAddress) ? <Entypo name="dot-single" style={{ fontSize:20 }} /> : null}
            {userAddress ? <Text style={{ fontWeight: 'bold' }}>{userAddress}</Text> : null}
          </View>
        ) : null}
        {(userData?.user?.bio != "" && userData?.user?.bio != undefined) ? (
          <View style={{ paddingBottom: 6 }}>
            <ReadMore
              numberOfLines={3}
              seeMoreText="more"
              seeMoreStyle={{ color: COLORS.foitiGrey }}
              seeMoreContainerStyleSecondary={{ position: 'relative' }}
              expandOnly={true}
            >
              <Text>{userData.user?.bio}</Text>
            </ReadMore>
          </View>
        ) : null}
        {userData?.user?.website !== undefined &&
          userData?.user?.website != "" && (
            <View style={{ paddingBottom: 2, paddingRight: 20 }}>
              <TouchableOpacity
                onPress={async () => openWebBrowser(userData.user?.website)}
              >
                <View style={styles.currentContainer}>
                  <Text
                    style={{ color: COLORS.foitiLink }}
                    numberOfLines={1}
                  >
                    {stripLink}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        <View>
          {parseInt(userData?.user?.total_contribution) > 0 && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={openContribution}>
                <Text>
                  Made{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {userData?.user?.total_contribution}
                  </Text>{" "}
                  {userData?.user?.total_contribution > 1
                    ? "Contributions"
                    : "Contribution"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {(userData?.countryVisited != 0 || userData?.placesVisited != 0) && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={openPlacesVisited}>
                <View style={styles.visitedContainer}>
                  <Text>Visited </Text>
                  {userData?.countryVisited != 0 && (
                    <>
                      {/* <TouchableOpacity> */}
                      <Text style={{ fontWeight: "bold" }}>
                        {userData.countryVisited}
                      </Text>
                      {/* </TouchableOpacity> */}
                      <Text>
                        {userData.countryVisited > 1
                          ? " Countries"
                          : " Country"}
                      </Text>
                      <Text> and </Text>
                    </>
                  )}
                  {userData?.placesVisited != 0 && (
                    // <TouchableOpacity onPress={openPlacesVisited}>
                    <Text style={{ fontWeight: "bold" }}>
                      {userData.placesVisited}{" "}
                      <Text style={{ fontWeight: "normal" }}>
                        {userData.placesVisited > 1 ? "Places" : "Place"}
                      </Text>
                    </Text>
                    // </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {userData?.helpNavigate != 0 && (
            <View style={styles.visitedContainer}>
              {/* <Text>Helped Navigate </Text> */}
              <TouchableOpacity>
                <Text>
                  Helped With{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {userData.helpNavigate}
                  </Text>{" "}
                  {userData.helpNavigate > 1 ? "Navigations" : "Navigation"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {userData?.user?.currently_in?.name !== undefined ? (
        <View style={{ marginTop: 6, width: "100%" }}>
          <Text>Currently in</Text>
          <View
            style={[
              styles.currentContainer,
              { justifyContent: "flex-start" },
            ]}
          >
            <View
              style={[
                styles.currentContainer,
                userData?.user?._id?.toString() ===
                REDUXUSER?.user?._id?.toString()
                  ? styles.ownWidth
                  : styles.otherWidth,
              ]}
            >
              {/* <SimpleLineIcons
                name="location-pin"
                style={{ color: COLORS.foitiGrey }}
              /> */}
              <Text
                style={{
                  fontWeight: "bold",
                  color: COLORS.foiti,
                  // marginLeft: 2,
                }}
                numberOfLines={1}
              >
                {userData?.user?.currently_in?.name}
                {userData?.user?.currently_in?.formattedAddress}
              </Text>
            </View>
            {userData?.user?._id?.toString() ===
              REDUXUSER?.user?._id?.toString() && (
              <TouchableOpacity
                onPress={handleRemoveCurrentAddress}
                style={{ paddingLeft: 10 }}
                disabled={isLoading ? true : false}
              >
                <Text style={{ color: COLORS.foitiGrey }}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <>
          {userData?.user?._id?.toString() ===
            REDUXUSER?.user?._id?.toString() && (
            <View style={{ marginTop: 6, flexDirection: "row" }}>
              <TouchableOpacity onPress={navigateToAddCurrentLocation}>
                <View style={styles.currentContainer}>
                  {/* <SimpleLineIcons
                    name="location-pin"
                    style={{ color: "#000" }}
                  /> */}
                  <Text style={{ fontWeight: "bold" }}>
                    Add current location
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  visitedContainer: {
    flexDirection: "row",
  },
  currentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownWidth: {
    maxWidth: "82%",
  },
  otherWidth: {
    maxWidth: "95%",
  },
  genderAddress:{
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems:"center",
    paddingBottom: 6
  }
});

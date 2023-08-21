import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { CheckBox } from 'react-native-elements'
import Collapsible from 'react-native-collapsible';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons"

import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import CoverProfile from "../components/Profile/CoverProfile";
import { COLORS, FOITI_CONTS } from "../resources/theme";
import {
  useEditProfileMutation,
  useUploadCoverImageMutation,
  useUploadProfileImageMutation,
} from "../Redux/services/serviceApi";
import { addUser } from "../Redux/slices/authSlice";
import { setItemInStore, subtractYears } from "../utils/handle";
import { removeAddress } from "../Redux/slices/addAddressSlice";
import ServerError from "../components/Error/ServerError";
import { validateForm } from "../Redux/customApis/validator";
import { useBackHandler } from "@react-native-community/hooks";
import { removePlaceData } from "../Redux/slices/addPlaceSlice";
import LanguageModal from "../components/LanguageModal";

const { width, height } = Dimensions.get("screen");

const EditProfile = () => {
  const navigation = useNavigation();
  //REDUX STORE DATA
  const dispatch = useDispatch();
  const REDUXDATA = useSelector((state) => state.ADD_ADDRESS);
  const REDUXADDRESSDATA = useSelector((state) => state.NEWPLACE);
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  //STATES
  const [name, setName] = useState(REDUXUSER.user.name);
  const [bio, setBio] = useState(REDUXUSER.user.bio);
  const [website, setWebsite] = useState(REDUXUSER.user.website);
  const [address, setAddress] = useState("");
  const [coverImage, setCoverImage] = useState(
    REDUXUSER.user.coverImage?.large?.private_id
  );
  const [profileImage, setProfileImage] = useState(
    REDUXUSER.user.profileImage?.large?.private_id
  );
  const [gender, setGender] = useState(REDUXUSER?.user?.gender || "");
  const [dob, setDob] = useState(REDUXUSER?.user?.dob || "");
  const [isCollapsed, setIsCollapsed] = useState(true)
  // const [aboutMe, setAboutMe] = useState(REDUXUSER?.user?.about_me || "");
  const [meetupReason, setMeetupReason] = useState(REDUXUSER?.user?.meetup_reason || "");
  const [interests, setInterests] = useState(REDUXUSER?.user?.interests || "");
  const [education, setEducation] = useState(REDUXUSER?.user?.education || "");
  const [occupation, setOccupation] = useState(REDUXUSER?.user?.occupation || "");
  const [languages, setLanguages] = useState(REDUXUSER?.user?.languages || []);
  const [movieBookMusic, setMovieBookMusic] = useState(REDUXUSER?.user?.movies_books_music);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [errorMsg, setErrorMsg] = useState({});
  const [serverError, setServerError] = useState(false);

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

  //SERVER API
  const [editProfile, { data, error, isSuccess, isError, isLoading }] =
    useEditProfileMutation();
  const [
    uploadProfileImage,
    {
      data: uploadProfileData,
      error: uploadProfileErrorData,
      isError: uploadProfileError,
      isSuccess: uploadProfileSuccess,
      isLoading: uploadProfileLoading,
    },
  ] = useUploadProfileImageMutation();

  const [
    uploadCoverImage,
    {
      data: uploadCoverData,
      isError: uploadCoverError,
      isSuccess: uploadCoverSuccess,
      isLoading: uploadCoverLoading,
    },
  ] = useUploadCoverImageMutation();

  //NAVIGATION TO ADD ADDRESS
  const navigateToAddLocation = () => {
    navigation.navigate("Add Place Location", { prev_screen: "addAddress" });
  };


  useEffect(() => {
    let address = "";
    let addArr = [];
    if (REDUXDATA.name != "") {
      addArr.push(REDUXDATA.name);
    }

    if (REDUXDATA.administrative_area_level_1 != "") {
      addArr.push(REDUXDATA.administrative_area_level_1);
    }

    if (REDUXDATA.country) {
      addArr.push(REDUXDATA.country);
    }

    address = addArr.join(", ");
    setAddress(address);
  }, [REDUXDATA]);

  //CHANGE PROFILE IF SUCCESS
  useEffect(() => {
    (async () => {
      if (uploadProfileSuccess) {
        setProfileImage(uploadProfileData.user.profileImage.large.private_id);
        const resData = {
          user: uploadProfileData.user,
          token: REDUXUSER.token,
        };
        dispatch(addUser(resData));
        await setItemInStore("userData", resData);
      }
      if (uploadProfileError === true && uploadProfileError !== undefined) {
        setServerError(true);
      }
    })();
  }, [uploadProfileSuccess, uploadProfileError]);
  //CHANGE cover IF SUCCESS
  useEffect(() => {
    (async () => {
      if (uploadCoverSuccess) {
        setCoverImage(uploadCoverData.user.coverImage.large.private_id);
        const resData = {
          user: uploadCoverData.user,
          token: REDUXUSER.token,
        };
        dispatch(addUser(resData));
        await setItemInStore("userData", resData);
      }
      if (uploadCoverError === true && uploadCoverError !== undefined) {
        setServerError(true);
      }
    })();
  }, [uploadCoverSuccess, uploadCoverError]);

  //UPDATE REDUX STORE
  useEffect(() => {
    (async () => {
      if (isSuccess) {
        const resData = {
          user: data.user,
          token: REDUXUSER.token,
        };
        dispatch(addUser(resData));
        dispatch(removeAddress());
        dispatch(removePlaceData());
        await setItemInStore("userData", resData);
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate("Home Navigation Stack");
        }
      }
      if (isError) {
        setErrorMsg(error.data.message);
      }
    })();
  }, [isError, isSuccess]);

  const changeImage = async (props) => {
    // EXPO IMAGE CROP PICKER
    try {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        crop: true,
        aspect: props == "cover" ? [16, 9] : [1, 1],
      });
      if (pickerResult.cancelled === true) {
        return true;
      }
      const fileName = pickerResult.uri.substr(
        pickerResult.uri.lastIndexOf("/") + 1
      );
      const nameParts = fileName.split(".");
      const extention = nameParts[nameParts.length - 1];
      const img = {
        name: fileName,
        type: "image/" + extention,
        uri:
          Platform.OS === "ios"
            ? pickerResult.uri.replace("file://", "")
            : pickerResult.uri,
      };
      const body = {
        file: img,
        token: REDUXUSER.token,
      };
      if (props == "cover") {
        await uploadCoverImage(body);
      } else {
        await uploadProfileImage(body);
      }
    } catch (err) {
      if (props == "cover") {
        setCoverImage("");
      } else {
        setProfileImage("");
      }
    }
  };

  //SAVE PROFILE
  const saveProfile = async (e) => {
    e.preventDefault();
    const checkForm = validateForm({ name, bio, website });

    if (checkForm.valid) {
      const body = {
        name,
        bio,
        website,
        gender,
        dob,
        // about_me: aboutMe,
        meetup_reason: meetupReason,
        interests,
        education,
        occupation,
        languages,
        movies_books_music: movieBookMusic,
        address: REDUXDATA.name != "" ? REDUXDATA : "",
        place: REDUXADDRESSDATA?.place_id ? REDUXADDRESSDATA : "",
        token: REDUXUSER.token,
      };
      await editProfile(body);
    } else {
      setErrorMsg(checkForm.errors);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDob(new Date(date));
    hideDatePicker();
  };

  const closeLanguageModal = () => {
    setShowLanguageModal(false);
  }

  const saveLanguages = (lngs) => {
    setLanguages(lngs);
    closeLanguageModal();
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#fff" }}
      scrollEnabled={!serverError}
    >
      {(uploadProfileLoading || uploadCoverLoading) && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            width,
            height,
            backgroundColor: "#00000080",
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.foiti} />
        </View>
      )}
      <View style={styles.subHeaderContainer}>
        <View style={{ marginLeft: -4, width }}>
          <View style={{ paddingHorizontal: 7 }}>
            <PostPlaceHeader
              title="Edit Profile"
              isProfile={false}
            // isEdit={true}
            />
          </View>
          {serverError ? (
            <View>
              <ServerError
                onPress={() => setServerError(false)}
              />
            </View>
          ) : (
            <>
              <CoverProfile
                isOwnProfile={true}
                isEdit={true}
                profileImg={profileImage}
                coverImg={coverImage}
                selectImage={changeImage}
              />
              <View style={styles.inputContainer}>
                <View style={styles.inputBox}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    value={name}
                    style={[
                      styles.input,
                      errorMsg.name
                        ? styles.errorBorderColor
                        : styles.normalBorderColor,
                    ]}
                    onChangeText={(text) => setName(text)}
                  />
                  <Text style={{ color: "red", fontSize: 11 }}>
                    {(errorMsg.name && errorMsg.name) ||
                      (errorMsg.general && errorMsg.general)}
                  </Text>
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderBox}>
                    <CheckBox
                      title='Male'
                      checkedIcon='circle'
                      uncheckedIcon='circle-thin'
                      checked={gender === "male"}
                      onPress={() => setGender("male")}
                      checkedColor={COLORS.foitiBlack}
                      containerStyle={styles.checkBoxContainer}
                      textStyle={styles.checkBoxText}
                      size={18}
                    />
                    <CheckBox
                      title='Female'
                      checkedIcon='circle'
                      uncheckedIcon='circle-thin'
                      checked={gender === "female"}
                      onPress={() => setGender("female")}
                      checkedColor={COLORS.foitiBlack}
                      containerStyle={styles.checkBoxContainer}
                      textStyle={styles.checkBoxText}
                      size={18}
                    />
                    <CheckBox
                      title='Other'
                      checkedIcon='circle'
                      uncheckedIcon='circle-thin'
                      checked={gender === "other"}
                      onPress={() => setGender("other")}
                      checkedColor={COLORS.foitiBlack}
                      containerStyle={styles.checkBoxContainer}
                      textStyle={styles.checkBoxText}
                      size={18}
                    />
                  </View>
                </View>
                <View style={styles.inputBox}>
                  <View style={{ marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <Text style={{ color: COLORS.foitiGrey, fontSize: 13 }}>(Only age will be shown to others)</Text>
                  </View>
                  <TouchableWithoutFeedback onPress={showDatePicker}>
                    <Text>{dob ? moment(dob).format("DD/MM/YY") : "Day/Month/Year"}</Text>
                  </TouchableWithoutFeedback>
                  <Text style={{ color: "red", fontSize: 11 }}>
                    {errorMsg.dob && errorMsg.dob}
                  </Text>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    maximumDate={subtractYears(new Date(), 13)}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.label}>About Me</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errorMsg.bio
                        ? styles.errorBorderColor
                        : styles.normalBorderColor,
                      { textAlignVertical: "top" },
                    ]}
                    value={bio}
                    onChangeText={(text) => setBio(text)}
                    // numberOfLines={6}
                    maxLength={1000}
                    multiline={true}
                  />
                  <Text style={{ color: "red", fontSize: 11 }}>
                    {errorMsg.bio && errorMsg.bio}
                  </Text>
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.label}>Website</Text>
                  <TextInput
                    value={website}
                    style={[
                      styles.input,
                      errorMsg.website
                        ? styles.errorBorderColor
                        : styles.normalBorderColor,
                    ]}
                    onChangeText={(text) => setWebsite(text)}
                    keyboardType="url"
                  />
                  <Text style={{ color: "red", fontSize: 11 }}>
                    {errorMsg.website && errorMsg.website}
                  </Text>
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.label}>Hometown</Text>
                  <TouchableWithoutFeedback onPress={navigateToAddLocation}>
                    <View>
                      <Text
                        style={[
                          styles.input,
                          errorMsg.address
                            ? styles.errorBorderColor
                            : styles.normalBorderColor,
                          { marginTop: 8 },
                        ]}
                      >
                        {address}
                      </Text>
                      <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.address && errorMsg.address}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
              <View>
                <View style={styles.collapsibleHeader}>
                  <TouchableWithoutFeedback onPress={() => setIsCollapsed(prev => !prev)}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                      <Text style={{ fontWeight: "bold" }}>If you wish to meet other travellers</Text>
                      <MaterialIcons name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"} style={{ fontSize: 30 }} />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                {/* COLLAPSIBLE CONTAINER */}
                <Collapsible collapsed={isCollapsed}>
                  <View style={styles.collapsibleInputContainer}>
                    {/* <View style={styles.inputBox}>
                      <Text style={styles.label}>About Me</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errorMsg.about_me
                            ? styles.errorBorderColor
                            : styles.normalBorderColor,
                          { textAlignVertical: "top" },
                        ]}
                        value={aboutMe}
                        onChangeText={(text) => setAboutMe(text)}
                        maxLength={1000}
                        multiline={true}
                      />
                      <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.about_me && errorMsg.about_me}
                      </Text>
                    </View> */}
                    <View style={styles.inputBox}>
                      <Text style={styles.label}>Why I wish to meet other travellers</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errorMsg.meetup_reason
                            ? styles.errorBorderColor
                            : styles.normalBorderColor,
                          { textAlignVertical: "top" },
                        ]}
                        value={meetupReason}
                        onChangeText={(text) => setMeetupReason(text)}
                        maxLength={1000}
                        multiline={true}
                      />
                      <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.meetup_reason && errorMsg.meetup_reason}
                      </Text>
                    </View>
                    <View style={styles.inputBox}>
                      <Text style={styles.label}>Interests</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errorMsg.interests
                            ? styles.errorBorderColor
                            : styles.normalBorderColor,
                          { textAlignVertical: "top" },
                        ]}
                        value={interests}
                        onChangeText={(text) => setInterests(text)}
                        maxLength={1000}
                        multiline={true}
                      />
                      <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.interests && errorMsg.interests}
                      </Text>
                    </View>
                    <View style={styles.inputBox}>
                      <Text style={styles.label}>Education</Text>
                      <TextInput
                        value={education}
                        style={[
                          styles.input,
                          errorMsg.education
                            ? styles.errorBorderColor
                            : styles.normalBorderColor,
                        ]}
                        onChangeText={(text) => setEducation(text)}
                      />
                      <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.education && errorMsg.education}
                      </Text>
                    </View>
                    <View style={styles.inputBox}>
                      <Text style={styles.label}>Occupation</Text>
                      <TextInput
                        value={occupation}
                        style={[
                          styles.input,
                          errorMsg.occupation
                            ? styles.errorBorderColor
                            : styles.normalBorderColor,
                        ]}
                        onChangeText={(text) => setOccupation(text)}
                      />
                      <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.occupation && errorMsg.occupation}
                      </Text>
                    </View>
                    <View style={styles.inputBox}>
                      <Text style={[styles.label, { marginBottom: 5 }]}>Languages I speak</Text>
                      <TouchableOpacity
                        style={[
                          styles.input,
                          errorMsg.languages
                            ? styles.errorBorderColor
                            : styles.normalBorderColor,
                        ]}
                        onPress={() => setShowLanguageModal(true)}
                      >
                        <View style={{ flexDirection: "row", flexWrap: "wrap", minHeight: 22 }}>
                          {Array.isArray(languages) && languages.length > 0 &&
                            <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: 15, marginBottom: 3 }}>{languages.join(", ")}</Text>
                          }

                        </View>
                      </TouchableOpacity>
                      <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.languages && errorMsg.languages}
                      </Text>
                    </View>

                    <View style={styles.inputBox}>
                      <Text style={styles.label}>Movies, Books & Music</Text>
                      <TextInput
                        style={[
                          styles.input,
                          errorMsg.movies_books_music
                            ? styles.errorBorderColor
                            : styles.normalBorderColor,
                          { textAlignVertical: "top" },
                        ]}
                        value={movieBookMusic}
                        onChangeText={(text) => setMovieBookMusic(text)}
                        maxLength={500}
                        multiline={true}
                      />
                      <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.movies_books_music && errorMsg.movies_books_music}
                      </Text>
                    </View>
                  </View>
                </Collapsible>
              </View>
            </>
          )}
        </View>
      </View>
      {!serverError && (
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveProfile}
            disabled={isLoading ? true : false}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontWeight: "bold", color: "#fff" }}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <LanguageModal currentLanguages={languages} closeModal={closeLanguageModal} modalVisible={showLanguageModal} saveLanguages={saveLanguages} />

    </ScrollView>
  );
};

export default EditProfile;
const styles = StyleSheet.create({
  subHeaderContainer: {
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  inputContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  collapsibleInputContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  inputBox: {
    paddingVertical: 8,
    marginBottom: 2,
  },
  label: {
    color: COLORS.foiti,
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    // borderBottomColor: COLORS.foitiGreyLight,
    borderBottomWidth: 1,
    paddingVertical: 4,
    fontSize: 15,
  },
  errorBorderColor: {
    borderBottomColor: "red",
  },
  normalBorderColor: {
    borderBottomColor: COLORS.foitiGreyLight,
  },

  saveContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: COLORS.foiti,
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 30,
  },
  genderBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10
  },
  checkBoxContainer: {
    backgroundColor: "white",
    borderWidth: 0,
    margin: 0,
    marginLeft: 0,
    marginRight: 30,
    padding: 0,
  },
  checkBoxText: {
    fontWeight: "normal"
  },
  dobContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  collapsibleHeader: {
    backgroundColor: COLORS.foitiGreyLighter,
    fontWeight: "bold",
    paddingHorizontal: FOITI_CONTS.padding + 10,
    paddingVertical: 5
  },
  boxStyle: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  defaultLng: {
    backgroundColor: COLORS.foitiGrey,
    color: "#fff",
    marginRight: 10,
    marginVertical: 5,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 17,
    fontSize: 11
  }
});

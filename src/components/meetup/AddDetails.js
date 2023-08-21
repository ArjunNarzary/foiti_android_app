import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native'
import moment from "moment";
import { CheckBox } from 'react-native-elements'
import Collapsible from 'react-native-collapsible'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from '@react-navigation/native';

import { COLORS, FOITI_CONTS } from '../../resources/theme'
import { validateForm } from "../../Redux/customApis/validator";
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateProfileMutation } from '../../Redux/services/serviceApi';
import { addUser } from '../../Redux/slices/authSlice';
import { removeAddress } from '../../Redux/slices/addAddressSlice';
import { removePlaceData } from '../../Redux/slices/addPlaceSlice';
import { setItemInStore, subtractYears } from '../../utils/handle';
import LanguageModal from '../LanguageModal';
import { useBackHandler } from '@react-native-community/hooks';
const { width, height } = Dimensions.get("window")

const AddDetails = ({ userData, refreshData, unMounted }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const REDUXIP = useSelector(state => state.IPADDRESS);
    const REDUXUSER = useSelector(state => state.AUTHUSER);
    const REDUXDATA = useSelector((state) => state.ADD_ADDRESS);
    const REDUXADDRESSDATA = useSelector((state) => state.NEWPLACE);
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

    const [isUnMounted, setIsUnMouunted] = useState(false);
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [aboutMe, setAboutMe] = useState("");
    const [meetupReason, setMeetupReason] = useState("");
    const [interests, setInterests] = useState("");
    const [education, setEducation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [languages, setLanguages] = useState([]);
    const [movieBookMusic, setMovieBookMusic] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [errorMsg, setErrorMsg] = useState({});
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    useBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            if (REDUXNAVIGATION.name !== "home") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home Navigation" }],
                });
            } else {
                return false;
            }
        }
        return true;
    });

    useEffect(() => {
        if (!unMounted) {
            setGender(userData?.user?.gender);
            setDob(userData?.user?.dob);
            setAboutMe(userData?.user?.bio);
            setMeetupReason(userData?.user?.meetup_reason);
            setInterests(userData?.user?.interests);
            setEducation(userData?.user?.education);
            setOccupation(userData?.user?.occupation);
            setLanguages(userData?.user?.languages);
            setMovieBookMusic(userData?.user?.movies_books_music);
        }
    }, [userData])

    //FORMATE ADDRESS
    let userAddress = "";
    if (userData?.user?.place?._id) {
        const address = userData.user?.place?.local_address || userData.user?.place?.short_address || "";
        userAddress = userData?.user?.place?.name + address;
    }

    //SERVER API
    const [updateProfile, { data, error, isSuccess, isError, isLoading }] =
        useUpdateProfileMutation();

    useEffect(() => {
        setIsUnMouunted(false);

        return () => setIsUnMouunted(true);
    }, [])

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

    //UPDATE REDUX STORE
    useEffect(() => {
        (async () => {
            if (isSuccess && !isUnMounted) {
                const resData = {
                    user: data.user,
                    token: REDUXUSER.token,
                };
                dispatch(addUser(resData));
                dispatch(removeAddress());
                dispatch(removePlaceData());
                await setItemInStore("userData", resData);
                refreshData(data.user);
            }
            if (isError & !isUnMounted) {
                setErrorMsg(error.data.message);
            }
        })();
    }, [isError, isSuccess]);

    //NAVIGATION TO ADD ADDRESS
    const navigateToAddLocation = () => {
        navigation.navigate("Add Place Location", { prev_screen: "addAddress" });
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

    //SAVE PROFILE
    const saveProfile = async (e) => {
        e.preventDefault();

        if(!aboutMe){
            setErrorMsg({ bio: "Please write little about yourself." })
            return;
        }

        if (aboutMe.trim().length == 0 ){
            setErrorMsg({ bio: "Please write little about yourself." })
            return;
        }

        if (!gender) {
            setErrorMsg({ gender: "Please select gender" })
            return;
        }

        if (!dob) {
            setErrorMsg({ dob: "Please enter your date of birth" })
            return;
        }

        const checkForm = validateForm({ gender, dob });

        if (checkForm.valid) {
            const body = {
                gender,
                dob,
                about_me: aboutMe,
                meetup_reason: meetupReason,
                interests,
                education,
                occupation,
                languages,
                movies_books_music: movieBookMusic,
                address: REDUXDATA.name != "" ? REDUXDATA : "",
                place: REDUXADDRESSDATA?.place_id ? REDUXADDRESSDATA : "",
                token: REDUXUSER.token,
                ip: REDUXIP.ip
            };
            setErrorMsg({});
            await updateProfile(body);
        } else {
            setErrorMsg(checkForm.errors);
        }
    };

    const closeLanguageModal = () => {
        setShowLanguageModal(false);
    }

    const saveLanguages = (lngs) => {
        setLanguages(lngs);
        closeLanguageModal();
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.infoContainer}>
                <Text style={styles.info}>Before we continue, how about a little details about yourself for other Travellers.</Text>
            </View>
            <View style={styles.headerContainer}>
                <Text style={{ fontWeight: "bold" }}>Required Details</Text>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputBox}>
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
                        {errorMsg.bio && errorMsg.bio}
                    </Text>
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Address</Text>
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
                                {address || userAddress}
                            </Text>
                            <Text style={{ color: "red", fontSize: 11 }}>
                                {errorMsg.address && errorMsg.address || errorMsg.general}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
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
                    <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg.gender && errorMsg.gender}
                    </Text>
                </View>
                <View style={styles.inputBox}>
                    <View style={{ marginBottom: 10, flexDirection:"row", justifyContent:"space-between", alignItems:"center" }}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <Text style={{ color: COLORS.foitiGrey, fontSize:13 }}>(Only age will be shown to others)</Text>
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
            </View>
            <View>
                <View style={styles.collapsibleHeader}>
                    <TouchableWithoutFeedback onPress={() => setIsCollapsed(prev => !prev)}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={{ fontWeight: "bold" }}>More Details</Text>
                            <MaterialIcons name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"} style={{ fontSize: 30 }} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {/* COLLAPSIBLE CONTAINER */}
                <Collapsible collapsed={isCollapsed}>
                    <View style={styles.collapsibleInputContainer}>
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
            <LanguageModal currentLanguages={languages} closeModal={closeLanguageModal} modalVisible={showLanguageModal} saveLanguages={saveLanguages} />
        </ScrollView>
    )
}

export default AddDetails

const styles = StyleSheet.create({
    infoContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    info: {
        textAlign: "center",
        fontWeight: "bold"
    },
    headerContainer: {
        backgroundColor: COLORS.foitiGreyLighter,
        paddingHorizontal: FOITI_CONTS.padding + 7,
        width,
        paddingVertical: 10,
    },
    inputContainer: {
        marginTop: 20,
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
})
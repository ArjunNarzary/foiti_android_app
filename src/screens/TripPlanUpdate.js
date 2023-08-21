import { useBackHandler } from '@react-native-community/hooks'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
    StyleSheet,
    Text,
    View,
    Modal,
    ScrollView,
    TextInput,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import CalendarPicker from 'react-native-calendar-picker'
import { CommonActions } from "@react-navigation/native";
import PostPlaceHeader from '../components/Header/PostPlaceHeader'
import { COLORS } from '../resources/theme'
import { useDeleteTripMutation, useUpdateTripMutation } from '../Redux/services/serviceApi'
import { validateForm } from "../Redux/customApis/validator";
import { removeDestination } from '../Redux/slices/addDestinationSlice'
import { addNavigation } from '../Redux/slices/addNavigationSlice'
import { removeTravelFrom } from '../Redux/slices/addTravellingSlice'
import ModalComponent from '../components/ModalComponent'
const { width, height } = Dimensions.get("screen");

const TripPlanUpdate = ({ route }) => {
    const { trip } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const REDUXADDRESS = useSelector(state => state.ADD_TRAVELLING);
    const REDUXDESTINATION = useSelector(state => state.ADD_DESTINATION);
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);
    const [address, setAddress] = useState("");
    const [destination, setDestination] = useState("");
    const [tripDetails, setTripDetails] = useState(trip?.details);
    const [startDate, setStartDate] = useState(trip?.start_date);
    const [endDate, setEndDate] = useState(trip?.end_date);
    const [errorMsg, setErrorMsg] = useState({});
    const [showDateModal, setShowDateModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const [updateTrip, { data, error, isLoading, isError, isSuccess }] = useUpdateTripMutation();
    const [deleteTrip, { data: deleteData, error: deleteError, isLoading: deleteIsLoading, isError: deleteIsError, isSuccess: deleteIsSuccess }] = useDeleteTripMutation()

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

    //NAVIGATION TO ADD ADDRESS
    const navigateToAddLocation = (prev_screen) => {
        navigation.navigate("Add Place Location", { prev_screen });
    };

    useEffect(() => {
        let address = "";
        let addArr = [];
        let NAME = "";
        if (REDUXADDRESS.name != "") {
            NAME = REDUXADDRESS.name;
            addArr.push(REDUXADDRESS.name);
        }

        if (REDUXADDRESS.administrative_area_level_1 != "" && REDUXADDRESS.administrative_area_level_1 != NAME) {
            addArr.push(REDUXADDRESS.administrative_area_level_1);
        }

        address = addArr.join(", ");
        setAddress(address);
    }, [REDUXADDRESS]);

    useEffect(() => {
        let address = "";
        let addArr = [];
        let NAME = "";
        if (REDUXDESTINATION.name != "") {
            NAME = REDUXDESTINATION.name;
            addArr.push(REDUXDESTINATION.name);
        }

        if (REDUXDESTINATION.administrative_area_level_1 != "" && REDUXDESTINATION.administrative_area_level_1 != NAME) {
            addArr.push(REDUXDESTINATION.administrative_area_level_1);
        }

        address = addArr.join(", ");
        setDestination(address);
    }, [REDUXDESTINATION]);


    //Date change
    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            setEndDate(date);
            setShowDateModal(false);
        } else {
            setStartDate(date);
            setEndDate(null);
        }
    }

    //Save trip
    const saveTrip = (e) => {
        e.preventDefault();
        const checkForm = validateForm({ trip_details: tripDetails, start_date: startDate, end_date: endDate, destination: REDUXDESTINATION });
        if (checkForm.valid) {
            setErrorMsg({});
            const body = {
                token: REDUXUSER.token,
                destination: REDUXDESTINATION,
                address: REDUXADDRESS,
                start_date: startDate,
                end_date: endDate,
                trip_details: tripDetails,
                trip_id: trip._id
            }

            updateTrip(body);
        } else {
            setErrorMsg(checkForm.errors);
        }
    }

    useEffect(() => {
        if (isSuccess) {
            dispatch(removeTravelFrom());
            dispatch(removeDestination());
            const currentNav = REDUXNAVIGATION.name;
            dispatch(
                addNavigation({
                    name: "profile",
                })
            );

            navigation.dispatch(state => {
                // Remove the last 2 routes from current list of routes
                const routes = [
                    ...state.routes.slice(0, -2),
                    { name: `TripPlanList via ${currentNav}`, params: { user_id: trip?.user_id } }
                ];

                // Reset the state to the new state with updated list of routes
                return CommonActions.reset({
                    ...state,
                    routes,
                    index: routes.length - 1
                });
            });
        }

        if (isError) {
            setErrorMsg(error?.data?.error)
        }
    }, [isSuccess, isError])

    useEffect(() => {
        if (deleteIsSuccess) {
            dispatch(removeTravelFrom());
            dispatch(removeDestination());
            const currentNav = REDUXNAVIGATION.name;
            dispatch(
                addNavigation({
                    name: "profile",
                })
            );

            navigation.dispatch(state => {
                // Remove the last 2 routes from current list of routes
                const routes = [
                    ...state.routes.slice(0, -2),
                    { name: `TripPlanList via ${currentNav}`, params: { user_id: trip?.user_id } }
                ];

                // Reset the state to the new state with updated list of routes
                return CommonActions.reset({
                    ...state,
                    routes,
                    index: routes.length - 1
                });
            });
        }

        if (deleteIsError) {
            setErrorMsg(error?.data?.error)
        }
    }, [deleteIsSuccess, deleteIsError])

    const confirmDelete = () => {
        const body = {
            token: REDUXUSER.token,
            trip_id: trip._id
        }
        setConfirmDeleteModal(false)
        deleteTrip(body);
    }



    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: 7 }}>
                <PostPlaceHeader
                    title="Edit Trip Plan"
                />
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Destination</Text>
                    <TouchableWithoutFeedback onPress={() => navigateToAddLocation('addDestination')}>
                        <View>
                            <Text
                                style={[
                                    styles.input,
                                    errorMsg?.destination
                                        ? styles.errorBorderColor
                                        : styles.normalBorderColor,
                                    { marginTop: 8, color: destination ? "black" : COLORS.foitiGreyLight },
                                ]}
                            >
                                {destination || "Where are you travelling to?"}
                            </Text>
                            <Text style={{ color: "red", fontSize: 11 }}>
                                {(errorMsg?.destination && errorMsg?.destination) || (errorMsg?.general && errorMsg?.general)}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Travelling From</Text>
                    <TouchableWithoutFeedback onPress={() => navigateToAddLocation('addTravel')}>
                        <View>
                            <Text
                                style={[
                                    styles.input,
                                    errorMsg?.address
                                        ? styles.errorBorderColor
                                        : styles.normalBorderColor,
                                    { marginTop: 8, color: address ? "black" : COLORS.foitiGreyLight },
                                ]}
                            >
                                {address || "From where are you travelling?"}
                            </Text>
                            <Text style={{ color: "red", fontSize: 11 }}>
                                {errorMsg?.address && errorMsg?.address}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Date</Text>
                    <TouchableWithoutFeedback onPress={() => setShowDateModal(true)}>
                        <View>
                            <Text
                                style={[
                                    styles.input,
                                    errorMsg?.end_date || errorMsg?.start_date
                                        ? styles.errorBorderColor
                                        : styles.normalBorderColor,
                                    { marginTop: 8, color: endDate ? "black" : COLORS.foitiGreyLight },
                                ]}
                            >
                                {startDate && endDate ? `${moment(startDate).format("DD MMM")} - ${moment(endDate).format("DD MMM")}` : "When are you going?"}
                            </Text>
                            <Text style={{ color: "red", fontSize: 11 }}>
                                {errorMsg?.start_date ? errorMsg?.start_date : (errorMsg?.end_date && errorMsg?.end_date)}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Details about your trip</Text>
                    <TextInput
                        style={[
                            styles.input,
                            errorMsg?.trip_details
                                ? styles.errorBorderColor
                                : styles.normalBorderColor,
                            { textAlignVertical: "top" },
                        ]}
                        value={tripDetails}
                        placeholderTextColor={COLORS.foitiGreyLight}
                        placeholder="Locals and other travellers are waiting to meet you. Tell them about your trip and make it even more beautiful by meeting them."
                        onChangeText={(text) => setTripDetails(text)}
                        maxLength={1000}
                        multiline={true}
                    />
                    <Text style={{ color: "red", fontSize: 11 }}>
                        {errorMsg?.trip_details && errorMsg?.trip_details}
                    </Text>
                </View>
            </View>
            <View style={styles.saveContainer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveTrip}
                    disabled={isLoading ? true : false}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={{ fontWeight: "bold", color: "#fff" }}>Done</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setConfirmDeleteModal(true)}
                    disabled={isLoading ? true : false}
                    style={{ marginTop: 30 }}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text>Delete Trip</Text>
                    )}
                </TouchableOpacity>
            </View>
            <Modal visible={showDateModal} style={{ padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <CalendarPicker
                    onDateChange={onDateChange}
                    allowRangeSelection={true}
                    minDate={new Date()}
                />
            </Modal>
            <ModalComponent
                body="Are you sure you want to delete this trip plan?"
                closeModal={() => setConfirmDeleteModal(false)}
                modalVisible={confirmDeleteModal}
                confirmModal={true}
                confirmDelete={confirmDelete}
                cancelDelete={() => setConfirmDeleteModal(false)}
            />
        </ScrollView>
    )
}

export default TripPlanUpdate

const styles = StyleSheet.create({
    informationContainer: {
        backgroundColor: COLORS.foitiGreyLighter,
        paddingHorizontal: 40,
        paddingVertical: 20
    },
    inputContainer: {
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
        borderRadius: 17,
    },
})
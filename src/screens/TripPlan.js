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
import PostPlaceHeader from '../components/Header/PostPlaceHeader'
import { COLORS } from '../resources/theme'
import { useAddTripMutation, useGetHomeTownQuery, useViewOwnProfileQuery } from '../Redux/services/serviceApi'
import { validateForm } from "../Redux/customApis/validator";
import { removeDestination } from '../Redux/slices/addDestinationSlice'
import { addNavigation } from '../Redux/slices/addNavigationSlice'
import { removeTravelFrom } from '../Redux/slices/addTravellingSlice'
import ServerError from '../components/Error/ServerError'
import AddDetails from '../components/meetup/AddDetails'
const { width, height } = Dimensions.get("screen");

const TripPlan = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXADDRESS = useSelector(state => state.ADD_TRAVELLING);
  const  REDUXDESTINATION = useSelector(state => state.ADD_DESTINATION);
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);
  const REDUXIP = useSelector(state => state.IPADDRESS);
  const [address, setAddress] = useState("");
  const [homeTown, setHomeTown] = useState("");
  const [destination, setDestination] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorMsg, setErrorMsg] = useState({});
  const [showDateModal, setShowDateModal] = useState(false);

  const [unMounted, setUnMounted] = useState(false);
  const [showTripPlan, setShowTripPlan] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const [addTrip, { data, error, isLoading, isError, isSuccess }] = useAddTripMutation();
  const { data: homeDate, error: homeError, isLoading: homeIsLoading, isSuccess: homeIsSuccess, isError: homeIsError } = useGetHomeTownQuery({ token:REDUXUSER.token });

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

  //Validate if user has required details filled
  const { data: userData, isLoading:userIsLoading, isError: userIsError, isSuccess: userIsSuccess, refetch } =
    useViewOwnProfileQuery(
      { token: REDUXUSER.token, ip: REDUXIP.ip },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  useEffect(() => {
    setUnMounted(false);
    return () => {
      setUnMounted(true)
    };
  }, [])

  useEffect(() => {
    if (userIsSuccess && !unMounted) {
      setUserDetails(userData);
      if (userData?.user?.gender && userData?.user?.dob && userData?.user?.place?._id && userData?.user?.bio) {
        setShowTripPlan(true);
      }
      setLoading(false);
    }
    if (userIsError) {
      setLoading(false);
    }
  }, [userIsSuccess, userIsError])

  const refreshData = (user) => {
    setUserDetails({ user: user });
    setShowTripPlan(true);
  }




  useEffect(() => {
    if(homeIsSuccess){
      setHomeTown(homeDate.address)
    }
  },[homeIsSuccess])

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
    if(type === 'END_DATE'){
      setEndDate(date);
      setShowDateModal(false);
    }else{
      setStartDate(date);
      setEndDate(null);
    }
  }

  //Save trip
  const saveTrip = (e) => {
    e.preventDefault();
    const checkForm = validateForm({ trip_details: tripDetails, start_date: startDate, end_date:endDate, destination:REDUXDESTINATION });
    if (checkForm.valid){
      setErrorMsg({});
      const body = {
        token: REDUXUSER.token,
        destination:REDUXDESTINATION,
        address: REDUXADDRESS,
        start_date:startDate,
        end_date:endDate,
        trip_details: tripDetails
      }

      addTrip(body);
    }else{
      setErrorMsg(checkForm.errors);
    }
  }

  useEffect(() => {
    if(isSuccess){
      dispatch(removeTravelFrom());
      dispatch(removeDestination());
      const currentNav = REDUXNAVIGATION.name;
      dispatch(
        addNavigation({
          name: "profile",
        })
      );
      if (currentNav === "profile") {
        navigation.replace("Profile Nav", { showMeetupAlert : !data?.tripPlan?.meetup_status });
      } else {
        navigation.replace(`Profile via ${currentNav}`, { showMeetupAlert : !data?.tripPlan?.meetup_status });
      }
    }

    if(isError){
      setErrorMsg(error?.data?.error)
    }
  },[isSuccess, isError])

  const renderTripPlan = () => (
    <>
      <View style={styles.informationContainer}>
        <Text style={{ textAlign: "center" }}>Create a trip plan and get discovered by other travellers and locals</Text>
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
                  { marginTop: 8, color: address || homeTown ? "black" : COLORS.foitiGreyLight },
                ]}
              >
                {address || homeTown || "From where are you travelling?"}
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
      </View>
      <Modal visible={showDateModal} style={{ padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
        />
      </Modal>
    </>
  )



  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingHorizontal: 7 }}>
        <PostPlaceHeader
          title="Add Trip Plan"
        />
      </View>
      {userIsLoading || loading ? (
        <View
          style={{
            width,
            height: height - 60,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.foiti} />
        </View>
      ) : (
        <>
          {userIsError ? (
            <View>
              <ServerError
                onPress={() => {
                  refetch()
                }}
              />
            </View>
          ) : (
            <>
              {userIsSuccess && (
                <>
                  {showTripPlan ? (
                        renderTripPlan()
                  ) : (
                    <AddDetails userData={userDetails} refreshData={refreshData} unMounted={unMounted} />
                  )}
                </>
              )}
            </>
          )}
        </>)}
    </ScrollView>
  )
}

export default TripPlan

const styles = StyleSheet.create({
  informationContainer:{
    backgroundColor:COLORS.foitiGreyLighter,
    paddingHorizontal:40,
    paddingVertical:20
  },
  inputContainer: {
    marginTop: 50,
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
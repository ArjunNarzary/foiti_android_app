import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BottomSheet } from "react-native-elements";
import { COLORS } from "../resources/theme";
import { useNavigation } from "@react-navigation/core";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons"
import { openPickerFunction } from "../utils/handle";
import { clearBSVisibility } from "../Redux/slices/bottomSheetVisibilitySlice";
import { addImages } from "../Redux/slices/addPlaceSlice";
const { width, height } = Dimensions.get("window");

const ProfileBottomSheet = ({ totalTrips }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
    const REDUXBOTTOMSHEETVISIBILITY = useSelector(state => state.BOTTOMSHEETVISIBILITY);
    const [isUnMounted, setIsUnMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (REDUXBOTTOMSHEETVISIBILITY.type === "profile"){
            setIsVisible(REDUXBOTTOMSHEETVISIBILITY.visible);
        }else{
            setIsVisible(false);
        }
    }, [REDUXBOTTOMSHEETVISIBILITY])


    useEffect(() => {
        setIsUnMounted(false);
        return () => {
            dispatch(clearBSVisibility());
            setIsUnMounted(true);
        };
    },[]);

    const hideBottomSheet = () => {
        if (isUnMounted) return;
        setIsVisible(false);
        dispatch(clearBSVisibility());
    };

    const openImagePickerAsync = async () => {
        const imageData = await openPickerFunction();
        if (!imageData?.status) return;
        dispatch(
            addImages({
                images: imageData.image,
            })
        );
        setIsVisible(false);
        dispatch(clearBSVisibility());
        navigation.navigate("New Post");
    };

    const addTrip = () => {
        dispatch(clearBSVisibility());
        setIsVisible(false);
        navigation.navigate(`TripPlan via ${REDUXNAVIGATION.name}`)
    }

    return (
        <BottomSheet isVisible={isVisible}>
            <TouchableOpacity
                style={{
                    width,
                    height: height - StatusBar.currentHeight,
                    alignItems: "baseline",
                }}
                onPress={hideBottomSheet}
            >
                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: 10,
                        paddingVertical:25,
                        justifyContent: "center",
                        alignItems:"center",
                        minHeight: 70,
                        width,
                        position: "absolute",
                        bottom: 0,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    }}
                >
                    <TouchableOpacity
                        style={styles.btnContainer}
                        onPress={openImagePickerAsync}
                    >
                        <MaterialIcons name="image" style={{ fontSize: 22, marginRight:10 }} />
                        <Text style={{ fontWeight: "600", textAlign: "center" }}>
                            New Post
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.hrLine} />
                    <TouchableOpacity
                        style={styles.btnContainer}
                        onPress={addTrip}
                        disabled={totalTrips >= 5}
                    >
                        <FontAwesome5 name="hiking" style={{ fontSize: 20, marginRight: 10, color: totalTrips >= 5 ? COLORS.foitiGrey : "black" }} />
                        <Text style={[totalTrips >= 5 && styles.strikeText, { fontWeight: "600", textAlign: "center" }]}>
                            Trip Plan
                        </Text>
                        {
                            totalTrips >= 5 && <Text style={{ fontWeight: "600", textAlign: "center", color:COLORS.foitiGrey }}> (Limited to 5)</Text>
                        }
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </BottomSheet>
    );
};

export default ProfileBottomSheet;

const styles = StyleSheet.create({
    btnContainer:{
        padding:10,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },  
    strikeText:{
        textDecorationLine: "line-through",
        textDecorationStyle:"solid",
        color: COLORS.foitiGrey
    },
    hrLine:{
        height: 1,
        backgroundColor:COLORS.foitiGreyLight,
        width: width/1.6,
        marginVertical:5
    }
});

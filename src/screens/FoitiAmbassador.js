import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import { COLORS } from "../resources/theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
// import Link

const FoitiAmbassador = () => {
    const navigation = useNavigation();

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

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: "Home Navigation" }],
            });
        }
    };

    const OpenEmailClient = () => {
        Linking.openURL('mailto:help@foiti.com')
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
            <PostPlaceHeader title="Foiti Ambassador" isProfile={false} />
            <View style={styles.headerContainer}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    What is Foiti Ambassador and who is eligible for the badge?
                </Text>
            </View>
            <View style={styles.mainContainer}>
                <View style={styles.main}>
                    <Text>
                        1. The Foiti Ambassador badge is a way of acknowledging and thanking users for their contributions to the community.
                    </Text>
                </View>
                <View style={styles.main}>
                    <Text>2. If a user is awarded with the badge, the badge will appear next to his/her name and will remain visible for a duration of 3 months. However, if the user continues to actively contribute to the community, the badge may remain visible beyond the 3 months period.</Text>
                </View>
                <View style={styles.main}>
                    <Text>
                        3. There is no defined limit to the number of users who can receive the badge. Anyone can earn the badge by regularly contributing to the community through actions such as uploading photos with exact coordinates, writing reviews, adding new places, etc.
                    </Text>
                </View>
                <View style={styles.main}>
                    <Text>
                        4. Users who have previously had Foiti Ambassador badge are reviewed regularly in a similar manner to users who have never had a badge before, and are awarded accordingly.
                    </Text>
                </View>
                <View style={styles.main}>
                    <Text>
                        5. The badge might be revoked if user fails to adhere to community guidelines.
                    </Text>
                </View>
                <View style={styles.main}>
                    <Text>
                        For more information or help, contact us at{" "} 
                    <Text style={{ fontWeight: "bold" }} onPress={OpenEmailClient}>
                        help@foiti.com
                    </Text>
                    </Text>
                </View>
            </View>
            <View style={styles.submitContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleBack}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default FoitiAmbassador;

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: COLORS.foitiGreyLighter,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    mainContainer: {
        paddingHorizontal: 20,
    },
    main: {
        marginTop: 20,
    },
    submitContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        marginTop: 30,
    },
    submitButton: {
        backgroundColor: COLORS.foiti,
        paddingHorizontal: 35,
        paddingVertical: 12,
        borderRadius: 21,
    },
});

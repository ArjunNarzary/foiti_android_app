import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import NearByPost from './NearByPost'
import { COLORS, FOITI_CONTS } from '../../resources/theme';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get("screen");

const HomeNearby = ({ posts }) => {
    const navigation = useNavigation();
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

    const handleOpenPost = (post) => {
        navigation.push(`Post via ${REDUXNAVIGATION.name}`, { post });
    };

    const navigateToExplore = () => {
        navigation.push(`Nearby via ${REDUXNAVIGATION.name}`, {
            initialRoute: "Explore",
            initialDistance: 50,
            initialSortBy: "nearest"
        })
    }


    const renderFooter = () => (
        <TouchableOpacity style={styles.footer} onPress={navigateToExplore}>
            <Text style={{ color: COLORS.foitiBlack, fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Explore</Text>
            <Text style={{ color: COLORS.foitiBlack, fontSize: 16, fontWeight: "bold", textAlign: "center" }}>More</Text>
        </TouchableOpacity>
    )


    return (
        <View style={styles.container}>
            <View>
                {/* <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Explore The World Near You</Text>
                <Text style={{ fontSize: 11, textAlign: "center" }}>Check what other travellers posted near your location</Text> */}
                <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", color: COLORS.foiti }}>Somewhere Near You</Text>
                <Text style={{ fontSize: 11, textAlign: "center" }}>Check what other travellers posted near your location</Text>
            </View>
            <FlatList
                horizontal={true}
                style={styles.flatlistStyle}
                contentContainerStyle={styles.flatContainer}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.gap} />}
                data={posts}
                renderItem={(item) => <NearByPost item={item.item} onPress={handleOpenPost} showAddress={false} isHomeComponent={true} />}
                ListFooterComponent={renderFooter}
            />
        </View>
    )
}

export default HomeNearby

const styles = StyleSheet.create({
    container: {
        marginTop: -10,
        // backgroundColor: COLORS.foitiGreyLighter,
        backgroundColor: "#fff",
        width,
        borderWidth: 0,

        paddingTop:15,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30

    },
    flatlistStyle:{
        paddingTop: 15,
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderColor:COLORS.foitiGreyLighter
    },
    flatContainer:{
        paddingHorizontal: 7,
    },
    gap: {
        width: 7
    },
    footer:{
        borderColor: COLORS.foitiBlack,
        backgroundColor: "#fff",
        marginHorizontal: 7,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        justifyContent:"center",
        alignContent:"center",
        flexGrow: 1,
    }
})
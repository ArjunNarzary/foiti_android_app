import { Image, Text, StyleSheet } from 'react-native'
import { images as IMAGES } from "resources";

const MarkerBgActive = ({ rerenderParent }) => {
    return (

    <>
        <Image
            source={IMAGES.BG_ACTIVE}
            style={{ height: 40, width: 40, resizeMode: "contain" }}
            onLoad={rerenderParent}
        />
        <Text style={styles.textStyle}>{Math.random()}</Text>
    </>
)}

export default MarkerBgActive

const styles = StyleSheet.create({
    textStyle: {
        height: 0,
        width: 0
    }
})
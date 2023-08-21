import { StyleSheet, Image } from 'react-native'

const MarkerIconActive = ({ type }) => {
    switch (type) {
        case 'Attraction':
            return (
                <Image
                    source={require("../../../assets/images/marker_icon/attraction.png")}
                    style={{ height: 40, width: 40, resizeMode: "contain", position: 'absolute', top: 0, left: 0 }}
                />
            )
        case 'Camp':
            return (
                <Image
                    source={require("../../../assets/images/marker_icon/camp.png")}
                    style={{ height: 40, width: 40, resizeMode: "contain", position: 'absolute', top: 0, left: 0 }}
                />
            )
        case 'Cave':
            return (
                <Image
                    source={require("../../../assets/images/marker_icon/cave.png")}
                    style={{ height: 40, width: 40, resizeMode: "contain", position: 'absolute', top: 0, left: 0 }}
                />
            )
        case 'Garden':
            return (
                <Image
                    source={require("../../../assets/images/marker_icon/garden.png")}
                    style={{ height: 40, width: 40, resizeMode: "contain", position: 'absolute', top: 0, left: 0 }}
                />
            )
        default:
            return (
                <Image
                    source={require("../../../assets/images/marker_icon/museum.png")}
                    style={{ height: 40, width: 40, resizeMode: "contain", position: 'absolute', top: 0, left: 0 }}
                />
            )
    }
}

export default MarkerIconActive

const styles = StyleSheet.create({})
import { StyleSheet, View } from 'react-native'
import MarkerBg from './MarkerBg'
import MarkerBgActive from './MarkerBgActive'
import MarkerIcon from './MarkerIcon'

const MarkerContainer = ({ type, isActive, rerenderParent }) => {
return (
        <View>
            {isActive ? (
                <View style={{ position: 'relative' }}>
                <MarkerBgActive rerenderParent={rerenderParent} />
                </View>
            ): (
                <View style={{ position: 'relative' }}>
                    <MarkerBg type={type} rerenderParent={rerenderParent} />
                    <MarkerIcon type={type} />
                </View>   
            )}
        </View>
    )
}

export default MarkerContainer

const styles = StyleSheet.create({
    image: {
        height: 30,
        width: 30,
        resizeMode: "contain",
        zIndex: 20
    },
    textStyle: {
        height: 0,
        width: 0
    }
})
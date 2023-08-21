import { Text } from 'react-native'
import { Image, StyleSheet } from 'react-native'
import { 
    images as IMAGES
} from "resources" 

const MarkerBg = ({ type, rerenderParent }) => {
    switch (type) {
        case 'market':
        case 'flea_market':
        case 'floating_market':
        case 'shopping_center':
        case 'shopping_mall':
        case 'rest_area':
            return (
                <>
                    <Image
                        source={IMAGES.BG_YELLOW}
                        style={styles.image}
                        onLoad={rerenderParent}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'ancient_ruins':
        case 'archaeological_site':
        case 'historical_site':
        case 'monolith':
        case 'rock-cut_architecture':
        case 'rock_carving':
        
        case 'architectural_building':
        case 'official_residence':
        case 'legislative_building':
        case 'film_studio':
        case 'commercial_hub':

        case 'museum':
        case 'art_museum':
        case 'cultural_museum':
        case 'heritage_museum':
        case 'historical_museum':
        case 'science_museum':

        case 'ashram':
        case 'baháʼí_house_of_worship':
        case 'buddhist_temple':
        case 'church':
        case 'gurudwara':
        case 'hindu_temple':
        case 'minaret':
        case 'monastery':
        case 'mosque':
        case 'place_of_worship':

        case 'tower':
        case 'clock_tower':
        case 'lighthouse':

        case 'fort':
        case 'fortification':
        case 'fortress':

        case 'statue':
        case 'cenotaph':
        case 'mausoleum':
        case 'monument':
        case 'monument_complex':
        case 'memorial':
        case 'war_memorial':

        case 'palace':
        case 'palatial_residence':
        case 'haveli':
        case 'historical_landmark':
        case 'stepwell':

        case 'stadium':

        case 'cave':

        case 'island':

        case 'cemetery':
            return (
                <>
                    <Image
                        source={IMAGES.BG_BROWN}
                        style={styles.image}
                        onLoad={rerenderParent}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'desert':
        case 'dune':
        case 'geological_formation':
        case 'gorge':
        case 'ravine':
        case 'valley':
        case 'rock_formation':
        case 'salt_marsh':
        case 'sand_dunes':

        case 'cliff':
        case 'hill':
        case 'hill_range':
        case 'mountain':
        case 'mountain_pass':
        case 'mountain_peak':
        case 'peak':
        case 'plateau':

        case 'garden':
        case 'park':

        case 'trek':

        case 'forest':
        case 'glacier':
        case 'national_park':
        case 'natural_feature':
        case 'nature_walk':
        case 'sanctuary':
        case 'wildlife_sanctuary':

        case 'golf_course':

        case 'animal_husbandry':
        case 'farm':

        case 'scenic_spot':
            return (
                <>
                    <Image
                        source={IMAGES.BG_GREEN}
                        style={styles.image}
                        onLoad={rerenderParent}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'border_crossing':
        case 'checkpoint':

        case 'bridge':
        case 'dam':
        case 'hanging_bridge':

        case 'cable_car':
        case 'gondola_lift_station':

        case 'helipad':
        case 'airport':

        case 'train_station':

        case 'pedestrian_street':
        case 'promenade':
        case 'intersection':

        case 'tunnel':
            return (
                <>
                    <Image
                        source={IMAGES.BG_DARK_BLUE}
                        style={styles.image}
                        onLoad={rerenderParent}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'bar':
        case 'brewery':
        case 'cafe':
        case 'dhaba':
        case 'restaurant':

        case 'accommodation':
        case 'homestay':
        case 'house_boat':
        case 'lodging':
        case 'resort':
        case 'tree_house':
        case '5-star_hotel':

        case 'camp':
        case 'campsite':
            return (
                <>
                    <Image
                        source={IMAGES.BG_ORANGE}
                        style={styles.image}
                        onLoad={rerenderParent}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        default:
            return (
                <>
                    <Image
                        source={IMAGES.BG_BLUE}
                        style={styles.image}
                        onLoad={rerenderParent}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
    }
}

export default MarkerBg

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
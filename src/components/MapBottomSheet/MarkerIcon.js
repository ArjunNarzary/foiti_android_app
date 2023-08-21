import { useState } from 'react';
import { StyleSheet, Image, Text } from 'react-native'
import { images as IMAGES } from "resources"

const MarkerIcon = ({ type }) => {
    const [update, setUpdate] = useState(false);

    switch (type) {
        case 'market':
        case 'flea_market':
        case 'floating_market':
        case 'shopping_center':
        case 'shopping_mall':
            return (
                <>
                    <Image
                        source={IMAGES.SHOP_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'beach':
        case 'confluence':
        case 'backwater':
        case 'glacial_lake':
        case 'hot_spring':
        case 'lake':
        case 'natural_pool':
        case 'reservoir':
        case 'river':
            return (
                <>
                    <Image
                        source={IMAGES.WATER_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
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
            return (
                <>
                    <Image
                        source={IMAGES.WIND_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
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
            return (
                <>
                    <Image
                        source={IMAGES.HISTORICAL_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'cliff':
        case 'hill':
        case 'hill_range':
        case 'mountain':
        case 'mountain_pass':
        case 'mountain_peak':
        case 'peak':
        case 'plateau':
            return (
                <>
                    <Image
                        source={IMAGES.MOUNTAIN_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'architectural_building':
        case 'official_residence':
        case 'legislative_building':
        case 'film_studio':
        case 'commercial_hub':
            return (
                <>
                    <Image
                        source={IMAGES.BUILDING_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'museum':
        case 'art_museum':
        case 'cultural_museum':
        case 'heritage_museum':
        case 'historical_museum':
        case 'science_museum':
            return (
                <>
                    <Image
                        source={IMAGES.MUSEUM_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
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
            return (
                <>
                    <Image
                        source={IMAGES.PLACE_OF_WORSHIP_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'garden':
        case 'park':
            return (
                <>
                    <Image
                        source={IMAGES.GARDEN_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'trek':
            return (
                <>
                    <Image
                        source={IMAGES.TREK_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'riverfront':
        case 'ghat':
        case 'shore':
            return (
                <>
                    <Image
                        source={IMAGES.RIVERFRONT_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'tower':
        case 'clock_tower':
        case 'lighthouse':
            return (
                <>
                    <Image
                        source={IMAGES.TOWER_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'fort':
        case 'fortification':
        case 'fortress':
            return (
                <>
                    <Image
                        source={IMAGES.FORT_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'statue':
        case 'cenotaph':
        case 'mausoleum':
        case 'monument':
        case 'monument_complex':
        case 'memorial':
        case 'war_memorial':
            return (
                <>
                    <Image
                        source={IMAGES.STATUE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'palace':
        case 'palatial_residence':
        case 'haveli':
        case 'historical_landmark':
        case 'stepwell':
            return (
                <>
                    <Image
                        source={IMAGES.PALACE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'bar':
        case 'brewery':
        case 'cafe':
        case 'dhaba':
        case 'restaurant':
            return (
                <>
                    <Image
                        source={IMAGES.RESTAURANT_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'accommodation':
        case 'homestay':
        case 'house_boat':
        case 'lodging':
        case 'resort':
        case 'tree_house':
        case '5-star_hotel':
            return (
                <>
                    <Image
                        source={IMAGES.HOTEL_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'border_crossing':
        case 'checkpoint':
            return (
                <>
                    <Image
                        source={IMAGES.MILESTONE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'bridge':
        case 'dam':
        case 'hanging_bridge':
            return (
                <>
                    <Image
                        source={IMAGES.BRIDGE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'cable_car':
        case 'gondola_lift_station':
            return (
                <>
                    <Image
                        source={IMAGES.CABLE_CAR_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'forest':
        case 'glacier':
        case 'national_park':
        case 'natural_feature':
        case 'nature_walk':
        case 'sanctuary':
        case 'wildlife_sanctuary':
            return (
                <>
                    <Image
                        source={IMAGES.TREE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'camp':
        case 'campsite':
            return (
                <>
                    <Image
                        source={IMAGES.CAMP_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'amusement_park':
        case 'paragliding_site':
        case 'air_sports_center':
        case 'recreation_center':
        case 'ski_resort':
            return (
                <>
                    <Image
                        source={IMAGES.SPORTS_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'college':
        case 'research_institution':
        case 'university':
            return (
                <>
                    <Image
                        source={IMAGES.INSTITUTION_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'helipad':
        case 'airport':
            return (
                <>
                    <Image
                        source={IMAGES.PLANE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'train_station':
            return (
                <>
                    <Image
                        source={IMAGES.TRAIN_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'stadium':
            return (
                <>
                    <Image
                        source={IMAGES.STADIUM_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'rest_area':
            return (
                <>
                    <Image
                        source={IMAGES.REST_AREA_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'golf_sourse':
            return (
                <>
                    <Image
                        source={IMAGES.GOLF_COURSE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'animal_husbandry':
        case 'farm':
            return (
                <>
                    <Image
                        source={IMAGES.FARM_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'cave':
            return (
                <>
                    <Image
                        source={IMAGES.CAVE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'city':
        case 'village':
        case 'town':
        case 'neighbourhood':
            return (
                <>
                    <Image
                        source={IMAGES.VILLAGE_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'island':
            return (
                <>
                    <Image
                        source={IMAGES.ISLAND_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'pedestrian_street':
        case 'promenade':
        case 'intersection':
            return (
                <>
                    <Image
                        source={IMAGES.ROAD_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'picnic_ground':
            return (
                <>
                    <Image
                        source={IMAGES.PICNIC_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'scenic_spot':
            return (
                <>
                    <Image
                        source={IMAGES.SCENIC_SPOT_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'lookout':
        case 'observation_deck':
        case 'observatory':
            return (
                <>
                    <Image
                        source={IMAGES.BINOCULAR_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'tunnel':
            return (
                <>
                    <Image
                        source={IMAGES.TUNNEL_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'cemetery':
            return (
                <>
                    <Image
                        source={IMAGES.CEMETERY_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        case 'waterfall':
            return (
                <>
                    <Image
                        source={IMAGES.WATERFALL_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
        default:
            return (
                <>
                    <Image
                        source={IMAGES.ATTRACTION_ICON}
                        style={styles.image}
                        onLoad={() => setUpdate(prev => !prev)}
                    />
                    <Text style={styles.textStyle}>{Math.random()}</Text>
                </>
            )
    }
}

export default MarkerIcon

const styles = StyleSheet.create({
    image: {
        height: 30, 
        width: 30, 
        resizeMode: "contain", 
        position: 'absolute', 
        top: 0, 
        left: 0,
        zIndex: 100
    },
    textStyle: {
        height: 0,
        width: 0
    }
})
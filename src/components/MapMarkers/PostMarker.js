import { StyleSheet, Image, Text } from "react-native"
import React, { memo } from 'react'
import { Marker } from 'react-native-maps'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS } from '../../resources/theme'

const PostMarker = ({
  post,
  selectedPost,
  onMarkerPressed,
  rerenderParent,
  mapType
}) => {

  return (
    <Marker
      key={post._id}
      tracksViewChanges={false}
      pinColor={"#fff"}
      onPress={() => onMarkerPressed(post)}
      zIndex={
        selectedPost?._id &&
        selectedPost?._id.toString() == post?._id.toString()
          ? 200
          : 20
      }
      coordinate={{
        latitude: post?.content[0]?.location.coordinates[1],
        longitude: post?.content[0]?.location.coordinates[0],
      }}
      anchor={{
        x: 0.5,
        y:
          selectedPost?._id &&
          selectedPost?._id.toString() == post?._id.toString()
            ? 1
            : 0.5,
      }}
    >
      {selectedPost?._id &&
      selectedPost?._id.toString() == post?._id.toString() ? (
        <>
          {/* <Image
            source={require("../../../assets/images/postselected.png")}
            style={styles.image}
            onLoad={() => rerenderParent()}
          /> */}
          <Text style={styles.textStyle}>{Math.random()}</Text>
        </>
      ) : (
        <MaterialCommunityIcons
          name="image-filter-center-focus-strong"
          style={[
            styles.icon,
            { color: mapType == "satellite" ? "#fff" : "#452727" },
          ]}
        />
      )}
    </Marker>
  )
}

export default memo(PostMarker)

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: 10,
    width: 10,
    color: COLORS.foitiGrey,
    backgroundColor: COLORS.foitiGreyLighter,
    borderRadius: 10 / 2,
  },
  icon: {
    fontSize: 13,
    // color: "#452727",
  },
  image: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    zIndex: 20,
  },
  textStyle: {
    height: 0,
    width: 0,
  },
})
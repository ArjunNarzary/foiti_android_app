import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import MapView, { Marker } from "react-native-maps";
import { MAPSTYLE } from "../../utils/mapStyle";

const MapContainer = ({ coors }) => {
  // const mapStyle = [
  //   {
  //     featureType: "landscape",
  //     stylers: [
  //       {
  //         saturation: -35,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "poi",
  //     stylers: [
  //       {
  //         visibility: "off",
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "geometry.fill",
  //     stylers: [
  //       {
  //         color: "#dedede",
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "geometry.stroke",
  //     stylers: [
  //       {
  //         color: "#bababa",
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "labels.icon",
  //     stylers: [
  //       {
  //         saturation: -100,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "labels.text",
  //     stylers: [
  //       {
  //         color: "#4f4f4f",
  //       },
  //       {
  //         weight: 0.5,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "labels.text.stroke",
  //     stylers: [
  //       {
  //         color: "#ffffff",
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "transit",
  //     elementType: "labels.icon",
  //     stylers: [
  //       {
  //         color: "#ba7740",
  //       },
  //       {
  //         saturation: -5,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "transit",
  //     elementType: "labels.text.fill",
  //     stylers: [
  //       {
  //         color: "#604d28",
  //       },
  //     ],
  //   },
  // ];

  return (
    <View
      style={{
        width: Dimensions.get("window").width,
        height: 200,
        overflow: "hidden",
      }}
    >
      <MapView
        style={{ width: "100%", height: 240 }}
        showsCompass={false}
        toolbarEnabled={false}
        showsScale={false}
        loadingEnabled={true}
        customMapStyle={MAPSTYLE}
        initialRegion={{
          latitude: parseFloat(coors?.lat),
          longitude: parseFloat(coors?.lng),
          latitudeDelta: 0.1622,
          longitudeDelta: 0.1321,
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(coors?.lat),
            longitude: parseFloat(coors?.lng),
          }}
        >
          <Image
            source={require("../../../assets/images/pin.png")}
            style={{ height: 40, width: 40, resizeMode: "contain" }}
          />
        </Marker>
      </MapView>
    </View>
  );
};

export default MapContainer;

const styles = StyleSheet.create({});

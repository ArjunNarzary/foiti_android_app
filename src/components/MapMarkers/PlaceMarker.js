import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Marker } from 'react-native-maps'
import MarkerContainer from '../MapBottomSheet/MarkerContainer'
import { memo } from 'react'

const PlaceMarker = ({ place, displayLabel, onMarkerPressed, selectedPlace, rerenderParent }) => {

  return (
      <View>
          <Marker
              key={place._id}
              tracksViewChanges={false}
              zIndex={place?._id === selectedPlace?._id ? 200 : 100}
              pinColor={"#fff"}
              onPress={() => onMarkerPressed(place)}
              coordinate={{
                  latitude: place?.location?.coordinates[1],
                  longitude: place?.location?.coordinates[0],
              }}
          >
              <View style={{ alignItems: 'center' }}>
                  <MarkerContainer isActive={place?._id === selectedPlace?._id} type={place?.types && place?.types.length > 1 && place?.types[1]} rerenderParent={rerenderParent} />
              </View>
          </Marker>
          {displayLabel.length > 0 && displayLabel.includes(place?._id) &&
              <Marker
                //   key={place._id}
                  pinColor={"#fff"}
                  zIndex={place?._id === selectedPlace?._id ? 200 : 100}
                  tracksViewChanges={false}
                  anchor={{ x: 0.5, y: 0 }}
                  coordinate={{
                      latitude: place?.location?.coordinates[1],
                      longitude: place?.location?.coordinates[0],
                  }}
              >
                  <View
                      style={{
                          justifyContent: 'center',
                          maxWidth: 140,
                          elevation: 8,
                          padding: 2,
                          borderRadius: 6
                      }}>
                      <Text style={{
                          textAlign: 'center',
                          fontSize: 11,
                          borderRadius: 5,
                          paddingHorizontal: 5,
                          backgroundColor: 'rgba(255,255,255,0.5)',
                          textShadowColor: '#fff',
                          fontWeight: 'bold',
                          textShadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 1,
                          textShadowRadius: 2,
                      }}>{place?.name}</Text>
                  </View>
              </Marker>
          }
      </View>
  )
}

export default memo(PlaceMarker)

const styles = StyleSheet.create({})
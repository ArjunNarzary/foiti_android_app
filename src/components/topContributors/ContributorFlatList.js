import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { COLORS } from '../../resources/theme'
import Contributors from './Contributors'

const ContributorFlatList = ({ users, rerender, type , place}) => {

    const renderSeparator = () => (
        <View style={styles.separtor}>
            <View style={styles.separtorHr} />
        </View>
    )

  return (
      <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={styles.containerStyle}
          style={{ backgroundColor: COLORS.foitiGreyLighter }}
          data={users}
          renderItem={(item) => (
              <Contributors user={item.item} type={type} place={place} />
          )}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={renderSeparator}
          extraData={rerender}
      />
  )
}

export default ContributorFlatList

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: COLORS.foitiGreyLighter,
        paddingVertical: 15,
        marginHorizontal: 7,
        paddingRight:30
    },
    separtor: {
        marginHorizontal: 10,
        justifyContent: "center",
        height: 80
    },
    separtorHr: {
        width: 1,
        height: "70%",
        backgroundColor: COLORS.foitiBlack,
    }
})
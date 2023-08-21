import React, { memo } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { getSenderName, getMessageDate, isEmpty, getSenderProfile } from "../../utils/chatHelper";
const { width, height } = Dimensions.get("screen");
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const SingleChat = ({ item, logeduser }) => {
  const navigation = useNavigation();
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);

  if (isEmpty(item.lastMessage)) {
    return null;
  }
  
  return (
    <View
      style={{
        alignItems: "flex-start",
      }}
    >
      <TouchableOpacity
        style={styles.placeTouchable}
        onPress={() => navigation.navigate(`ChatBox via ${REDUXNAVIGATION.name}`, { "chatId": item?._id, user: item })}
      >
        {item?.chatUsers && getSenderProfile(logeduser, item.chatUsers)?.profileImage != undefined &&
          getSenderProfile(logeduser, item.chatUsers)?.profileImage?.thumbnail?.private_id != "" ? (
          <Image
            source={{
                uri: `${process.env.BACKEND_URL}/image/${getSenderProfile(logeduser, item.chatUsers)?.profileImage?.thumbnail?.private_id}`,
            }}
            style={styles.thumbnail}
          />
        ) : (
          <Image
            source={{
              uri: `${process.env.BACKEND_URL}/image/profile_picture.jpg`,
            }}
            style={styles.thumbnail}
          />
        )}
        <View style={{ width: width - 90 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: "bold" }} numberOfLines={1}>
              {getSenderName(logeduser, item?.chatUsers)}
            </Text>
            <Text style={{ color: "#606060", fontSize: 12, fontWeight: "400", paddingEnd: 15 }}>{item?.lastMessage && getMessageDate(item?.lastMessage?.createdAt)}</Text>
          </View>

          {
            item?.lastMessage && logeduser && (item?.lastMessage?.sender?._id?.toString() === logeduser?.user?._id?.toString()) ? (
              <Text numberOfLines={1} style={{ fontSize: 12, lineHeight: 15 }}>
                {item?.lastMessage && item?.lastMessage?.content}
              </Text>
            ) : (
              <Text numberOfLines={1} style={item?.lastMessage && item?.lastMessage?.is_read ? { fontSize: 12, lineHeight: 15 } : { fontSize: 12, lineHeight: 15, fontWeight: 'bold' }}>
                {item?.lastMessage && item?.lastMessage?.content}
              </Text>
            )
          }

        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(SingleChat);

const styles = StyleSheet.create({
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  thumbnailBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  placeTouchable: {
    paddingVertical: 7,
    marginVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
})

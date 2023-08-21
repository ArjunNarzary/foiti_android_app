import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS } from '../../resources/theme';
const { width, height } = Dimensions.get("screen");

const AddComment = ({ myComment, post, redirect = true, addCommentPressed }) => {
    const navigation = useNavigation();
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
    const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {
        if (
            REDUXUSER?.user?.profileImage?.thumbnail?.private_id != "" &&
            REDUXUSER?.user?.profileImage?.thumbnail?.private_id != undefined
        ) {
            setProfileImage(REDUXUSER?.user?.profileImage?.thumbnail?.private_id);
        } else {
            setProfileImage("profile_picture.jpg");
        }
    }, [REDUXUSER]);

    const openComment = (post, showInputField) => {
        if(redirect){
            navigation.push(`Comments via ${REDUXNAVIGATION?.name}`, { post, showInputField });
        }else{
            addCommentPressed();
        }
    };

  return (
      <View style={{
          flexDirection:"row",
          alignItems:"flex-start"
          }}>
          <Image
              source={{
                  uri: `${process.env.BACKEND_URL}/image/${profileImage}`,
              }}
              style={styles.image}
          />
          {myComment?.body ? (
              <TouchableOpacity onPress={() => openComment(post, false)}>
                <Text numberOfLines={4} style={{ marginLeft: 10 }}>{myComment?.body}</Text>
            </TouchableOpacity>

          ) :(
            <TouchableOpacity onPress={() => openComment(post, true)}>
                <Text numberOfLines={1} style={{ marginLeft: 10, color: COLORS.foitiGrey, fontSize: 12, marginTop: 5 }}>{"Add a comment..."}</Text>
            </TouchableOpacity>
          )}
    </View>
  )
}

export default AddComment

const styles = StyleSheet.create({
    image: {
        height: 25,
        width: 25,
        borderRadius: 25/2,
    },
})
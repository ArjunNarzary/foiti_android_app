import { 
    Dimensions, 
    StyleSheet, 
    Image, 
    View, 
    TextInput, 
    TouchableOpacity, 
    TouchableWithoutFeedback 
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Ionicons } from "@expo/vector-icons"
import { COLORS, FOITI_CONTS } from '../../resources/theme';
const {width, height} = Dimensions.get("screen");

const InputBox = ({ hideInput, setCommentBody, inputRef, body, submitComment }) => {
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
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

  return (
    <>
          <View style={styles.inputConatiner}>
              <View style={styles.inputBox}>
                  <Image
                      source={{
                          uri: `${process.env.BACKEND_URL}/image/${profileImage}`,
                      }}
                      style={styles.image}
                  />
                  <TextInput 
                        multiline={true} 
                        style={styles.input} 
                        placeholder='Add a comment...' 
                        autoFocus={true} 
                        ref={inputRef} 
                        value={body} 
                        onChangeText={(text) => setCommentBody(text)}
                        />
              </View>
              <TouchableOpacity onPress={submitComment} disabled={body.length === 0 ? true : false}>
                  <Ionicons name="ios-send-sharp" size={20} color={body.length === 0 ? COLORS.foitiGreyLight : COLORS.foiti}/>
              </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback onPress={hideInput}>
              <View style={styles.inputSection} />
          </TouchableWithoutFeedback>
    </>
  )
}

export default InputBox

const styles = StyleSheet.create({
    inputSection: {
        position: "absolute",
        height,
        width,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 5
    },
    inputConatiner: {
        zIndex: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingVertical: 10,
        paddingLeft: FOITI_CONTS.padding + 5,
        paddingRight: FOITI_CONTS.padding + 10,
        width,
        marginLeft:-7
    },
    image: {
        height: 22,
        width: 22,
        borderRadius: 11,
        marginTop:2
    },
    inputBox: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    input: {
        marginLeft: 5,
        width: "85%",
        maxHeight: 100
    }
})
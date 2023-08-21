import moment from 'moment';
import React, { memo } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { COLORS } from '../../resources/theme';
import { getConvertedTime } from '../../utils/chatHelper'
const { width, height } = Dimensions.get("screen");

const Message = ({ 
        isMeetupMessage = false, 
        index, 
        hasRequest = false,
        lastIndex, 
        message, 
        loggedUser }) => {

    return (
        <>
            <View style={message?.sender?._id === loggedUser ? { flexDirection: 'row', justifyContent: 'flex-end' } : { flexDirection: 'row', justifyContent: 'flex-start' }}>
                {
                    message?.sender?._id === loggedUser ? (
                        <View style={message?.sender?._id === loggedUser ? styles.loggedUserMessage : styles.secondUserMessage} >
                            <Text>{message?.content}</Text>
                            <Text style={{ color: "#AAAAAA", fontSize: 12 }}>{getConvertedTime(message?.createdAt)}</Text>
                        </View>
                    ) : (
                        <View>
                            {
                                message?.is_sent ? (
                                    <View style={message?.sender?._id === loggedUser ? styles.loggedUserMessage : styles.secondUserMessage} >
                                        <Text>{message?.content}</Text>
                                            <Text style={{ color: "#AAAAAA", fontSize: 12 }}>{getConvertedTime(message?.createdAt)}</Text>
                                    </View>
                                ) : (null)
                            }

                        </View>

                    )
                }

            </View>
            {
                isMeetupMessage && index === lastIndex && hasRequest && (
                    <View style={{ marginBottom:20, paddingHorizontal: 30 }}>
                        {
                            hasRequest.toString() == loggedUser.toString() ?
                                <Text style={{ color: COLORS.foitiGrey, fontSize: 13, textAlign: "center" }}>You can chat and get to know more about the traveller before accepting or cancelling the request</Text> :
                                <Text style={{ color: COLORS.foitiGrey, fontSize: 13, textAlign: "center" }}>You can start by saying something about yourself, your trip or why you wish to meet up.</Text>
                        }
                    </View>
                )
            }
        </>
    )
}

export default memo(Message)

const styles = StyleSheet.create({
    loggedUserMessage: {
        alignItems: 'flex-end',
        backgroundColor: "#FFE2E2",
        // width: 120,
        maxWidth: width - 80,
        borderRadius: 12,
        marginBottom: 10,
        padding: 15
    },
    secondUserMessage: {
        alignItems: 'flex-start',
        backgroundColor: "#E5E5E5",
        maxWidth: width - 80,
        // width: 120,
        borderRadius: 12,
        marginBottom: 10,
        padding: 15
    }
})
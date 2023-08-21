import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { getConvertedTime } from '../../utils/chatHelper';
const width = Dimensions.get('window').width;

const ScrollableChat = ({ message, loggedUser, recipientUserBlockStatus }) => {
    return (
        <View>
            <View style={{ padding: 20 }}>
                {
                    message && message.map((item, index) => {
                        return (
                            <View key={index} style={item.sender._id === loggedUser ? { flexDirection: 'row', justifyContent: 'flex-end' } : { flexDirection: 'row', justifyContent: 'flex-start' }}>
                                {
                                    item.sender._id === loggedUser ? (
                                        <View style={item.sender._id === loggedUser ? styles.loggedUserMessage : styles.secondUserMessage} >
                                            <Text>{item.content}</Text>
                                            <Text style={{ color: "#AAAAAA", fontSize: 12 }}>{getConvertedTime(item.createdAt)}</Text>
                                        </View>
                                    ) : (
                                        <View>
                                            {
                                                item.is_sent ? (
                                                    <View style={item.sender._id === loggedUser ? styles.loggedUserMessage : styles.secondUserMessage} >
                                                        <Text>{item.content}</Text>
                                                        <Text style={{ color: "#AAAAAA", fontSize: 12 }}>{getConvertedTime(item.createdAt)}</Text>
                                                    </View>
                                                ) : (null)
                                            }

                                        </View>

                                    )
                                }

                            </View>

                        )
                    })
                }
                {
                    (recipientUserBlockStatus && recipientUserBlockStatus === true) ? (<Text style={{ color: "#AAAAAA", fontSize: 12 }}>You have blocked this user</Text>) : (<View />)
                }
            </View>
            <View style={{ height: 50 }}></View>
            </View>
    )
}

export default ScrollableChat
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
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons"
import { COLORS } from '../../resources/theme';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useLikeUnlikeCommentMutation } from '../../Redux/services/serviceApi';

const CommentEngagement = ({ comment, onPressReply, hideReport = false }) => {
    const REDUXUSER = useSelector((state) => state.AUTHUSER)
    const [liked, setLiked] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [likeUnlikeComment, { isLoading, isSuccess, isError, error }] = useLikeUnlikeCommentMutation();

    useState(() => {
        if (comment?.likes?.includes(REDUXUSER?.user?._id)) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }, [comment]);

    useEffect(() => {
        setIsUnmounted(false);

        return () => {
            setIsUnmounted(true);
        }
    })

    useEffect(() => {
        if (isSuccess && !isUnmounted) {
            setLiked(like => !like);
        }
    }, [isSuccess, isError]);

    const onPressLike = () => {
        const body = {
            token: REDUXUSER.token,
            comment_id: comment._id
        }
        likeUnlikeComment(body);
    }


    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <TouchableOpacity style={styles.iconContainer} onPress={onPressReply}>
                    <MaterialIcons name="reply" size={16} color={COLORS.foitiGrey} />
                    <Text style={{ marginLeft: 5, color: COLORS.foitiGrey, fontSize:12 }}>Reply</Text>
                </TouchableOpacity>
                <Entypo name="dot-single" color={COLORS.foitiGrey} style={{ marginHorizontal: 2 }} />
                <TouchableOpacity style={styles.iconContainer} onPress={onPressLike} disabled={isLoading ? true : false}>
                    <Ionicons
                        name={liked ? "heart" : "heart-outline"}
                        size={15}
                        style={[
                            liked ? styles.redIconColor : styles.blackIconColor,
                        ]}
                    />
                    <Text style={{ marginLeft: 5, color: COLORS.foitiGrey, fontSize:12 }}>Like</Text>
                </TouchableOpacity>
                {!hideReport && (
                    <>
                        <Entypo name="dot-single" style={{ marginHorizontal: 2, color: COLORS.foitiGrey }} />
                        <View>
                            <Text style={{ color: COLORS.foitiGrey, fontSize:12 }}>{moment(comment.createdAt).fromNow()}</Text>
                        </View>
                    </>
                )}
            </View>
            {comment?.likes && comment?.likes.length > 0 && (<View>
                <Text style={{ fontWeight: "bold", color: COLORS.foitiGrey, fontSize:12 }}>{comment?.likes?.length} {comment?.likes?.length === 1 ? "like" : "likes"}</Text>
            </View>)}
        </View>
    )
}

export default CommentEngagement

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    redIconColor: {
        color: "#ef2828",
    },
    blackIconColor: {
        color: COLORS.foitiGrey,
    },
})
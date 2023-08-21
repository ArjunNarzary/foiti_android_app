import { ActivityIndicator, Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import React, { useRef } from 'react'
import PostPlaceHeader from '../components/Header/PostPlaceHeader'
import AddComment from '../components/Comment/AddComment'
import { useState } from 'react'
import { useAddCommentMutation, useDeleteCommentMutation, useEditCommentMutation, useGetAllCommentsMutation } from '../Redux/services/serviceApi'
import { useEffect } from 'react'
import { COLORS, FOITI_CONTS } from '../resources/theme'
import { useDispatch, useSelector } from 'react-redux'
import Comment from '../components/Comment/Comment'
import InputBox from '../components/Comment/InputBox'
import ServerError from '../components/Error/ServerError'
import { useNavigation } from '@react-navigation/native'
import CommentBottomSheet from '../components/CommentBottomSheet'
import ModalComponent from '../components/ModalComponent'
import CustomAlert from '../components/CustomAlert'
import { clearAlert, setAlert } from '../Redux/slices/alertSlice'
import { useBackHandler } from '@react-native-community/hooks'

const { width, height } = Dimensions.get("screen");

const Comments = ({ route }) => {
    const { post, showInputField = false } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
    const REDUXALERT = useSelector((state) => state.REDUXALERT);
    const [comments, setComments] = useState([]);
    const [myComment, setMyComment] = useState(true);
    const [skip, setSkip] = useState(0);
    const [noMoreComment, setNoMoreComment] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [firstFetch, setFirstFetch] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showInput, setShowInput] = useState(showInputField);
    const [selectedComment, setSelectedComment] = useState({});
    const [body, setBody] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [rerenderFlatlist, setRerenderFaltlist] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const inputRef = useRef("");

    const [getAllComments, { isLoading, isSuccess, isError, data, error }] = useGetAllCommentsMutation();
    const [addComment, { isLoading: commentIsLoading, isSuccess: commentIsSuccess, isError: commentIsError, data: commentData, error: commentError }] = useAddCommentMutation();
    const [editComment, {
        isSuccess: editIsSuccess,
        isError: editIsError,
        isLoading: editIsLoading,
    }] = useEditCommentMutation();

    const [deleteComment, {
        isSuccess: deleteIsSuccess,
        isError: deleteIsError,
        isLoading: deleteIsLoading,
    }] = useDeleteCommentMutation();


    const fetchComment = () => {
        const body = {
            skip: 0,
            token: REDUXUSER.token,
            post_id: post._id,
            myComment: true,
            noMoreComment: false
        }

        getAllComments(body);
    }

    useBackHandler(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            if (REDUXNAVIGATION.name !== "home") {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home Navigation" }],
                });
            } else {
                return false;
            }
        }
        return true;
    });

    const fetchMoreComment = () => {
        if (noMoreComment) return;
        setLoadingMore(true);
        const body = {
            skip,
            token: REDUXUSER.token,
            post_id: post._id,
            myComment,
            noMoreComment
        }

        getAllComments(body);
    }

    useEffect(() => {
        setIsUnmounted(false);
        fetchComment();
        return () => {
            setIsUnmounted(true);
        }
    }, []);

    //HIDE SHOW ALERT
    useEffect(() => {
        if (!isUnmounted && REDUXALERT.type == "comment") {
            setIsVisible(false);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                dispatch(clearAlert());
            }, 2000);
        }
    }, [REDUXALERT]);

    useEffect(() => {
        if (isSuccess && !isUnmounted) {
            if (firstFetch) {
                setComments(data?.comments);
            } else {
                setComments([...comments, ...data?.comments]);
            }
            setSkip(data?.skip);
            setMyComment(data?.myComment);
            setNoMoreComment(data?.noMoreComment);
            setFirstFetch(false);
            setIsRefreshing(false);
            setLoadingMore(false);
        }

        if (isError) {
            setIsRefreshing(false);
            setLoadingMore(false);
        }
    }, [isSuccess, isError]);

    //Adding comment 
    useEffect(() => {
        if (commentIsSuccess && !isUnmounted) {
            setBody("");
            setComments([]);
            let arr = [...comments];
            arr.unshift(commentData.comment);
            setComments(arr);
            setRerenderFaltlist(render => !render);
            setSkip(skip => skip + 1);
        }

        if (commentIsError && !isUnmounted) {
            setBody("");
            setErrorMsg("Opps! something went wrong. Please try again");
        }
    }, [commentIsSuccess, commentIsError]);

    //Editing comment
    useEffect(() => {
        if (editIsSuccess && !isUnmounted) {
            setBody("");
            setSelectedComment({});
            _onRefresh()
        }

        if (editIsError && !isUnmounted) {
            setBody("");
            setSelectedComment({});
            dispatch(
                setAlert({ type: "comment", message: "Opps! Please try again." })
            );
        }
    }, [editIsSuccess, editIsError]);

    //DELETE COMMENT
    useEffect(() => {
        if (deleteIsSuccess && !isUnmounted) {
            setSelectedComment({});
            _onRefresh()
        }

        if (deleteIsError && !isUnmounted) {
            setSelectedComment({});
            dispatch(
                setAlert({ type: "comment", message: "Opps! Please try again." })
            );
        }
    }, [deleteIsSuccess, deleteIsError]);


    //Reload
    const reload = () => {
        if (isUnmounted) return;
        setMyComment(true);
        setFirstFetch(true);
        setNoMoreComment(false);
        fetchComment();
    }

    //Refreshing
    const _onRefresh = () => {
        if (isUnmounted) return;
        setMyComment(true);
        setFirstFetch(true);
        setNoMoreComment(false);
        setIsRefreshing(true);
        setFirstFetch(true);
        setNoMoreComment(false);
        fetchComment();
    }

    const setCommentBody = (value) => {
        setBody(value);
    }

    const addCommentPressed = () => {
        setShowInput(true);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const onPressReply = (parent) => {
        navigation.push(`CommentReply via ${REDUXNAVIGATION.name}`, { parentComment: parent, showInputField: true });
    }

    const showReply = (parent) => {
        navigation.push(`CommentReply via ${REDUXNAVIGATION.name}`, { parentComment: parent, showInputField: false });
    }

    const hideInput = () => {
        setShowInput(false);
    }

    //Validate comment body
    const isValidForm = () => {
        if (!body.trim()) {
            setErrorMsg("Please add your comment");
            return false;
        }
        if (body.length > 2000) {
            setErrorMsg("Please write comment withing 2000 characters.");
            return false;
        }

        return true;
    };



    //POST/EDIT COMMENT
    const postComment = () => {
        if (isValidForm()) {
            hideInput();
            if (selectedComment?._id) {
                const commentData = {
                    comment_id: selectedComment._id,
                    token: REDUXUSER.token,
                    body
                }
                editComment(commentData)
            } else {
                const postData = {
                    token: REDUXUSER.token,
                    post_id: post._id,
                    body
                }
                addComment(postData);
            }
        }
    }

    //Edit comment
    const editCommentPressed = () => {
        setIsVisible(false);
        if (!selectedComment?._id) return;
        setBody(selectedComment?.body);
        addCommentPressed();
    }

    //Delete Comment
    const deleteCommentPressed = () => {
        setIsVisible(false);
        if (!selectedComment?._id) return;
        setConfirmDeleteModal(true);
    }

    const confirmDelete = () => {
        if (!selectedComment?._id) return;
        const data = {
            token: REDUXUSER.token,
            comment_id: selectedComment?._id
        }

        deleteComment(data);
        setConfirmDeleteModal(false);
    }

    //Open bottomSheet
    const openBottomSheet = (item) => {
        setSelectedComment(item);
        setIsVisible(true);
    }

    //CLOSE MODAL
    const closeConfirmModal = () => {
        setConfirmDeleteModal(false);
        setSelectedComment({});
    }

    //Header
    const FlatListHeader = () => {
        return (
            <>
                <View style={styles.commentContainer} >
                    <AddComment redirect={false} addCommentPressed={addCommentPressed} />
                </View >
                {(commentIsLoading || editIsLoading || deleteIsLoading) && (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            height: 40,
                            width,
                        }}
                    >
                        <ActivityIndicator size="small" color={COLORS.foitiGrey} />
                    </View>
                )}
            </>
        )
    }

    const renderEmptyList = () => {
        return (
            <View
                style={{
                    paddingTop: 40,
                    height,
                }}
            >
                {(!isLoading && !isRefreshing) ?? (
                    <Text style={{ textAlign: "center", fontSize: 18 }}>
                        No comment to show
                    </Text>
                )}
            </View>
        );
    };

    //RENDER FOOTER
    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View
                style={{
                    paddingVertical: 10,
                }}
            >
                <ActivityIndicator size="large" color={COLORS.foiti} />
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 7 }}>
            <PostPlaceHeader title="Comments" />
            {isError ? (
                <ServerError onPress={reload} />
            ) : (
                <>
                    {(isLoading && firstFetch) ? (
                        <View
                            style={{
                                position: "absolute",
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                height,
                                width,
                            }}
                        >
                            <ActivityIndicator size="large" color={COLORS.foiti} />
                        </View>
                    ) : (
                        <>
                            <FlatList
                                ListHeaderComponent={<FlatListHeader />}
                                showsVerticalScrollIndicator={false}
                                // contentContainerStyle={{ paddingHorizontal: FOITI_CONTS.padding }}
                                data={comments}
                                renderItem={(item) => (
                                    <Comment item={item.item} onPressReply={onPressReply} showMoreReply={showReply} openBottomSheet={() => openBottomSheet(item.item)} />
                                )}
                                keyExtractor={(item, index) => item._id}
                                extraData={rerenderFlatlist}
                                ListEmptyComponent={renderEmptyList}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefreshing}
                                        onRefresh={_onRefresh}
                                        tintColor={"#f8852d"}
                                    />
                                }
                                onEndReachedThreshold={0.5}
                                onEndReached={fetchMoreComment}
                                ListFooterComponent={renderFooter}
                            />
                            <CommentBottomSheet
                                isVisible={isVisible}
                                hideBottomSheet={() => {
                                    setSelectedComment({});
                                    setIsVisible(false);
                                }}
                                comment={selectedComment}
                                editComment={editCommentPressed}
                                deleteComment={deleteCommentPressed}
                            />
                            {showInput && (
                                <>
                                    {errorMsg !== "" && (
                                        <View style={{ alignItems: "center", zIndex: 10 }}>
                                            <Text>{errorMsg}</Text>
                                        </View>
                                    )}
                                    <InputBox inputRef={inputRef} hideInput={hideInput} setCommentBody={setCommentBody} body={body} submitComment={postComment} />
                                </>
                            )}
                        </>
                    )}
                    <ModalComponent
                        body="Are you sure you want to delete the comment?"
                        closeModal={closeConfirmModal}
                        modalVisible={confirmDeleteModal}
                        confirmModal={true}
                        confirmDelete={confirmDelete}
                        cancelDelete={closeConfirmModal}
                    />
                    {showAlert && <CustomAlert text={REDUXALERT?.message} />}
                </>)}
        </View>
    )
}

export default Comments

const styles = StyleSheet.create({
    commentContainer: {
        backgroundColor: "#ededed",
        justifyContent: "center",
        paddingVertical: 15,
        paddingHorizontal: FOITI_CONTS.padding,
        borderRadius: 12,
        marginBottom: 12
    }
})
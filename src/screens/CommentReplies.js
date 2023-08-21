import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PostPlaceHeader from "../components/Header/PostPlaceHeader";
import Comment from "../components/Comment/Comment";
import { useDeleteCommentMutation, useEditCommentMutation, useGetSingleReplyMutation, useReplyCommentMutation } from "../Redux/services/serviceApi";
import { COLORS, FOITI_CONTS } from "../resources/theme";
import ServerError from "../components/Error/ServerError";
import InputBox from "../components/Comment/InputBox";
import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import CommentBottomSheet from "../components/CommentBottomSheet";
import ModalComponent from "../components/ModalComponent";
import CustomAlert from "../components/CustomAlert";
import { clearAlert } from "../Redux/slices/alertSlice";
import CommentEngagement from "../components/Comment/CommentEngagement";
import { useBackHandler } from "@react-native-community/hooks";
const { width, height } = Dimensions.get("screen");

const CommentReplies = ({ route }) => {
  const { parentComment, showInputField = false } = route.params;
  const [parentCommentData, setParentCommentData] = useState(parentComment)
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const REDUXUSER = useSelector((state) => state.AUTHUSER);
  const REDUXNAVIGATION = useSelector(state => state.ADD_NAVIGATION);
  const REDUXALERT = useSelector((state) => state.REDUXALERT);
  const [replies, setReplies] = useState([]);
  const [selectedComment, setSelectedComment] = useState({});
  const [moreReplies, setMoreReplies] = useState(0);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);
  const [noMoreComment, setNoMoreComment] = useState(false);
  const [firstFetch, setFirstFetch] = useState(true);
  const [showInput, setShowInput] = useState(showInputField);
  const [body, setBody] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [commentDeleted, setCommentDeleted] = useState(false);
  const inputRef = useRef("");

  const [getSingleReply, {
    isLoading,
    isSuccess,
    isError,
    data,
    error }] =
    useGetSingleReplyMutation();

  const [editComment, {
    isSuccess: editIsSuccess,
    isError: editIsError,
    isLoading: editIsLoading,
    data: editData,
    error: editError
  }] = useEditCommentMutation();

  const [deleteComment, {
    isSuccess: deleteIsSuccess,
    isError: deleteIsError,                                 
    isLoading: deleteIsLoading,
    error: deleteError
  }] = useDeleteCommentMutation();


  const [replyComment,
    {
      isLoading: replyIsLoading,
      isSuccess: replyIsSuccess,
      isError: replyIsError,
      data: replyData,
      error: replyError
    }] = useReplyCommentMutation();

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


  useEffect(() => {
    setIsUnmounted(false);
    const body = {
      token: REDUXUSER.token,
      parent_id: parentCommentData._id,
      skip: 0,
      limit: limit,
      noMoreComment: false,
    };

    getSingleReply(body);
    return () => setIsUnmounted(true);
  }, []);

  useEffect(() => {
    if (isSuccess && !isUnmounted) {
      if (data.replies.length > 0) {
        if (firstFetch) {
          setReplies(data.replies);
        } else {
          setReplies([...replies, ...data.replies]);
        }
        setSkip(data.skip);
        setMoreReplies(data.moreCommentToShow);
        setNoMoreComment(data.noMoreComment)
        setFirstFetch(false);
        setIsRefreshing(false);
      }
    }

    if (isError && !isUnmounted) {
      setIsRefreshing(false);
      if(error.status === 404){
        setCommentDeleted(true)
      }
    }
  }, [isSuccess, isError]);

  //Reply comment 
  useEffect(() => {
    if (replyIsSuccess && !isUnmounted) {
      setBody("");
      if (replyData?.comment) {
        if (moreReplies === 0) {
          setReplies([...replies, replyData.comment]);
        } else {
          setMoreReplies(num => num + 1);
        }
      }
    }

    if (replyIsError && !isUnmounted) {
      setBody("");
      dispatch(
        setAlert({ type: "comment", message: "Opps! Please try again." })
      );
    }
  }, [replyIsSuccess, replyIsError]);

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

  //Editing comment
  useEffect(() => {
    if (editIsSuccess && !isUnmounted) {
      setBody("");
      setSelectedComment({});
      if(editData?.comment?._id.toString() === parentCommentData._id.toString()){
        setParentCommentData(editData.comment);
      }
      reload();
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
      if(selectedComment._id === parentCommentData._id){
        setSelectedComment({});
        // navigation.goBack();
        closeDeletModal();
      }
      // _onRefresh()
      reload();
    }

    if (deleteIsError && !isUnmounted) {
      setSelectedComment({});
      dispatch(
        setAlert({ type: "comment", message: "Opps! Please try again." })
      );
    }
  }, [deleteIsSuccess, deleteIsError]);

  const reload = () => {
    if (isUnmounted) return;
    setReplies([]);
    setFirstFetch(true);
    setSkip(0)
    setMoreReplies(0)

    const body = {
      token: REDUXUSER.token,
      parent_id: parentCommentData._id,
      skip: 0,
      limit,
      noMoreComment: false,
    };

    getSingleReply(body);
  }

  const _refreshReplies = () => {
    if (isUnmounted) return;
    setIsRefreshing(true);
    setReplies([]);
    setFirstFetch(true);
    setSkip(0)
    setMoreReplies(0)

    const body = {
      token: REDUXUSER.token,
      parent_id: parentCommentData._id,
      skip: 0,
      limit,
      noMoreComment: false,
    };

    getSingleReply(body);
  }

  const loadingMore = () => {
    if (noMoreComment) return;
    const body = {
      token: REDUXUSER.token,
      parent_id: parentCommentData._id,
      skip,
      limit,
      noMoreComment,
    };

    getSingleReply(body);
  }
  //BELOW CODES ARE FOR REPLYING
  const onPressReply = () => {
    setShowInput(true);
  }
  const hideInput = () => {
    setShowInput(false);
  }
  const setCommentBody = (value) => {
    setErrorMsg("");
    setBody(value);
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

  //POST COMMENT
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
          post_id: parentCommentData.post_id,
          comment_id: parentCommentData._id,
          body
        }
        replyComment(postData);
      }
    }
  }

  //Edit comment
  const editCommentPressed = () => {
    setIsVisible(false);
    if (!selectedComment?._id) return;
    setBody(selectedComment?.body);
    onPressReply();
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

  //NAVIGATE TO COMMENT
  const closeDeletModal = () => {
    setCommentDeleted(false);
    navigation.pop();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ paddingHorizontal:7 }}>
        <PostPlaceHeader title="Replies" />
      </View>
      {isError ? (
        <>
        {commentDeleted ? (
          <View style={{ height, width, backgroundCOlor: "#fff" }}>
            <ModalComponent
              body="This comment has been deleted."
              closeModal={closeDeletModal}
              modalVisible={commentDeleted}
            />
          </View>
        ): (
          <ServerError onPress={reload} />
        )}
        </>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={_refreshReplies}
                tintColor={"#f8852d"}
              />
            }
          >
            <View style={{ backgroundColor: "#ededed", paddingHorizontal: 7, paddingVertical:10, paddingBottom: 0 }}>
                <Comment item={parentCommentData} hideReplies={true} onPressReply={onPressReply} hideEngagement={true} openBottomSheet={() => openBottomSheet(parentCommentData)} />
            </View>
            <View style={{ paddingVertical: 5, paddingHorizontal: 15, marginBottom: 10 }}>
              <CommentEngagement comment={parentCommentData} onPressReply={() => onPressReply(parentCommentData)} />
            </View>
              <View style={{ paddingHorizontal: 7, }}>
              {replies.map((reply) => (
                <Comment key={reply._id} item={reply} onPressReply={onPressReply} openBottomSheet={() => openBottomSheet(reply)} />
              ))}
            </View>
            {moreReplies > 0 && (
              <View
                style={{
                  paddingLeft: FOITI_CONTS.padding + 5,
                  paddingRight: FOITI_CONTS.padding + 10,
                }}
              >
                {!isLoading && <TouchableOpacity onPress={loadingMore}>
                  <Text style={{ fontWeight: "bold" }}>
                    {moreReplies} more {moreReplies === 1 ? "reply" : "replies"}
                  </Text>
                </TouchableOpacity>}
              </View>
            )}
            {((isLoading && !isRefreshing) || replyIsLoading) && (
              <View style={{ paddingVertical: 10 }}>
                <ActivityIndicator size="large" color={COLORS.foiti} />
              </View>
            )}
          </ScrollView>
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
          <ModalComponent
            body="Are you sure you want to delete the comment?"
            closeModal={closeConfirmModal}
            modalVisible={confirmDeleteModal}
            confirmModal={true}
            confirmDelete={confirmDelete}
            cancelDelete={closeConfirmModal}
          />
          {showAlert && <CustomAlert text={REDUXALERT?.message} />}
        </>
      )}
    </View>
  );
};

export default CommentReplies;

const styles = StyleSheet.create({});

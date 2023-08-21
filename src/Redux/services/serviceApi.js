import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@env";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BACKEND_URL}` }),
  tagTypes: [
    "Post",
    "User",
    "PostDetails",
    "OtherUser",
    "Followers",
    "Notification",
    "InAppNotification",
    "AllInAppNotification",
    "BlockList",
    "TripList",
    'Chat',
  ],
  keepUnusedDataFor: 10,
  endpoints: (builder) => ({
    //======================QUERIES FOR USER===========================
    // VIEW OWN PROFILE
    viewOwnProfile: builder.query({
      query: (body) => ({
        url: `/user/v10`,
        method: "GET",
        headers: { token: body.token, ip: body.ip },
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 1,
    }),
    //REGISTER USER
    registerUser: builder.mutation({
      query: (body) => ({
        url: `/user/register`,
        method: "POST",
        body,
      }),
    }),
    //LOGIN USER
    loginUser: builder.mutation({
      query: (body) => {
        return {
          url: `/user/login`,
          method: "POST",
          body,
        }
      },
    }),

    //LOGIN WITH GOOGLE
    loginWithGoogle: builder.mutation({
      query: (body) => {
        return {
          url: "/user/login/google",
          method: "POST",
          headers: { access_token: body.access_token },
          body,
        }
      },
    }),
    //LOGIN WITH FACEBOOK
    loginWithFacebook: builder.mutation({
      query: (body) => {
        return {
          url: "/user/login/facebook",
          method: "POST",
          headers: { access_token: body.access_token },
          body,
        }
      },
    }),
    //ADD NAME
    addName: builder.mutation({
      query: (body) => ({
        url: `/user/welcome`,
        method: "POST",
        headers: { token: body.token },
        body,
      }),
    }),
    //EDIT PROFILE
    editProfile: builder.mutation({
      query: (body) => ({
        url: `/user`,
        method: "PUT",
        headers: { token: body.token },
        body,
      }),
      invalidatesTags: ["User"],
    }),
    //ADD CURRENT LOCATION
    addCurrentLocation: builder.mutation({
      query: (body) => {
        return {
          url: `/user`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
      invalidatesTags: ["User"],
    }),

    //REMOVE CURRENT LOCATION
    removeCurrentLocation: builder.mutation({
      query: (body) => {
        return {
          url: `/user`,
          method: "DELETE",
          headers: { token: body.token },
          body,
        }
      },
      invalidatesTags: ["User"],
    }),
    //UPLOAD PROFILE IMAGE
    uploadProfileImage: builder.mutation({
      query(body) {
        const formData = new FormData()
        formData.append("image", body.file)
        return {
          url: "user/changeProfileImage",
          method: "POST",
          headers: { token: body.token },
          body: formData,
        }
      },
      invalidatesTags: ["User"],
    }),
    //UPLOAD COVER IMAGE
    uploadCoverImage: builder.mutation({
      query(body) {
        const formData = new FormData()
        formData.append("cover", body.file)
        return {
          url: "user/changeCover",
          method: "POST",
          headers: { token: body.token },
          body: formData,
        }
      },
      invalidatesTags: ["User"],
    }),
    //CHANGE PASSWORD
    updatePassword: builder.mutation({
      query: (body) => ({
        url: `user/updatePassword`,
        method: "POST",
        headers: { token: body.token },
        body,
      }),
    }),
    //CHANGE EMAIL
    updateEmail: builder.mutation({
      query: (body) => ({
        url: `user/update`,
        method: "PUT",
        headers: { token: body.token },
        body,
      }),
      invalidatesTags: ["User"],
    }),

    //CHANGE USERNAME
    updateUsername: builder.mutation({
      query: (body) => ({
        url: `user/update`,
        method: "POST",
        headers: { token: body.token },
        body,
      }),
    }),

    //CHANGE Phone Number
    updatePhone: builder.mutation({
      query: (body) => ({
        url: `user/update`,
        method: "PATCH",
        headers: { token: body.token },
        body,
      }),
    }),

    //GET ALL POSTS OF A USER
    getPosts: builder.query({
      query: (body) => {
        return {
          url: `/user/posts/${body.userId}`,
          method: "POST",
          headers: { token: body.token },
          body,
          keepUnusedDataFor: 2,
        }
      },
      providesTags: ["Post"],
      invalidatesTags: ["Post"],
      keepUnusedDataFor: 5,
    }),

    //CREATE FEEDBACK
    createFeedback: builder.mutation({
      query: (body) => ({
        url: `feedback`,
        method: "POST",
        headers: { token: body.token },
        body,
      }),
    }),

    //VIEW OTHERS PROFILE
    viewOthersProfile: builder.query({
      query(body) {
        return {
          url: `/user/v10/${body.userId}`,
          method: "GET",
          headers: { token: body.token, ip: body.ip },
        }
      },
      providesTags: ["OtherUser"],
      keepUnusedDataFor: 1,
    }),

    //FOLLOW UNFOLLOW USER
    followUnfollowUser: builder.mutation({
      query(body) {
        return {
          url: `/user/${body.ownerId}`,
          method: "POST",
          headers: { token: body.token },
        }
      },
      invalidatesTags: ["OtherUser", "Followers"],
    }),
    //VIEW FOLLOWERS AND FOLLOWING LIST
    viewFollowersFollowingList: builder.query({
      query(body) {
        return {
          url: `/user/followDetails/${body.userId}`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      invalidatesTags: ["User"],
      providesTags: ["Followers", "OtherUser"],
      keepUnusedDataFor: 1,
    }),

    //GET RECOMMENDED TRAVELLERS
    getRecommendedTravellers: builder.query({
      query(body) {
        return {
          url: `/user/recommendedTravellers`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      keepUnusedDataFor: 1,
    }),
    //SET USER PUSH NOTIFICATION TOKEN
    setUserPushNotificationToken: builder.mutation({
      query(body) {
        return {
          url: `/user/setExpoToken`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),
    //SET USER PUSH NOTIFICATION TOKEN
    removeUserPushNotificationToken: builder.mutation({
      query(body) {
        return {
          url: `/user/setExpoToken`,
          method: "DELETE",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET NOTIFICATION DETAILS
    getNotificationSettings: builder.query({
      query(body) {
        return {
          url: `/user/notification`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      providesTags: ["Notification"],
      keepUnusedDataFor: 1,
    }),
    //SET NOTIFICATION DETAILS
    setNotificationSettings: builder.mutation({
      query(body) {
        return {
          url: `/user/notification`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
      invalidatesTags: ["Notification"],
    }),

    //RESET PASSWORD: SEND EMAIL
    sendResetPasswordEmail: builder.mutation({
      query(body) {
        return {
          url: `/user/resetPassword`,
          method: "POST",
          body,
        }
      },
    }),

    //RESET PASSWORD: CHECK OTP
    checkResetPasswordOtp: builder.mutation({
      query(body) {
        return {
          url: `/user/resetPassword/${body.id}`,
          method: "POST",
          body,
        }
      },
    }),
    //RESET PASSWORD: CREATE NEW PASSWORD
    createNewPassword: builder.mutation({
      query(body) {
        return {
          url: `/user/resetPassword/${body.id}`,
          method: "PUT",
          body,
        }
      },
    }),

    //DEACTIVATE USER
    deactivateUser: builder.mutation({
      query(body) {
        return {
          url: `/user/deactivate`,
          headers: { token: body.token },
          method: "POST",
          body,
        }
      },
    }),
    contribututions: builder.query({
      query(body) {
        return {
          url: `user/contributions/${body.user_id}`,
          headers: { token: body.token },
          method: "GET",
        }
      },
    }),

    //BLOCK USER
    blockUser: builder.mutation({
      query(body) {
        return {
          url: `user/block`,
          headers: { token: body.token },
          method: "POST",
          body,
        }
      },
      invalidatesTags: ["BlockList"],
    }),

    //UNBLOCK USER
    unblockUser: builder.mutation({
      query(body) {
        return {
          url: `user/block`,
          headers: { token: body.token },
          method: "PUT",
          body,
        }
      },
      invalidatesTags: ["BlockList"],
    }),

    //USER BLOCK LIST
    userBlockList: builder.query({
      query(body) {
        return {
          url: `user/block`,
          headers: { token: body.token },
          method: "GET",
        }
      },
      providesTags: ["BlockList"],
      keepUnusedDataFor: 1,
    }),

    //REPORT USER
    reportUser: builder.mutation({
      query(body) {
        return {
          url: `user/report`,
          headers: { token: body.token },
          method: "POST",
          body,
        }
      },
    }),

    //GET USER HOME TOWN
    getHomeTown: builder.query({
      query: (body) => {
        return {
          url: `/user/hometown`,
          method: "GET",
          headers: { token: body.token },
          keepUnusedDataFor: 2,
        }
      },
      keepUnusedDataFor: 1,
    }),

    //GET USER HOME TOWN
    getTopContributor: builder.query({
      query: (body) => {
        return {
          url: `/user/top-contributors?type=${body?.type}&value=${body?.value}&place_id=${body?.place_id}`,
          method: "GET",
          headers: { token: body.token },
          keepUnusedDataFor: 2,
        }
      },
      keepUnusedDataFor: 1,
    }),

    //====================QUERIES FOR POSTS====================
    //ADD POST
    addPost: builder.mutation({
      query(body) {
        const formData = new FormData()
        formData.append("postImage", body.file)
        formData.append("details", body.details)
        formData.append("caption", body.caption)
        return {
          url: "post",
          method: "POST",
          headers: { token: body.token },
          body: formData,
        }
      },
      invalidatesTags: ["Post", "User"],
    }),

    //EDIT POST
    editPost: builder.mutation({
      query(body) {
        return {
          url: `post/${body.postId}`,
          method: "PUT",
          headers: { token: body.token },
          body,
        }
      },
      invalidatesTags: ["Post", "User", "PostDetails"],
    }),

    //DELETE POST
    deletePost: builder.mutation({
      query(body) {
        return {
          url: `post/${body.postId}`,
          method: "DELETE",
          headers: { token: body.token },
        }
      },
      invalidatesTags: ["Post", "User", "PostDetails"],
    }),

    //ADD COORDINATES
    addPostCoordinates: builder.mutation({
      query(body) {
        return {
          url: "post/add-coordinates",
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
      invalidatesTags: ["Post", "User"],
    }),

    //GET SINGLE POST
    getSinglePost: builder.query({
      query(body) {
        return {
          url: `/post/${body.postId}`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
      providesTags: ["PostDetails"],
      keepUnusedDataFor: 1,
    }),

    //GET RANDOM POSTS
    getRandomPosts: builder.mutation({
      query(body) {
        return {
          url: `/post/random`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //LIKE UNLIKE POST
    likeUnlikePost: builder.query({
      query(body) {
        return {
          url: `post/like/${body.postId}`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      invalidatesTags: ["PostDetails"],
    }),

    //SAVE UNSAVE POST
    // saveUnsavePost: builder.query({
    //   query(body) {
    //     return {
    //       url: `post/save/${body.postId}`,
    //       method: "GET",
    //       headers: { token: body.token },
    //     }
    //   },
    //   invalidatesTags: ["PostDetails"],
    // }),

    //SAVE UNSAVE POST
    saveUnsavePost: builder.mutation({
      query(body) {
        return {
          url: `post/save/${body.postId}`,
          method: "POST",
          headers: { token: body.token },
        }
      },
      invalidatesTags: ["PostDetails"],
    }),

    //GET SAVED POST
    getSavedPost: builder.mutation({
      query(body) {
        return {
          url: `post/savedPosts`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //DIRECTION CLICKED ON POST
    directionClickedOnPost: builder.mutation({
      query(body) {
        return {
          url: `/post/directionClick/${body.postId}`,
          method: "POST",
          headers: { token: body.token },
        }
      },
    }),

    //REPORT POST
    reportPost: builder.mutation({
      query(body) {
        return {
          url: `/post/report`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //POST LIKED USER LIST
    getPostLikedUsers: builder.mutation({
      query(body) {
        return {
          url: `/post/likedUsers/${body.postId}`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET NEARBY POST
    getNearbyPost: builder.mutation({
      query(body) {
        return {
          url: `/post/explore-nearby`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET NEARBY POST
    getNearbyPostForHome: builder.mutation({
      query(body) {
        return {
          url: `/post/explore-nearby-home`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //POST MAP MARKER
    exploreMapPost: builder.mutation({
      query(body) {
        return {
          url: `/post/map-posts`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //POST MAP DATA LIST
    exploreMapPostData: builder.mutation({
      query(body) {
        return {
          url: `/post/map-post-data`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //PLACE ATTRACTION DETAILS
    exploreMapPostDetails: builder.mutation({
      query(body) {
        return {
          url: `/post/map-post-details`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //===============QUERIES FOR PLACE============================
    //GET PERTICULAR PLACE
    getPlace: builder.query({
      query: (body) => {
        return {
          url: `/place/${body.place_id}`,
          method: "GET",
          headers: { token: body.token, ip: body.ip },
        }
      },
    }),
    //SEARCH PLACE NOT IN USE
    searchPlace: builder.query({
      query: (body) => ({
        url: `/place/search?place=${body.place}&count=${body.count}`,
        method: "GET",
        headers: { token: body.token },
      }),
    }),
    //ADD EDIT REVIEW
    addEditReview: builder.mutation({
      query: (body) => ({
        url: `place/review/${body.place_id}`,
        method: "POST",
        headers: { token: body.token },
        body,
      }),
    }),

    //DIRECTION CLICKED ON PLACE
    directionClickedOnPlace: builder.mutation({
      query(body) {
        return {
          url: `/place/directionClick/${body.placeId}`,
          method: "POST",
          headers: { token: body.token },
        }
      },
    }),
    //PLACES VISITED LIST
    placesVisited: builder.query({
      query(body) {
        return {
          url: `/place/visited/${body.user_id}`,
          method: "GET",
          headers: { token: body.token, ip: body.ip },
        }
      },
    }),

    //GET PLACE DESTINATIONS
    getPlaceDestinations: builder.mutation({
      query(body) {
        return {
          url: `/place/destinations`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET POPULAR PLACES
    getPopularPlaces: builder.mutation({
      query(body) {
        return {
          url: `/place/popular-places`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //PLACE ATTRACTION LIST
    getAttractions: builder.mutation({
      query(body) {
        return {
          url: `/place/attractions`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //PLACE ATTRACTION LIST for version 6
    // exploreMapPlace: builder.mutation({
    //   query(body) {
    //     return {
    //       url: `/place/map-places`,
    //       method: "POST",
    //       headers: { token: body.token },
    //       body,
    //     };
    //   },
    // }),

    //PLACE ATTRACTION LIST for version 7
    exploreMapPlaces: builder.mutation({
      query(body) {
        return {
          url: `/place/map-places-v8`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //PLACE ATTRACTION DETAILS
    exploreMapPlaceDetails: builder.mutation({
      query(body) {
        return {
          url: `/place/map-place-details`,
          method: "POST",
          headers: { token: body.token },
          body,
        };
      },
    }),

    //GET ALL PLACE ATTRACTION LIST
    // exploreAllMapPlace: builder.query({
    //   query(body) {
    //     return {
    //       url: `/place/map-places`,
    //       method: "GET",
    //       headers: { token: body.token },
    //     };
    //   },
    // }),

    //===============QUERIES FOR JOIN REQUEST============================
    //SEND JOIN REQUEST
    sendJoinRequest: builder.mutation({
      query(body) {
        return {
          url: `/user/join`,
          method: "POST",
          body,
        }
      },
    }),

    //===============UPDATE NOTIFICATION ======================================
    //GET UPDATE NOTIFICATION
    getUpdateNotification: builder.query({
      query() {
        return {
          url: `/updateNotification`,
          method: "GET",
        }
      },
      keepUnusedDataFor: 1,
    }),

    //=============APP USAGE TIME =========================
    //POST APP USAGE TIME
    postUsageTime: builder.mutation({
      query(body) {
        return {
          url: `/usageTime/v9`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //POST APP USAGE TIME
    getUserSession: builder.mutation({
      query(body) {
        return {
          url: `/usageTime/get-user-docs`,
          method: "POST",
          headers: { token: body.token },
        }
      },
    }),

    //==============IN APP NOTIFICATION=================
    //GET NEW NOTIFICAITION COUNT
    getNewInAppNotificationCount: builder.query({
      query(body) {
        return {
          url: `/inAppNotification`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      providesTags: ["InAppNotification"],
      keepUnusedDataFor: 1,
    }),

    //GET ALL NOTIFICAITION
    getAllInAppNotification: builder.mutation({
      query(body) {
        return {
          url: `/inAppNotification/viewNotification`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
      invalidatesTags: ["InAppNotification"],
      providesTags: ["AllInAppNotification"],
      keepUnusedDataFor: 1,
    }),

    //READ NOTIFICAITION
    readInAppNotification: builder.mutation({
      query(body) {
        return {
          url: `/inAppNotification`,
          method: "POST",
          headers: { token: body.token },
          body: { notification: body.notification },
        }
      },
      invalidatesTags: ["InAppNotification", "AllInAppNotification"],
      keepUnusedDataFor: 1,
    }),

    //MARK ALL NOTIFICAITION READ
    markAllNotificationRead: builder.mutation({
      query(body) {
        return {
          url: `/inAppNotification`,
          method: "PUT",
          headers: { token: body.token },
        }
      },
      invalidatesTags: ["InAppNotification", "AllInAppNotification"],
      keepUnusedDataFor: 1,
    }),

    //MARK ALL NOTIFICAITION READ
    deleteNotification: builder.mutation({
      query(body) {
        return {
          url: `/inAppNotification`,
          method: "DELETE",
          headers: { token: body.token },
          body: { notification: body.notification },
        }
      },
      invalidatesTags: ["InAppNotification", "AllInAppNotification"],
      keepUnusedDataFor: 1,
    }),

    //HELP AND SUPPORT
    sendHelpQuery: builder.mutation({
      query(body) {
        return {
          url: `/helpSupport`,
          method: "POST",
          headers: { token: body.token },
          body: { query: body.query },
        }
      },
    }),

    //===============QUERIES FOR COMMENT ON POST============================
    getCommentAndCount: builder.query({
      query(body) {
        return {
          url: `/comment/total-comment/${body.post_id}`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      keepUnusedDataFor: 1,
    }),

    //GET ALL COMMENTS
    getAllComments: builder.mutation({
      query(body) {
        return {
          url: `/comment/all-comments/${body.post_id}`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
      keepUnusedDataFor: 1,
    }),
    //ADD COMMENT
    addComment: builder.mutation({
      query(body) {
        return {
          url: `/comment/create/${body.post_id}`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),
    //REPLY COMMENT
    replyComment: builder.mutation({
      query(body) {
        return {
          url: `/comment/reply/${body.post_id}/${body.comment_id}`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),
    //LIKE UNLIKE COMMENT
    likeUnlikeComment: builder.mutation({
      query(body) {
        return {
          url: `/comment/${body.comment_id}`,
          method: "POST",
          headers: { token: body.token },
        }
      },
    }),
    //EDIT COMMENT
    editComment: builder.mutation({
      query(body) {
        return {
          url: `/comment/${body.comment_id}`,
          method: "PATCH",
          headers: { token: body.token },
          body,
        }
      },
    }),
    //DELETE COMMENT
    deleteComment: builder.mutation({
      query(body) {
        return {
          url: `/comment/${body.comment_id}`,
          method: "DELETE",
          headers: { token: body.token },
        }
      },
    }),

    //SHOW FIRST REPLY
    getSingleReply: builder.mutation({
      query(body) {
        return {
          url: `/comment/replies`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //REPORT COMMENT
    reportComment: builder.mutation({
      query(body) {
        return {
          url: `/comment/report`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //===============QUERIES FOR TRIP PLAN============================

    //ADD TRIP PLAN
    addTrip: builder.mutation({
      query(body) {
        return {
          url: `/trip/add`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //UPDATE TRIP PLAN
    updateTrip: builder.mutation({
      query(body) {
        return {
          url: `/trip/update`,
          method: "PATCH",
          headers: { token: body.token },
          body,
        }
      },
      invalidatesTags: ["TripList"],
    }),

    //DELET TRIP PLAN
    deleteTrip: builder.mutation({
      query(body) {
        return {
          url: `/trip/update`,
          method: "DELETE",
          headers: { token: body.token },
          body,
        }
      },
      invalidatesTags: ["TripList"],
    }),
    //GET ACTIVE TRIP COUNT
    getTotalActiveTrip: builder.query({
      query(body) {
        return {
          url: `/trip/active-trips/${body.user_id}`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      providesTags: ["TripList"],
      keepUnusedDataFor: 1,
    }),
    //===============QUERIES FOR CHATS============================
    //GET ALL CHATS
    getAllChats: builder.mutation({
      query(body) {
        return {
          url: `/chat/all-chats`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
      providesTags: ["Chat"],
      keepUnusedDataFor: 1,
    }),

    //GET IF UNREAD MESSAGES EXIST
    getUnreadMsg: builder.query({
      query(body) {
        return {
          url: `message/unreadMsg`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      invalidatesTags:['Chat'],
      keepUnusedDataFor: 1,
    }),

    //===============QUERIES FOR MEET UP============================
    //UPDATE PROFILE FOR MEETUP
    updateProfile: builder.mutation({
      query(body) {
        return {
          url: "meetup/update-profile",
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET ALL TRAVELLERS WITH TRIP PLANS
    getTravellers: builder.mutation({
      query(body) {
        return {
          url: "meetup/trip-travellers",
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET ALL LOCALS
    getLocals: builder.mutation({
      query(body) {
        return {
          url: "meetup/locals/v10",
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET TRAVELLER DETAILS
    getTravellerDetails: builder.query({
      query(body) {
        return {
          url: `meetup/traveller-details/${body.trip_id}/${body.ip}`,
          method: "GET",
          headers: { token: body.token },
        }
      },
    }),

    //GET TRAVELLER DETAILS
    getLocalDetails: builder.query({
      query(body) {
        return {
          url: `meetup/local-details/${body.userId}/${body.ip}`,
          method: "GET",
          headers: { token: body.token },
        }
      },
      keepUnusedDataFor: 1
    }),

    //REQUEST MEETUP
    meetupRequest: builder.mutation({
      query(body) {
        return {
          url: `meetup/meetup-request`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET MEETUP UNREAD CHAT AND REQUEST
    getMeetupUnreadRequest: builder.query({
      query(body) {
        return {
          url: `meetup/meetup-unread`,
          method: "get",
          headers: { token: body.token },
        }
      },
      keepUnusedDataFor: 1,
    }),

    // MEETUP REQUEST RESPONSE
    meetupRequestResponse: builder.mutation({
      query(body) {
        return {
          url: `meetup/meetup-request-response`,
          method: "POST",
          headers: { token: body.token },
          body,
        }
      },
    }),

    //GET MESSAGE RECEIVER USER
    getReceiverUser: builder.query({
      query(body) {
        return {
          url: `meetup-message/get-user-details/${body.chatId}`,
          method: "GET",
          headers: { token: body.token },
        }
      },
    }),
  }),
})

export const {
  useViewOwnProfileQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoginWithGoogleMutation,
  useLoginWithFacebookMutation,
  useAddNameMutation,
  useEditProfileMutation,
  useAddCurrentLocationMutation,
  useRemoveCurrentLocationMutation,
  useUploadProfileImageMutation,
  useUploadCoverImageMutation,
  useUpdatePasswordMutation,
  useUpdateEmailMutation,
  useUpdateUsernameMutation,
  useUpdatePhoneMutation,
  useCreateFeedbackMutation,
  useGetPostsQuery,
  useAddPostMutation,
  useEditPostMutation,
  useAddPostCoordinatesMutation,
  useSearchPlaceQuery,
  useGetPlaceQuery,
  useAddEditReviewMutation,
  useGetSinglePostQuery,
  useGetRandomPostsMutation,
  useLikeUnlikePostQuery,
  useSaveUnsavePostMutation,
  useViewOthersProfileQuery,
  useFollowUnfollowUserMutation,
  useViewFollowersFollowingListQuery,
  useGetRecommendedTravellersQuery,
  useDeletePostMutation,
  useDirectionClickedOnPostMutation,
  useDirectionClickedOnPlaceMutation,
  useSetUserPushNotificationTokenMutation,
  useRemoveUserPushNotificationTokenMutation,
  useGetNotificationSettingsQuery,
  useSetNotificationSettingsMutation,
  useSendResetPasswordEmailMutation,
  useCheckResetPasswordOtpMutation,
  useCreateNewPasswordMutation,
  useSendJoinRequestMutation,
  useGetUpdateNotificationQuery,
  usePostUsageTimeMutation,
  useGetNewInAppNotificationCountQuery,
  useGetAllInAppNotificationMutation,
  useReadInAppNotificationMutation,
  useMarkAllNotificationReadMutation,
  useDeleteNotificationMutation,
  useDeactivateUserMutation,
  useContribututionsQuery,
  usePlacesVisitedQuery,
  useSendHelpQueryMutation,
  useGetSavedPostMutation,
  useReportPostMutation,
  useBlockUserMutation,
  useReportUserMutation,
  useGetPostLikedUsersMutation,
  useGetPlaceDestinationsMutation,
  useGetPopularPlacesMutation,
  useUserBlockListQuery,
  useUnblockUserMutation,
  useGetAttractionsMutation,
  useGetNearbyPostMutation,
  useGetCommentAndCountQuery,
  useGetAllCommentsMutation,
  useAddCommentMutation,
  useReplyCommentMutation,
  useLikeUnlikeCommentMutation,
  useGetSingleReplyMutation,
  useReportCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  // useExploreMapPlaceMutation,
  useExploreMapPlacesMutation,
  useExploreMapPlaceDetailsMutation,
  // useExploreAllMapPlaceQuery,
  useGetUnreadMsgQuery,
  useAddTripMutation,
  useUpdateTripMutation,
  useDeleteTripMutation,
  useGetHomeTownQuery,
  useGetTotalActiveTripQuery,
  useUpdateProfileMutation,
  useGetTravellersMutation,
  useGetLocalsMutation,
  useGetTravellerDetailsQuery,
  useGetLocalDetailsQuery,
  useMeetupRequestMutation,
  // useGetMeetupRequestQuery,
  useGetMeetupUnreadRequestQuery,
  useGetReceiverUserQuery,
  useMeetupRequestResponseMutation,
  useGetAllChatsMutation,
  useExploreMapPostMutation,
  useExploreMapPostDataMutation,
  useExploreMapPostDetailsMutation,
  useGetTopContributorQuery,
  useGetNearbyPostForHomeMutation,
  useGetUserSessionMutation
} = serviceApi;

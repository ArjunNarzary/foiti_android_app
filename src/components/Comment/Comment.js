import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ShowReplay from './ShowReplay';
import UserDetails from '../UserDetails';
import { COLORS, FOITI_CONTS } from '../../resources/theme';
import CommentEngagement from './CommentEngagement';
import moment from 'moment';
import ReadMore from '@fawazahmed/react-native-read-more';

const Comment = ({ item, onPressReply, showMoreReply, hideReport = false, openBottomSheet, hideEngagement = false, hideReplies = false }) => {
  const [comment, setComment] = useState(item);

  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ marginLeft:9 }}>
        <UserDetails
          details={comment?.author}
          profileUri={comment?.author?.profileImage?.thumbnail?.private_id}
          isHome={true}
          openBottomSheet={openBottomSheet}
          hideReport={hideReport}
          showTime={moment(comment.createdAt).fromNow()}
        />
      </View>
      <View style={{ marginTop: 5 }}>
        <View style={{ backgroundColor: COLORS.foitiGreyLighter, borderRadius: 12, padding: FOITI_CONTS.padding }}>
          <ReadMore
            numberOfLines={10}
            seeMoreText="more"
            seeMoreStyle={{ color: COLORS.foitiGrey }}
            expandOnly={true}
            style={{ lineHeight: 20 }}
          >
            {comment?.body}
          </ReadMore>
        </View>
        {!hideEngagement && <View style={{ paddingVertical: 5, paddingHorizontal: FOITI_CONTS.padding }}>
          <CommentEngagement comment={comment} onPressReply={() => onPressReply(comment)} hideReport={hideReport} />
        </View>}
      </View>
      {(comment.has_reply && !comment.parent_id && !hideReplies) && (
        <ShowReplay comment={comment} showMoreReply={() => showMoreReply(comment)} />
      )}
    </View>
  )
}

export default Comment

const styles = StyleSheet.create({})
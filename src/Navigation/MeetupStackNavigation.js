import React from "react";
import Place from "../screens/Place";
import Post from "../screens/Post";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile";
import Search from "../screens/Search";
import MaterialTopNavigation from "./MaterialTopNavigation";
import Contributions from "../screens/Contributions";
import PlacesVisited from "../screens/PlacesVisited";
import PostLikedUsers from "../screens/PostLikedUsers";
import PlaceHomeScreen from "../screens/PlaceHomeScreen";
import PopularPlaces from "../screens/PopularPlaces";
import ExplorePlace from "../screens/ExplorePlace";
import Comments from "../screens/Comments";
import CommentReplies from "../screens/CommentReplies";
import Chat from "../screens/Chat";
import SearchUser from "../screens/SearchUser";
import ChatBox from "../screens/ChatBox";
import Meetup from "../screens/Meetup";
import Local from "../screens/Local";
import Traveller from "../screens/Traveller";
import TripPlanList from "../screens/TripPlanList";
import TripPlanUpdate from "../screens/TripPlanUpdate";
import ChatTopNavigation from "./ChatTopNavigation";
import MeetupChatBox from "../screens/MeetupChatBox";
import ProfileStackNavigation from "./ProfileStackNavigation";
import AddCoordinates from "../screens/AddCoordinates";
import FoitiAmbassador from "../screens/FoitiAmbassador";

const Stack = createStackNavigator();

const MeetupStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Meetup via meetup" component={Meetup} />
      <Stack.Screen name="Search via meetup" component={Search} />
      <Stack.Screen name="Others profile via meetup" component={Profile} />
      <Stack.Screen name="Profile via meetup" component={ProfileStackNavigation}/>
      <Stack.Screen name="Place via meetup" component={Place} />
      <Stack.Screen name="PlaceHome via meetup" component={PlaceHomeScreen} />
      <Stack.Screen name="Post via meetup" component={Post} />
      <Stack.Screen name="Contribution via meetup" component={Contributions} />
      <Stack.Screen name="PlacesVisited via meetup" component={PlacesVisited} />
      <Stack.Screen name="PopularPlaces via meetup" component={PopularPlaces} />
      <Stack.Screen name="ExplorePlace via meetup" component={ExplorePlace} />
      <Stack.Screen name="PostLikedUsers via meetup" component={PostLikedUsers}/>
      <Stack.Screen name="FollowDetails via meetup" component={MaterialTopNavigation}/>
      <Stack.Screen name="Comments via meetup" component={Comments} />
      <Stack.Screen name="CommentReply via meetup" component={CommentReplies} />
      <Stack.Screen name="Chat via meetup" component={Chat} />
      <Stack.Screen name="SearchUser via meetup" component={SearchUser} />
      <Stack.Screen name="ChatBox via meetup" component={ChatBox} />
      <Stack.Screen name="Local via meetup" component={Local} />
      <Stack.Screen name="Traveller via meetup" component={Traveller} />
      <Stack.Screen name="TripPlanList via meetup" component={TripPlanList} />
      <Stack.Screen name="TripPlanUpdate via meetup" component={TripPlanUpdate}/>
      <Stack.Screen name="ChatTopNavigation via meetup" component={ChatTopNavigation}/>
      <Stack.Screen name="MeetupChatBox via meetup" component={MeetupChatBox} />
      <Stack.Screen name="AddCoordinates via meetup" component={AddCoordinates}/>
      <Stack.Screen name="FoitiAmbassador via meetup" component={FoitiAmbassador} />
    </Stack.Navigator>
  )
};

export default MeetupStackNavigation;

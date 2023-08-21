import React from "react";
import OwnProfile from "../screens/OwnProfile";
import Place from "../screens/Place";
import Post from "../screens/Post";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../screens/Profile";
import MaterialTopNavigation from "./MaterialTopNavigation";
import Contributions from "../screens/Contributions";
import PlacesVisited from "../screens/PlacesVisited";
import SavedPost from "../screens/SavedPost";
import PostLikedUsers from "../screens/PostLikedUsers";
import PlaceHomeScreen from "../screens/PlaceHomeScreen";
import PopularPlaces from "../screens/PopularPlaces";
import ExplorePlace from "../screens/ExplorePlace";
import Comments from "../screens/Comments";
import CommentReplies from "../screens/CommentReplies";
import Chat from "../screens/Chat";
import SearchUser from "../screens/SearchUser";
import ChatBox from "../screens/ChatBox";
import TripPlan from "../screens/TripPlan";
import TripPlanList from "../screens/TripPlanList";
import TripPlanUpdate from "../screens/TripPlanUpdate";
import ChatTopNavigation from "./ChatTopNavigation";
import MeetupChatBox from "../screens/MeetupChatBox";
import Local from "../screens/Local";
import Traveller from "../screens/Traveller";
import AddCoordinates from "../screens/AddCoordinates";
import FoitiAmbassador from "../screens/FoitiAmbassador";

const Stack = createStackNavigator();

const ProfileStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile Nav" component={OwnProfile} />
      <Stack.Screen name="Others profile via profile" component={Profile} />
      <Stack.Screen name="Place via profile" component={Place} />
      <Stack.Screen name="PlaceHome via profile" component={PlaceHomeScreen} />
      <Stack.Screen name="Post via profile" component={Post} />
      <Stack.Screen name="Contribution via profile" component={Contributions} />
      <Stack.Screen name="PopularPlaces via profile" component={PopularPlaces}/>
      <Stack.Screen name="ExplorePlace via profile" component={ExplorePlace} />
      <Stack.Screen name="PlacesVisited via profile" component={PlacesVisited}/>
      <Stack.Screen name="SavedPost via profile" component={SavedPost} />
      <Stack.Screen name="PostLikedUsers via profile" component={PostLikedUsers}/>
      <Stack.Screen name="FollowDetails via profile" component={MaterialTopNavigation}/>
      <Stack.Screen name="Comments via profile" component={Comments} />
      <Stack.Screen name="CommentReply via profile" component={CommentReplies} />
      <Stack.Screen name="Chat via profile" component={Chat} />
      <Stack.Screen name="SearchUser via profile" component={SearchUser} />
      <Stack.Screen name="Local via profile" component={Local} />
      <Stack.Screen name="Traveller via profile" component={Traveller} />
      <Stack.Screen name="ChatBox via profile" component={ChatBox} />
      <Stack.Screen name="TripPlan via profile" component={TripPlan} />
      <Stack.Screen name="TripPlanList via profile" component={TripPlanList} />
      <Stack.Screen name="TripPlanUpdate via profile" component={TripPlanUpdate} />
      <Stack.Screen name="ChatTopNavigation via profile" component={ChatTopNavigation} />
      <Stack.Screen name="MeetupChatBox via profile" component={MeetupChatBox} />
      <Stack.Screen name="AddCoordinates via profile" component={AddCoordinates} />
      <Stack.Screen name="FoitiAmbassador via profile" component={FoitiAmbassador} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigation;

import { createStackNavigator } from "@react-navigation/stack";
import Place from "../screens/Place";
import Post from "../screens/Post";
import Profile from "../screens/Profile";
import MaterialTopNavigation from "./MaterialTopNavigation";
import InAppNotification from "../screens/InAppNotification";
import Contributions from "../screens/Contributions";
import PlacesVisited from "../screens/PlacesVisited";
import PostLikedUsers from "../screens/PostLikedUsers";
import PlaceHomeScreen from "../screens/PlaceHomeScreen";
import PopularPlaces from "../screens/PopularPlaces";
import ExplorePlace from "../screens/ExplorePlace";
import Comments from "../screens/Comments";
import CommentReplies from "../screens/CommentReplies";
import Chat from "../screens/Chat";
import ChatBox from "../screens/ChatBox";
import SearchUser from "../screens/SearchUser";
import TripPlanList from "../screens/TripPlanList";
import TripPlanUpdate from "../screens/TripPlanUpdate";
import ChatTopNavigation from "./ChatTopNavigation";
import MeetupChatBox from "../screens/MeetupChatBox";
import FollowingPosts from "../screens/FollowingPosts";
import Local from "../screens/Local";
import Traveller from "../screens/Traveller";
import OwnProfile from "../screens/OwnProfile";
import AddCoordinates from "../screens/AddCoordinates";
import FoitiAmbassador from "../screens/FoitiAmbassador";

const Stack = createStackNavigator();
// ExploreStackNavigation
export default function FollowingStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Following Stack" component={FollowingPosts} />
      <Stack.Screen name="Others profile via following" component={Profile} />
      <Stack.Screen name="Profile via following" component={OwnProfile} />
      <Stack.Screen name="Place via following" component={Place} />
      <Stack.Screen name="PlaceHome via following" component={PlaceHomeScreen} />
      <Stack.Screen name="Post via following" component={Post} />
      <Stack.Screen name="Contribution via following" component={Contributions} />
      <Stack.Screen name="followingPlace via following" component={ExplorePlace} />
      <Stack.Screen name="PopularPlaces via following" component={PopularPlaces}/>
      <Stack.Screen name="PlacesVisited via following" component={PlacesVisited}/>
      <Stack.Screen name="PostLikedUsers via following" component={PostLikedUsers}/>
      <Stack.Screen name="FollowDetails via following" component={MaterialTopNavigation}/>
      <Stack.Screen name="InAppNotification via following" component={InAppNotification}/>
      <Stack.Screen name="Comments via following" component={Comments} />
      <Stack.Screen name="CommentReply via following" component={CommentReplies} />
      <Stack.Screen name="Chat via following" component={Chat} />
      <Stack.Screen name="SearchUser via following" component={SearchUser} />
      <Stack.Screen name="ChatBox via following" component={ChatBox} />
      <Stack.Screen name="Local via following" component={Local} />
      <Stack.Screen name="Traveller via following" component={Traveller} />
      <Stack.Screen name="TripPlanList via following" component={TripPlanList} />
      <Stack.Screen name="TripPlanUpdate via following" component={TripPlanUpdate} />
      <Stack.Screen name="ChatTopNavigation via following" component={ChatTopNavigation} />
      <Stack.Screen name="MeetupChatBox via following" component={MeetupChatBox} />
      <Stack.Screen name="AddCoordinates via following" component={AddCoordinates} />
      <Stack.Screen name="FoitiAmbassador via following" component={FoitiAmbassador} />
    </Stack.Navigator>
  );
}

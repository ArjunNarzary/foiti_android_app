import { createStackNavigator } from "@react-navigation/stack";
import Place from "../screens/Place";
import Post from "../screens/Post";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import InAppNotification from "../screens/InAppNotification";
import MaterialTopNavigation from "./MaterialTopNavigation";
import Contributions from "../screens/Contributions";
import PlacesVisited from "../screens/PlacesVisited";
import PostLikedUsers from "../screens/PostLikedUsers";
import PlaceHomeScreen from "../screens/PlaceHomeScreen";
import PopularPlaces from "../screens/PopularPlaces";
import ExplorePlace from "../screens/ExplorePlace";
import NearbyTopNavigation from "./NearbyTopNavigation";
import Comments from "../screens/Comments";
import CommentReplies from "../screens/CommentReplies";
import Chat from "../screens/Chat";
import SearchUser from "../screens/SearchUser";
import ChatBox from "../screens/ChatBox";
import Search from "../screens/Search";
import TripPlanList from "../screens/TripPlanList";
import TripPlanUpdate from "../screens/TripPlanUpdate";
import ChatTopNavigation from "./ChatTopNavigation";
import MeetupChatBox from "../screens/MeetupChatBox";
import Local from "../screens/Local";
import Traveller from "../screens/Traveller";
import TripPlan from "../screens/TripPlan";
import OwnProfile from "../screens/OwnProfile";
import AddCoordinates from "../screens/AddCoordinates";
import FoitiAmbassador from "../screens/FoitiAmbassador";

const Stack = createStackNavigator();

export default function HomeStackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home Stack" component={Home} />
      <Stack.Screen name="Others profile via home" component={Profile} />
      <Stack.Screen name="Profile via home" component={OwnProfile} />
      <Stack.Screen name="Search via home" component={Search} />
      <Stack.Screen name="Place via home" component={Place} />
      <Stack.Screen name="PlaceHome via home" component={PlaceHomeScreen} />
      <Stack.Screen name="Post via home" component={Post} />
      <Stack.Screen name="Contribution via home" component={Contributions} />
      <Stack.Screen name="PlacesVisited via home" component={PlacesVisited} />
      <Stack.Screen name="PostLikedUsers via home" component={PostLikedUsers} />
      <Stack.Screen name="PopularPlaces via home" component={PopularPlaces} />
      <Stack.Screen name="ExplorePlace via home" component={ExplorePlace} />
      <Stack.Screen name="InAppNotification via home" component={InAppNotification}/>
      <Stack.Screen name="FollowDetails via home" component={MaterialTopNavigation}/>
      <Stack.Screen name="Nearby via home" component={NearbyTopNavigation} />
      <Stack.Screen name="Comments via home" component={Comments} />
      <Stack.Screen name="CommentReply via home" component={CommentReplies} />
      <Stack.Screen name="SearchUser via home" component={SearchUser} />
      <Stack.Screen name="Local via home" component={Local} />
      <Stack.Screen name="Traveller via home" component={Traveller} />
      <Stack.Screen name="ChatBox via home" component={ChatBox} />
      <Stack.Screen name="TripPlan via home" component={TripPlan} />
      <Stack.Screen name="TripPlanList via home" component={TripPlanList} />
      <Stack.Screen name="TripPlanUpdate via home" component={TripPlanUpdate} />
      <Stack.Screen name="ChatTopNavigation via home" component={ChatTopNavigation}/>
      <Stack.Screen name="MeetupChatBox via home" component={MeetupChatBox} />
      <Stack.Screen name="AddCoordinates via home" component={AddCoordinates} />
      <Stack.Screen name="FoitiAmbassador via home" component={FoitiAmbassador} />
    </Stack.Navigator>
  )
}

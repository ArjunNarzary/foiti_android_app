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
import ExploreMap from "../screens/ExploreMap";
import ChatBox from "../screens/ChatBox";
import SearchUser from "../screens/SearchUser";
import Chat from "../screens/Chat";
import TripPlanList from "../screens/TripPlanList";
import TripPlanUpdate from "../screens/TripPlanUpdate";
import ChatTopNavigation from "./ChatTopNavigation";
import MeetupChatBox from "../screens/MeetupChatBox";
import Local from "../screens/Local";
import Traveller from "../screens/Traveller";
import OwnProfile from "../screens/OwnProfile";
import AddCoordinates from "../screens/AddCoordinates";
import FoitiAmbassador from "../screens/FoitiAmbassador";

const Stack = createStackNavigator();

export default function MapStackNavigation() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Map Stack" component={ExploreMap} />
        <Stack.Screen name="Others profile via map" component={Profile} />
        <Stack.Screen name="Profile via map" component={OwnProfile} />
        <Stack.Screen name="Place via map" component={Place} />
        <Stack.Screen name="PlaceHome via map" component={PlaceHomeScreen} />
        <Stack.Screen name="Post via map" component={Post} />
        <Stack.Screen name="Contribution via map" component={Contributions} />
        <Stack.Screen name="ExplorePlace via map" component={ExplorePlace} />
        <Stack.Screen name="PopularPlaces via map" component={PopularPlaces} />
        <Stack.Screen name="PlacesVisited via map" component={PlacesVisited} />
        <Stack.Screen name="PostLikedUsers via map" component={PostLikedUsers}/>
        <Stack.Screen name="FollowDetails via map" component={MaterialTopNavigation}/>
        <Stack.Screen name="InAppNotification via map" component={InAppNotification}/>
        <Stack.Screen name="Comments via map" component={Comments} />
        <Stack.Screen name="CommentReply via map" component={CommentReplies} />
        <Stack.Screen name="Chat via map" component={Chat} />
        <Stack.Screen name="SearchUser via map" component={SearchUser} />
        <Stack.Screen name="Local via map" component={Local} />
        <Stack.Screen name="Traveller via map" component={Traveller} />
        <Stack.Screen name="ChatBox via map" component={ChatBox} />
        <Stack.Screen name="TripPlanList via map" component={TripPlanList} />
        <Stack.Screen name="TripPlanUpdate via map" component={TripPlanUpdate}/>
        <Stack.Screen name="ChatTopNavigation via map" component={ChatTopNavigation}/>
        <Stack.Screen name="MeetupChatBox via map" component={MeetupChatBox} />
        <Stack.Screen name="AddCoordinates via map" component={AddCoordinates}/>
        <Stack.Screen name="FoitiAmbassador via map" component={FoitiAmbassador}/>
      </Stack.Navigator>
    )
}

import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Welcome from "../screens/Welcome";
import DrawerNavigation from "./DrawerNavigation";
import Search from "../screens/Search";
import NewPostScreen from "../screens/NewPostScreen";
import AddPlaceLocation from "../screens/AddPlaceLocation";
import Review from "../screens/Review";
import EditProfile from "../screens/EditProfile";
import Notification from "../screens/Notification";
import Settings from "../screens/Settings";
import ChangeEmail from "../screens/ChangeEmail";
import ChangePassword from "../screens/ChangePassword";
import ChangePhone from "../screens/ChangePhone";
import MaterialTopNavigation from "./MaterialTopNavigation";
import Feedback from "../screens/Feedback";
import HelpSupport from "../screens/HelpSupport";
import ChangeUsername from "../screens/ChangeUsername";
import WebViewScreen from "../screens/WebViewScreen";
import CreatePlace from "../screens/CreatePlace";
import Post from "../screens/Post";
import NotFound from "../screens/ErrorScreens/NotFound";
import PostNotFound from "../screens/ErrorScreens/PostNotFound";
import PlaceNotFound from "../screens/ErrorScreens/PlaceNotFound";
import DeactivateScreen from "../screens/DeactivateScreen";
import LogoutScreen from "../screens/LogoutScreen";
import Profile from "../screens/Profile";
import Place from "../screens/Place";
import SavedPost from "../screens/SavedPost";
import Report from "../screens/Report";
import Help from "../screens/Help";
import BlockedUsers from "../screens/BlockedUsers";
import Traveller from "../screens/Traveller";
import Local from "../screens/Local";
import MeetupStackNavigation from "./MeetupStackNavigation";
import AddCoordinates from "../screens/AddCoordinates";

const Stack = createStackNavigator();
// const config = {
//   animation: "spring",
//   config: {
//     stiffness: 1000,
//     damping: 50,
//     mass: 3,
//     overshootClamping: false,
//     restDisplacementThreshold: 0.01,
//     restSpeedThreshold: 0.01,
//   },
// };

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // ...TransitionPresets.SlideFromRightIOS,
        // transitionSpec: { open: config, close: config },
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      mode="modal"
    >
      <Stack.Screen name="Home Navigation" component={DrawerNavigation} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="New Post" component={NewPostScreen} />
      <Stack.Screen name="Add Place Location" component={AddPlaceLocation} />
      <Stack.Screen name="Review" component={Review} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Change Email" component={ChangeEmail} />
      <Stack.Screen name="Change Username" component={ChangeUsername} />
      <Stack.Screen name="Change Password" component={ChangePassword} />
      <Stack.Screen name="Change Phone" component={ChangePhone} />
      <Stack.Screen name="Blocked Users" component={BlockedUsers} />
      <Stack.Screen name="FollowDetails" component={MaterialTopNavigation} />
      <Stack.Screen name="DeactivateScreen" component={DeactivateScreen} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
      <Stack.Screen name="Create Place" component={CreatePlace} />
      <Stack.Screen name="Post" component={Post} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Place" component={Place} />
      <Stack.Screen name="NotFound" component={NotFound} />
      <Stack.Screen name="PostNotFound" component={PostNotFound} />
      <Stack.Screen name="PlaceNotFound" component={PlaceNotFound} />
      <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
      <Stack.Screen name="SavedPost" component={SavedPost} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Traveller" component={Traveller} />
      <Stack.Screen name="Local" component={Local} />
      <Stack.Screen name="Meetup stack" component={MeetupStackNavigation} />
      <Stack.Screen name="AddCoordinates" component={AddCoordinates} />
    </Stack.Navigator>
  );
}

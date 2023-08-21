import "react-native-gesture-handler";
import "expo-dev-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StatusBar as nativeStatusBar } from "react-native";
import Router from "./src/Navigation/Router";
import store from "./src/Redux/store";
import { Provider } from "react-redux";
import { useEffect, useRef, useState } from "react";
import publicIP from "react-native-public-ip";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import { config } from "./src/utils/deepLinkConfigs";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";
import * as WebBrowser from 'expo-web-browser';

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// const prefix = Linking.makeUrl("/");

let preData = null;

//HANDLE NOTIFICAITON CLICKED
Notifications.addNotificationResponseReceivedListener((response) => {
  _handleNotificationResponse(response);
});

//HANDLE NOTIFICATION
const _handleNotificationResponse = async (response) => {
  const { id, screen, name } = response?.notification?.request?.content?.data;
  let link = Linking.createURL("/");
  if (screen === "profile") {
    link = Linking.createURL("/" + id);
  } else if (screen === "post") {
    link = Linking.createURL("post/" + id);
  } else if (screen === "follow_details") {
    link = Linking.createURL("followDetails/" + id + "/" + name);
  } else if (screen === "chat") {
    link = Linking.createURL("chat");
  } else {
    link = Linking.createURL("/");
  }
  preData = Linking.parse(link);
  Linking.openURL(link);
};

export default function App() {
  const [ip, setIp] = useState("");
  const [data, setData] = useState(preData);
  const [notification, setNotification] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const notificationListener = useRef();

  const linking = {
    // prefixes: [prefix],
    prefixes: ["foiti://", "https://foiti.com"],
    config: config,
  };

  async function handleDeepLink(event) {
    let data = Linking.parse(event.url);
    setData(data);

    if (data?.path && data?.path.includes("privacy-policy")){
      await WebBrowser.openBrowserAsync('https://foiti.com/privacy-policy');
    } 
    else if (data?.path && data?.path.includes("terms-of-use")){
      await WebBrowser.openBrowserAsync('https://foiti.com/terms-of-use');
    }
    else if (data?.path && data?.path.includes("community-guidelines")){
      await WebBrowser.openBrowserAsync('https://foiti.com/community-guidelines');
    }else{
      setData(data);
    }
  }

  const _handleNotification = (notification) => {
    setNotification({ notification: notification.request.content.data });
  };

  useEffect(() => {
    //SHOWING SPLAH SCREEN
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        publicIP()
          .then((ip) => {
            setIp(ip);
          })
          .catch((error) => {
            console.log(error);
          });

        await new Promise((resolve) => setTimeout(resolve, 3000));
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
    //GET INITIAL URL FROM DEEP LINK
    async function getInitialURL() {
      let initialURL = await Linking.getInitialURL();
      if (initialURL) {
        setData(Linking.parse(initialURL));
      }
    }

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        _handleNotification(notification);
        setNotification(notification);
      });

    //Add linking event listener
    const subscription = Linking.addEventListener("url", handleDeepLink);

    if (!data) {
      getInitialURL();
    }

    return () => {
      setIp("");
      subscription.remove();
      notificationListener.current.remove();
    };
  }, []);

  const hideSplacehScreen = async () => {
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (appIsReady) {
      hideSplacehScreen();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider style={{ marginTop: nativeStatusBar.currentHeight }}>
        <Router ip={ip} linking={linking} />
        <StatusBar style="dark" backgroundColor="#fff" />
      </SafeAreaProvider>
    </Provider>
  );
}

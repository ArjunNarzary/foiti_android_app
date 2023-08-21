import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import {
  MaterialIcons,
  FontAwesome5,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

import BoxInput from "../components/BoxInput";
import { images, STYLES, COLORS } from "resources";
import CustomHorizontalLine from "../components/CustomHorizontalLine";
import { useLoginUserMutation, useLoginWithFacebookMutation, useLoginWithGoogleMutation } from "../Redux/services/serviceApi";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/slices/authSlice";
import { setItemInStore } from "../utils/handle";
import CustomAlert from "../components/CustomAlert";

const { width, height } = Dimensions.get("window");

GoogleSignin.configure({
  webClientId: processColor.env.WEB_CLIENTID
});

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const [deepLink, setDeepLink] = useState(null);
  const [unMounted, setUnMounted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const dispatch = useDispatch();
  const [loginUser, { data, error, isLoading, isError, isSuccess }] =
    useLoginUserMutation();

  const [loginWithGoogle, {
    data: googleData,
    error: googleError,
    isLoading: googleIsLoading,
    isSuccess: googleIsSuccess,
    isError: googleIsError
  }] = useLoginWithGoogleMutation();

  const [loginWithFacebook, {
    data: facebookData,
    error: facebookError,
    isLoading: facebookIsLoading,
    isSuccess: facebookIsSuccess,
    isError: facebookIsError
  }] = useLoginWithFacebookMutation();

  const handleLogin = async () => {
    if (isSuccess || googleIsSuccess || facebookIsSuccess) {
      const resData = {
        user: data?.user || googleData?.user || facebookData?.user,
        token: data?.token || googleData?.token || facebookData?.token,
      };
      dispatch(addUser(resData));
      await setItemInStore("userData", resData);
      if (deepLink != null && 
          !deepLink.includes("privacy-policy") &&
        !deepLink.includes("terms-of-use") &&
        !deepLink.includes("community-guidelines")) 
      {
        Linking.openURL(deepLink);
      } else {
        navigation.navigate("WelcomeStack");
      }
    }
    if (isError) {
      setErrorMsg(error?.data?.message);
    }
  };

  useEffect(() => {
    setUnMounted(false);
    getLink();
    GoogleSignin.configure();

    // initialize();
    return () => {
      setDeepLink(null);
      setUnMounted(true);
    };
  }, []);

  const getLink = async () => {
    const link = await Linking.getInitialURL();
    if (!unMounted) {
      setDeepLink(link);
    }
  };

  useEffect(() => {
    handleLogin();
  }, [isSuccess, isError]);

  const isValidForm = () => {
    if (!email.trim()) {
      setErrorMsg({ email: "Please provide email address or username" });
      return false;
    }
    if (!password.trim()) {
      setErrorMsg({ password: "Please enter your password" });
      return false;
    }

    return true;
  };

  const signIn = async (e) => {
    e.preventDefault();
    if (isValidForm()) {
      const data = { email, password };
      await loginUser(data);
    }
  };

  //SIGNIN WITH GOOGLE
  const onPressSigninWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      if (userInfo) {
        loginWithGoogle({ access_token: tokens.accessToken, result: userInfo })
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        setAlertMsg("Google play service is not available or outdated");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setAlertMsg("");
        }, 5000);
      } else {
        setAlertMsg("Something went wrong. Please try again.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setAlertMsg("");
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (googleIsSuccess) {
      handleLogin();
    }
    if (googleIsError) {
      setAlertMsg(googleError?.data?.message?.general || "Something went wrong. Please try again");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMsg("");
      }, 5000);
    }
  }, [googleIsSuccess, googleIsError])

  const onPressSignInWithFb = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(
        ["email", "public_profile"],
        'limited',
        'my_nonce'
      );

      const token = await AccessToken.getCurrentAccessToken();
      if (token?.accessToken) {
        loginWithFacebook({ access_token: token.accessToken, result })
      } else {
        setAlertMsg("Something went wrong. Please try again.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setAlertMsg("");
        }, 5000);
      }
    } catch (error) {
      setAlertMsg("Something went wrong. Please try again.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMsg("");
      }, 5000);
    }
  }

  useEffect(() => {
    if (facebookIsSuccess) {
      handleLogin();
    }
    if (facebookIsError) {
      setAlertMsg(facebookError?.data?.message?.general || "Something went wrong. Please try again");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setAlertMsg("");
      }, 5000);
    }
  }, [facebookIsSuccess, facebookIsError])



  if (googleIsLoading || facebookIsLoading) {
    return (
      <View
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff"
        }}
      >
        <ActivityIndicator size="large" color={COLORS.foiti} />
      </View>
    );
  }



  return (
    <ImageBackground source={images.backImage} resizeMode="cover" style={{ height }}>
      <View style={{ height, paddingHorizontal: 40 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 250,
          }}
        >
          <Image source={images.logod} style={STYLES.logo} />
        </View>
        <View>
          <BoxInput
            value={email}
            label="Email or Username"
            setValue={(value) => {
              setErrorMsg({ email: "" });
              setEmail(value);
            }}
            isPassword={false}
            error={errorMsg?.email}
          />
          <BoxInput
            value={password}
            label="Password"
            setValue={(value) => {
              setErrorMsg({ password: "" });
              setPassword(value);
            }}
            isPassword={true}
            hideShow={true}
            error={errorMsg?.password}
          />
        </View>

        {/* FORGOT PASSWORD START */}
        <TouchableOpacity onPress={() => navigation.navigate("Email")}>
          <Text style={{ color: COLORS.foitiLink }}>Forgot Password?</Text>
        </TouchableOpacity>
        {/* FORGOT PASSWORD END */}

        {/* SIGN IN BUTTON START */}
        <View style={{ paddingVertical: 15 }}>
          <TouchableOpacity
            onPress={signIn}
            disabled={isLoading ? true : false}
            style={[STYLES.button, { backgroundColor: COLORS.foiti, borderRadius: 40 }]}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={STYLES.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* SIGN UP BUTTON START */}
        <View style={styles.signUpContainer}>
          <Text>New to Foiti?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{ color: COLORS.foitiLink, marginLeft: 3 }}>
              Sign up now
            </Text>
          </TouchableOpacity>
        </View>
        {/* SIGN UP BUTTON START */}

        <View >
          <CustomHorizontalLine middleText="OR Login With" />
        </View>

        <View style={styles.socialContainer}>
          {/* LOGIN WITH FACEBOOK BUTTON START */}
          <TouchableOpacity style={styles.iconGap} onPress={() => onPressSignInWithFb()}>
            <MaterialIcons name="facebook" size={52.5} color={COLORS.foitiBlack} />
          </TouchableOpacity>
          {/* LOGIN WITH FACEBOOK BUTTON END */}

          {/* LOGIN WITH GOOGLE BUTTON START */}
          <TouchableOpacity style={[styles.iconsContainer, styles.iconGap]} onPress={() => onPressSigninWithGoogle()}>
            <FontAwesome5
              name="google"
              size={28}
              color="#fff"
              style={{ backgroundColor: COLORS.foitiBlack }}
            />
          </TouchableOpacity>
        </View>
        {/* LOGIN WITH GOOGLE BUTTON END */}
        {showAlert && <CustomAlert text={alertMsg} />}
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    left: 5,
    fontSize: 40,
    color: "#fff",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconsContainer: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: COLORS.foitiBlack,
    justifyContent: "center",
    alignItems: "center"
  },
  iconGap: {
    marginHorizontal: 15
  },
  inviteContainer: {
    paddingTop: 50,
    alignItems: "center",
  },
  inviteBox: {
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 5,
    borderColor: COLORS.foitiGrey,
    marginTop: 10,
  },
  onlyTextContainer: {
    position: "absolute",
    bottom: -10,
    left: width / 11,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    // transform: [{ translateX: -50 }],
  },
  signUpContainer: {
    flexDirection: "row"
  }
});

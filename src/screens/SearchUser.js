import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useBackHandler } from "@react-native-community/hooks";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../resources/theme";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("screen");
import axios from 'axios';

const SearchUser = () => {
  const navigation = useNavigation();
  const refInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [unMounted, setUnMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const REDUXNAVIGATION = useSelector((state) => state.ADD_NAVIGATION);
  //REDUXUSER

  const REDUXDATA = useSelector((state) => state.AUTHUSER);

  useBackHandler(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      if (REDUXNAVIGATION.name !== "Home") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home Navigation" }],
        });
      } else {
        return false;
      }
    }
    return true;
  });

  const createChat = async (item) => {

    try {
      const { data } = await axios.post(
        `${process.env.BACKEND_URL}/chat`, { userId: item._id },

        {
          headers: { token: REDUXDATA.token },
        }
      );
      if (data) {
        navigation.replace(`ChatBox via ${REDUXNAVIGATION.name}`, { "chatId": data._id, "user": data })
      }

    } catch (err) {
      console.log("err ", err.response)
    }
  }

  useEffect(() => {
    setUnMounted(false);
    return () => {
      setUnMounted(true);
    };
  }, []);

  const searchUser = async () => {
    if (searchText && searchText.length > 0) {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.BACKEND_URL}/chat/users?search=${searchText}`,
          {
            headers: { token: REDUXDATA.token },
          }
        );
        setUserResults(data)
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
      }
    }else{
      setIsLoading(false);
      setUserResults([]);
    }
  }
  
  useEffect(() => {
    searchUser()
  }, [searchText])



  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.InputContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="md-chevron-back-sharp" style={{ fontSize: 25 }} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <TextInput
              autoFocus={true}
              ref={refInput}
              placeholder="Search"
              placeholderTextColor="#fff"
              style={styles.input}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
              }}
            />
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 15 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 5,
            }}
          >
            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                }}
              >
                <ActivityIndicator size="small" color={COLORS.foitiGrey} />
              </View>
            ) : (
              <View>

                {searchResults.length > 0 || userResults.length > 0 ? (
                  <>
                    {userResults.length > 0 && (
                      <View>

                        {userResults.map((item, index) => {
                          return (
                            <View
                              key={index}
                              style={{
                                alignItems: "flex-start",
                              }}
                            >
                              <TouchableOpacity
                                style={styles.placeTouchable}
                                onPress={() => createChat(item)}
                              >
                                {item?.profileImage != undefined &&
                                  item?.profileImage?.thumbnail?.private_id !=
                                  "" ? (
                                  <Image
                                    source={{
                                      uri: `${process.env.BACKEND_URL}/image/${item?.profileImage?.thumbnail?.private_id}`,
                                    }}
                                    style={styles.thumbnail}
                                  />
                                ) : (
                                  <Image
                                    source={{
                                      uri: `${process.env.BACKEND_URL}/image/profile_picture.jpg`,
                                    }}
                                    style={styles.thumbnail}
                                  />
                                )}
                                <View style={{ width: width - 90 }}>
                                  <Text
                                    style={{ fontWeight: "bold" }}
                                    numberOfLines={1}
                                  >
                                    {item?.name}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={{ fontSize: 12, lineHeight: 15 }}
                                  >
                                    {item.total_contribution} Contribution
                                    {item.total_contribution > 0 ? "s" : ""}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </>
                ) : (
                  <View>
                    {searchText.length > 0 && <Text>No results found</Text>}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

    </View>
  );
};

export default SearchUser;

const styles = StyleSheet.create({
  InputContainer: {
    paddingVertical: 7,
    paddingHorizontal: 7,
  },
  input: {
    backgroundColor: "#878787",
    borderRadius: 18,
    padding: 5,
    paddingHorizontal: 18,
    color: "#fff",
  },
  placeTouchable: {
    paddingVertical: 7,
    marginVertical: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  thumbnailBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  horLine: {
    height: 1,
    backgroundColor: COLORS.foitiGreyLighter,
    marginVertical: 5,
  },
  header: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 15,
  },
  nearButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  nearIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

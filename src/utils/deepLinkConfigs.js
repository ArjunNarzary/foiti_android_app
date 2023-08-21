export const config = {
  screens: {
    WelcomeStack: {
      path: "",
      initialRouteName: "Home Navigation Stack",
      screens: {
        "Home Navigation Stack": {
          screens: {
            "Home Navigation": {
              screens: {
                "Drawer Home": {
                  screens: {
                    Home: {
                      screens: {
                        "Others profile via home": {
                          path: ":userId",
                          screens: {
                            NotFound: "*",
                          },
                        },
                        "Place via home": {
                          path: "place/:place_id",
                          screens: {
                            PlaceNotFound: "*",
                          },
                        },
                        "PlaceHome via home": {
                          path: "place-home/:place_id",
                          screens: {
                            PlaceNotFound: "*",
                          },
                        },
                        "Post via home": {
                          path: "post/:post",
                          screens: {
                            PostNotFound: "*",
                          },
                        },
                        "FollowDetails via home": {
                          path: "followDetails/:ownerId/:name",
                          parse: {
                            name: (name) => name.replace("-", " "),
                          },
                          screens: {
                            PostNotFound: "*",
                          },
                        },
                        "ChatTopNavigation via home": {
                          path: "chat",
                          // screens: {
                          //   NotFound: "*",
                          // },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    NotFound: "*",
  },
};

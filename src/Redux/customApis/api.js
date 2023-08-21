const { default: axios } = require("axios");

//GET FIRST POSTS
exports.refetchPostsApi = async (body) => {
  try {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/user/posts/${body.user_id}`,
      body,
      {
        headers: { token: body.token },
      }
    );
    return res.data;
  } catch (error) {
    return {
      posts: [],
    };
  }
};

//GET MORE POSTS
exports.fetchPostsApi = async (body) => {
  try {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/user/posts/${body.user_id}`,
      body,
      {
        headers: { token: body.token },
      }
    );

    return res.data;
  } catch (error) {
    return {
      posts: [],
    };
  }
};

//GET SEARCH RESULTS
exports.searchApi = async (body) => {
  try {
    const res = await axios.get(
      `${process.env.BACKEND_URL}/place/search?place=${body.text}&count=10`,
      {
        headers: { token: body.token },
      }
    );

    if (res.data.results.length > 0) {
      return res.data;
    } else {
      return {
        results: [],
      };
    }
  } catch (error) {
    return {
      results: [],
    };
  }
};

//GET SEARCH RESULTS
exports.placeAutocomplete = async (body) => {
  try {
    const res = await axios.get(
      `${process.env.BACKEND_URL}/place/autocomplete/search?place=${body.text}&count=8`,
      {
        headers: { token: body.token, ip: body.ip },
      }
    );

    if (res.data.results.length > 0 || res.data.users.length > 0) {
      return res.data;
    } else {
      return {
        results: [],
        users: [],
      };
    }
  } catch (error) {
    return {
      results: [],
      users: [],
    };
  }
};

//GET POSTS FROMM PLACE
exports.getPlacePosts = async (body) => {
  try {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/place/${body.place_id}`,
      body,
      {
        headers: { token: body.token },
      }
    );

    return res.data;
  } catch (error) {
    return {
      posts: [],
    };
  }
};

//GET POSTS FROMM PLACE
exports.explorePlace = async (body) => {
  try {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/place/explore-place/${body.place_id}`,
      body,
      {
        headers: { token: body.token },
      }
    );

    return res.data;
  } catch (error) {
    return {
      posts: [],
    };
  }
};

//GET FOLLOWERS POSTS
exports.getFollowersPosts = async (body) => {
  try {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/post/followersPosts`,
      body,
      {
        headers: { token: body.token },
      }
    );

    // return {res.data};
    return {
      data: res.data,
      status: res.status,
    };
  } catch (error) {
    return {
      posts: [],
      error: true,
      status: error?.response?.status || 500,
    };
  }
};

//GET FOLLOWERS POSTS
exports.getIpLocation = async (ip) => {
  try {
    const res = await axios.get(`https://ipapi.co/json/`);
    if (res?.data?.latitude && res?.data?.longitude){
      return {
        data: res.data,
        status: res.status,
      };
    }else{
      return {
        status: 404
      }
    }
  } catch (error) {
    return {
      data: null,
      error: true,
      status: error?.response?.status || 500,
    };
  }
};


//GET_ALL_MESSAGES
export const GET_ALL_MESSAGES = async(body) => {
  try {
    const res = await axios.get(
      `${process.env.BACKEND_URL}/message/${body.chatId}/${body.skip}`,
      {
        headers: { token: body.token },
      }
    );
    return {
      data: res.data,
      status: res.status,
      error: false
    }
  } catch (error) {
    return {
      error: true,
      status: error?.response?.status || 500,
    };
  }
}


//GET ALL CHATS
export const GET_ALL_MEETUP_CHATS = async (body) => {
  try {
    const res = await axios.get(
      `${process.env.BACKEND_URL}/meetup/meetup-chats/${body.skip}`,
      {
        headers: { token: body.token },
      }
    );

    return {
      data: res.data,
      status: res.status,
      error: false
    };
  } catch (err) {
    return {
      error: true,
      status: err?.response?.status || 500,
    };
  }
}

//GET_ALL_MESSAGES (NOT IN USE)
export const GET_ALL_MESSAGES23 = async (body) => {
  try {
    const res = await axios.get(
      `${process.env.BACKEND_URL}/message/${body.chatId}/${body.skip}`,
      {
        headers: { token: body.token },
      }
    );
    return {
      data: res.data,
      status: res.status,
      error: false
    }
  } catch (error) {
    return {
      error: true,
      status: error?.response?.status || 500,
    };
  }
}

//GET_ALL_MESSAGES
export const GET_ALL_MEETUP_MESSAGES = async (body) => {
  try {
    const res = await axios.get(
      `${process.env.BACKEND_URL}/meetup-message/${body.chatId}/${body.skip}`,
      {
        headers: { token: body.token },
      }
    );
    return {
      data: res.data,
      status: res.status,
      error: false
    }
  } catch (error) {
    return {
      error: true,
      status: error?.response?.status || 500,
    };
  }
}

//GET ALL ACTIVE TRIPS
export const GET_ALL_TRIPS = async (body) => {
  try {
    const res = await axios.get(
      `${process.env.BACKEND_URL}/trip/active-trips/${body.user_id}`,
      {
        headers: { token: body.token },
      }
    );
    return {
      data: res.data,
      status: res.status,
      error: false
    }
  } catch (error) {
    return {
      error: true,
      status: error?.response?.status || 500,
    };
  }
}



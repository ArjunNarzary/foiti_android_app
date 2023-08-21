import moment from "moment";

export const getSenderName = (logedUser, chatUsers) => {
  return chatUsers[0]._id === logedUser.user._id
    ? chatUsers[1].name
    : chatUsers[0].name;
};

export const getSenderProfile = (logedUser, chatUsers) => {
  return chatUsers[0]._id === logedUser.user._id ? chatUsers[1] : chatUsers[0]
}

export const getRecieptName = (logedUser, chatUsers) => {
  return chatUsers[0]._id === logedUser.user._id
    ? chatUsers[1].name
    : chatUsers[0].name;
};
export const getMessageDate = (timestampSrt) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // return timestamp;
  let timestamp = new Date(timestampSrt)
  let today = new Date()
  let day = timestamp.getDate() + "-" + months[timestamp.getMonth()] + "-" + timestamp.getFullYear();
  let todayStr = today.getDate() + "-" + months[today.getMonth()] + "-" + today.getFullYear();
  let yestardayStr = (today.getDate() - 1) + "-" + months[today.getMonth()] + "-" + today.getFullYear();

  if (day === todayStr) {
    return "Today";
  } else if (day === yestardayStr) {
    return "Yesterday";
  }
  else {
    let formatted_date = timestamp.getDate() + " " + months[timestamp.getMonth()] + ", " + timestamp.getFullYear()
    return formatted_date;
  }

}

export const getConvertedDate = (timestamp) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let formatted_date = months[timestamp.getMonth()] + " " + timestamp.getDate() + "," + timestamp.getFullYear()
  return formatted_date;
}
export const getConvertedTime = (timestampSrt) => {
  // var time = new Date();
  // var timeString = '12:23:00';
  var time = new Date(timestampSrt);
  // var time=new Date('1970-01-01T' + timeString + 'Z')
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  var month = time.getMonth();
  var day = time.getDate();
  var year = time.getYear();
  const currentDate = new Date();
  var currentYear = currentDate.getYear();

  if (moment().diff(timestampSrt, 'days') === 0) {
    var temp = '' + ((hour > 12) ? hour - 12 : hour);
    if (hour == 0)
      temp = '12';
    temp += ((minute < 10) ? ':0' : ':') + minute;
    // temp += ((second < 10) ? ':0' : ':') + second;
    temp += (hour >= 12) ? ' PM' : ' AM';
    return temp
  } else if (year === currentYear){
    return moment(timestampSrt).format("D MMM");
  }else{
    return moment(timestampSrt).format("D MMM, YYYY");
  }

}

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Exif from 'react-native-exif'
import {
  PESDK,
  PhotoEditorModal,
  Configuration,
  ExistingTheme,
} from "react-native-photoeditorsdk";

PESDK.unlockWithLicense(require("../../pesdk_license"));

let configuration = {
  transform: {
    showResetButton: true,
    allowFreeCrop: false,
    items: [
      { width: 1, height: 1, name: "Square" },
      { width: 16, height: 9, toggleable: false },
      { width: 4, height: 3, toggleable: true },
      { width: 3, height: 2, toggleable: true },
    ],
  },
  adjustment: {
    enable: false,
  },
  filter: {
    categories: [
      {
        identifier: "imgly_filter_category_legacy",
        items: [
          { identifier: "imgly_lut_cottoncandy" },
          { identifier: "imgly_lut_classic" },
          { identifier: "imgly_lut_colorful" },
          { identifier: "imgly_lut_creamy" },
          { identifier: "imgly_lut_fixie" },
          { identifier: "imgly_lut_food" },
          { identifier: "imgly_lut_fridge" },
          // { identifier: "imgly_lut_glam" },
          { identifier: "imgly_lut_gobblin" },
          { identifier: "imgly_lut_highcontrast" },
          { identifier: "imgly_lut_bw" },
          { identifier: "imgly_lut_highcarb" },
          { identifier: "imgly_lut_ancient" },
          // { identifier: "imgly_lut_k1" },
          // { identifier: "imgly_lut_k6" },
          { identifier: "imgly_lut_keen" },
          // { identifier: "imgly_lut_lomo" },
          // { identifier: "imgly_lut_lomo100" },
          { identifier: "imgly_lut_lucid" },
          { identifier: "imgly_lut_mellow" },
          { identifier: "imgly_lut_neat" },
          { identifier: "imgly_lut_pale" },
          { identifier: "imgly_lut_pitched" },
          // { identifier: "imgly_lut_polasx" },
          // { identifier: "imgly_lut_pro400" },
          { identifier: "imgly_lut_quozi" },
          { identifier: "imgly_lut_settled" },
          { identifier: "imgly_lut_seventies" },
          { identifier: "imgly_lut_soft" },
          { identifier: "imgly_lut_steel" },
          { identifier: "imgly_lut_summer" },
          { identifier: "imgly_lut_tender" },
          { identifier: "imgly_lut_twilight" },
        ],
      },
      {
        identifier: "imgly_filter_category_smooth",
        items: [
          // { identifier: "imgly_lut_chest" },
          { identifier: "imgly_lut_winter" },
          { identifier: "imgly_lut_kdynamic" },
          { identifier: "imgly_lut_fall" },
          { identifier: "imgly_lut_lenin" },
          { identifier: "imgly_lut_pola669" },
        ],
      },
      {
        identifier: "imgly_filter_category_vintage",
        items: [
          { identifier: "imgly_lut_blues" },
          { identifier: "imgly_lut_front" },
          { identifier: "imgly_lut_texas" },
          { identifier: "imgly_lut_celsius" },
          { identifier: "imgly_lut_cool" },
        ],
      },
      {
        identifier: "imgly_filter_category_bw",
        items: [{ identifier: "imgly_lut_x400" }],
      },
    ],
    flattenCategories: true,
  },
  theme: ExistingTheme.LIGHT,
};

export async function setItemInStore(key, data) {
  const store = JSON.stringify(data);
  return await AsyncStorage.setItem(key, store);
}

export function getItemFromStore(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then((data) => {
      if (data != undefined && data != null) {
        resolve(JSON.parse(data));
      }
      reject(data);
    });
    // reject(new Error("No data found"));
  });
}

export async function removeItemFromStore(key) {
  return await AsyncStorage.removeItem(key);
}

//OPEN IMAGE PICKER FUNCTION
exports.openPickerFunction = async () => {
  try {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      exif: true,
      // quality: 0.8,
      crop: false,
    });


    if (pickerResult.cancelled === true) {
      return {
        status: false,
      };
    }

    let localUri = pickerResult.uri;

    let exifLat = "";
    let exifLng = "";

    try{
      const { latitude, longitude } = await Exif.getLatLong(localUri)
      if (latitude !== 0 && latitude !== ""){
        exifLat = latitude;
      }
      if (longitude !== 0 && longitude !== ""){
        exifLng = longitude;
      }
    }catch(error){
      console.log("Error", error)
    }

    const res = await PESDK.openEditor(
      { uri: pickerResult.uri },
      configuration
    );

    if (res != null && res.hasChanges) {
      localUri = res.image;
    } else {
      return {
        status: false,
      };
    }


    const fileName = localUri.substr(localUri.lastIndexOf("/") + 1);
    const nameParts = fileName.split(".");
    const extention = nameParts[nameParts.length - 1];
    const img = {
      name: fileName,
      type: "image/" + extention,
      uri: localUri,
    };

    let createdDate = {};
    if (pickerResult?.exif?.Make && 
        pickerResult?.exif?.Model && 
        pickerResult?.exif?.ExifVersion && 
        pickerResult?.exif?.ISOSpeedRatings && 
        pickerResult?.exif?.GPSLatitude &&
        pickerResult?.exif?.GPSLongitude &&
        pickerResult?.exif?.DateTimeOriginal
      ){
        const splitedArr = pickerResult.exif?.DateTimeOriginal.split(" ");
        if(splitedArr.length > 1){
          const dateSplit = splitedArr[0].split(":");
          if(dateSplit.length === 3){
            createdDate = {
              year: Number(dateSplit[0]) || "",
              month: Number(dateSplit[1]) || "",
              day: Number(dateSplit[2]) || "",
            }
          }
        }
      }


    const image = [
      {
        file: img,
        width: pickerResult.type == "image" && pickerResult.width,
        height: pickerResult.type == "image" && pickerResult.height,
        type: pickerResult.type,
        Make: pickerResult?.exif?.Make || "",
        Model: pickerResult?.exif?.Model || "",
        ExifVersion: pickerResult?.exif?.ExifVersion || "",
        ISOSpeedRatings : pickerResult?.exif?.ISOSpeedRatings || "",
        createdDate: createdDate,
        coordinates: {
          // lat: pickerResult.exif?.GPSLatitude || "",
          // lng: pickerResult.exif?.GPSLongitude || "",
          lat: exifLat && exifLng ? exifLat : "",
          lng: exifLat && exifLng ? exifLng : "",
        },
      },
    ];

    return {
      status: true,
      image,
    };
  } catch (err) {
    return {
      status: false,
    };
  }
};

//CONVERT DECIMAL COORDINATES TO DMS with direction
export function convertDecimalToDMS(lat, lng) {
  let latDMS = {
    degrees: Math.floor(lat),
    minutes: Math.floor((lat - Math.floor(lat)) * 60),
    seconds:
      ((lat - Math.floor(lat)) * 60 -
        Math.floor((lat - Math.floor(lat)) * 60)) *
      60,
  };
  let lngDMS = {
    degrees: Math.floor(lng),
    minutes: Math.floor((lng - Math.floor(lng)) * 60),
    seconds:
      ((lng - Math.floor(lng)) * 60 -
        Math.floor((lng - Math.floor(lng)) * 60)) *
      60,
  };

  let latDirection = lat >= 0 ? "N" : "S";
  let lngDirection = lng >= 0 ? "E" : "W";

  return {
    lat:
      Math.abs(latDMS.degrees) +
      "° " +
      latDMS.minutes +
      "' " +
      latDMS.seconds.toFixed(3) +
      '" ' +
      latDirection,
    lng:
      Math.abs(lngDMS.degrees) +
      "° " +
      lngDMS.minutes +
      "' " +
      lngDMS.seconds.toFixed(3) +
      '" ' +
      lngDirection,
  };
}

//Substract years from current date
export function subtractYears(date, years){
  const dateCopy = new Date(date);
  dateCopy.setFullYear(date.getFullYear() - years);
  return dateCopy;
}

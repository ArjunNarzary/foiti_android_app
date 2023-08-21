export const returnMarkerStyle = (points) => {
    if (points >= 999) {
        return {
            width: 64,
            height: 64,
            size: 36,
            fontSize: 16,
        };
    }

    if (points >= 99) {
        return {
            width: 56,
            height: 56,
            size: 64,
            fontSize: 16,
        };
    }

    if (points >= 10) {
        return {
            width: 48,
            height: 48,
            size: 40,
            fontSize: 16,
        };
    }

    return {
        width: 40,
        height: 40,
        size: 36,
        fontSize: 16,
    };
};

//FORMAT ADDRESS FOR MEETUP PROFILE
export const formatAddressForMeetupProfile = (address) => {
    let addressArr = [];
    let checkAdd = [];
    if(address?.display_name){
        addressArr.push(address.display_name);
        checkAdd.push(address.display_name.toLowerCase());
    }else{
        addressArr.push(address.name);
        checkAdd.push(address.name.toLowerCase());
    }

    if (address?.display_address_available){
        if (address?.display_address?.locality && !checkAdd.includes(address?.display_address?.locality.toLowerCase())){
            addressArr.push(address.display_address?.locality)
            checkAdd.push(address.display_address?.locality.toLowerCase());
        }
        if (address?.display_address?.admin_area_1 && !checkAdd.includes(address?.display_address?.admin_area_1.toLowerCase())) {
            addressArr.push(address.display_address?.admin_area_1)
        }
    }else{
        if (address?.address?.locality && !checkAdd.includes(address?.address?.locality.toLowerCase())) {
            addressArr.push(address.address?.locality)
            checkAdd.push(address.address?.locality.toLowerCase());
        }
        if (address?.address?.administrative_area_level_1 && !checkAdd.includes(address?.address?.administrative_area_level_1.toLowerCase())) {
            addressArr.push(address.address?.administrative_area_level_1)
        }
    }

    return addressArr.join(', ');
    
}
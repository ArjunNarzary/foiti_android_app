import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux';
import { useGetTopContributorQuery } from '../../Redux/services/serviceApi';
import ContributorFlatList from './ContributorFlatList';
import { COLORS } from '../../resources/theme';
const { width } = Dimensions.get("screen");

const PlaceHomeContributors = ({ isUnmounted, placeName, type, destination, place }) => {
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
    const [users, setUsers] = useState([]);
    const [rerender, setRerender] = useState(false);
    const { data, isLoading, isError, isSuccess, error, refetch } = useGetTopContributorQuery({ 
                                                                            token: REDUXUSER.token, type, place_id: place?._id, destination 
                                                                        });

                        
    useEffect(() => {
        refetch();
    }, [placeName, type, destination])

    useEffect(() => {
        if (isSuccess && !isUnmounted) {
            setUsers(data?.users);
            setRerender(prev => !prev);
        }
    }, [isSuccess, isError]);


    if (users.length === 0) return null;

    return (
        <View>
            <View style={styles.horLine} />
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.mainHeader}>Top Contributors From {placeName}</Text>
                </View>
                <ContributorFlatList users={users} rerender={rerender} type={type} place={place} />
            </View>
        </View>
    )
}

export default PlaceHomeContributors

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 10,
        width
    },
    headerContainer: {
        paddingBottom: 10,
        paddingHorizontal: 7
    },
    mainHeader: {
        fontWeight: "bold"
    },
    horLine: {
        height: 10,
        backgroundColor: COLORS.foitiGreyLighter,
        width
    }
})
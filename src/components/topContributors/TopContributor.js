import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import { useGetTopContributorQuery } from '../../Redux/services/serviceApi'
import ContributorFlatList from './ContributorFlatList'
const { width, height } = Dimensions.get("screen");

const TopContributor = ({ isUnmounted }) => {
    const REDUXUSER = useSelector((state) => state.AUTHUSER);
    const [users, setUsers] = useState([]);
    const [rerender, setRerender] = useState(false);
    const { data, isError, isSuccess, error } = useGetTopContributorQuery({ token: REDUXUSER.token, type: "country", value:"India" });

    useEffect(() => {
        if (isSuccess && !isUnmounted) {
            setUsers(data?.users);
            setRerender(prev => !prev);
        }
    }, [isSuccess, isError]);


    if (users.length < 2) return null;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[styles.header, styles.mainHeader]}>Top Contributors</Text>
                <Text style={[styles.header, { fontSize: 11 }]}>Travellers who love contributing to the community.</Text>
            </View>
            <ContributorFlatList users={users} rerender={rerender} type="country" />
        </View>
    )
}

export default TopContributor

const styles = StyleSheet.create({
    container: {
        marginBottom: 3,
        paddingVertical: 10,
        width,
    },
    headerContainer: {
        paddingBottom: 10,
    },
    header: {
        textAlign: "center"
    },
    mainHeader: {
        fontWeight: "bold",
        fontSize: 16
    }
})
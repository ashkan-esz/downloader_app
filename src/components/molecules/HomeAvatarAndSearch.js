import React from 'react';
import {StyleSheet, View} from 'react-native';
import {CustomImage} from "../atoms";
import {useNavigation} from "@react-navigation/native";
import {SearchBar, Text} from "@rneui/themed";
import {useSelector} from "react-redux";
import {Colors, Mixins, Typography} from "../../styles";
import PropTypes from 'prop-types';
import Ionicons from "react-native-vector-icons/Ionicons";
import {useQuery} from "@tanstack/react-query";
import * as profileApis from "../../api/profileApis";


const HomeAvatarAndSearch = ({extraStyle}) => {
    const navigation = useNavigation();
    const profileImages = useSelector(state => state.user.profileImages);
    const defaultProfileImage = useSelector(state => state.user.defaultProfileImage);

    async function getData() {
        let result = await profileApis.getNotification(0, 6, {});
        if (result.data) {
            result = result.data;
        }
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data} = useQuery({
        queryKey: ['movie', 'home-notification'],
        queryFn: getData,
        placeholderData: [],
        notifyOnChangeProps: "all",
        refetchInterval: 30 * 1000,
    });

    return (
        <View style={[style.container, extraStyle]}>
            <CustomImage
                extraStyle={style.avatar}
                resizeModeStretch={false}
                onPress={() => navigation.navigate('Profile')}
                posters={profileImages.length > 0 ? profileImages.map(p => ({url: p})) : [{url: defaultProfileImage}]}
            />

            <View onTouchEnd={() => navigation.navigate('Search')}>
                <SearchBar
                    editable={false}
                    containerStyle={style.searchBarContainer}
                    inputContainerStyle={style.searchBar}
                    inputStyle={style.icon}
                    placeholder={'Search here ....'}
                    testID={'home-searchBar'}
                />
            </View>

            <View style={style.notificationContainer}>
                <Ionicons
                    style={style.notification}
                    name={"notifications-outline"}
                    size={32}
                    onPress={() => navigation.navigate('Notifications')}
                />
                {
                    (data || []).filter(n => n.status !== 2).length > 0 &&
                    <Text style={style.notificationBadge}>
                        {data.filter(n => n.status !== 2).length === 6 ? "+6" : data.filter(n => n.status !== 2).length}
                    </Text>
                }
            </View>
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 24,
    },
    searchBarContainer: {
        borderRadius: 25,
        ...Mixins.padding(0),
        marginLeft: 10,
        width: Mixins.getWindowWidth(100) - 115,
    },
    searchBar: {
        borderRadius: 25,
        backgroundColor: Colors.SECONDARY,
        height: 45,
    },
    icon: {
        color: '#ffffff',
        marginLeft: 5,
        fontSize: 15,
    },
    notificationContainer: {
        right: 0,
        marginLeft: "auto",
    },
    notification: {
        color: "#fff",
    },
    notificationBadge: {
        fontSize: Typography.getFontSize(12),
        position: "absolute",
        top: -4,
        right: -1,
        color: "#fff",
        backgroundColor: Colors.THIRD,
        width: 18,
        height: 16,
        borderRadius: 24,
        textAlign: "center",
        textAlignVertical: "center",
    }
});

HomeAvatarAndSearch.propTypes = {
    extraStyle: PropTypes.object,
};


export default HomeAvatarAndSearch;

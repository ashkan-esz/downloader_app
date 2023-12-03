import React from 'react';
import {StyleSheet, View} from 'react-native';
import {CustomImage} from "../atoms";
import {useNavigation} from "@react-navigation/native";
import {SearchBar} from "@rneui/themed";
import {useSelector} from "react-redux";
import {Colors, Mixins} from "../../styles";
import PropTypes from 'prop-types';


const HomeAvatarAndSearch = ({extraStyle}) => {
    const navigation = useNavigation();
    const profileImages = useSelector(state => state.user.profileImages);
    const defaultProfileImage = useSelector(state => state.user.defaultProfileImage);

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
        width: Mixins.getWindowWidth(100) - 80,
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
});

HomeAvatarAndSearch.propTypes = {
    extraStyle: PropTypes.object,
};


export default HomeAvatarAndSearch;

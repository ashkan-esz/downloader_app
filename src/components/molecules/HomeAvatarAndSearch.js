import React from 'react';
import {StyleSheet, View} from 'react-native';
import {CustomImage} from "../atoms";
import {useNavigation} from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {SearchBar} from "@rneui/themed";
import {useDispatch, useSelector} from "react-redux";
import {setShowUpdateOverlayFlag} from "../../redux/slices/user.slice";
import {Colors, Mixins} from "../../styles";
import PropTypes from 'prop-types';


const HomeAvatarAndSearch = ({extraStyle}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const updateExist = useSelector(state => state.user.updateExist);
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

            <MaterialIcons
                name={'system-update'}
                size={32}
                color={updateExist ? Colors.RED2 : Colors.NAVBAR}
                style={style.updateIcon}
                disabled={!updateExist}
                onPress={() => {
                    dispatch(setShowUpdateOverlayFlag(true));
                }}
            />
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
        width: Mixins.getWindowWidth(78) - 35,
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
    updateIcon: {
        alignSelf: 'center',
        marginLeft: 5,
    },
});

HomeAvatarAndSearch.propTypes = {
    extraStyle: PropTypes.object,
};


export default HomeAvatarAndSearch;

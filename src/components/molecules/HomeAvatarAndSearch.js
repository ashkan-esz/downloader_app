import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProfileAvatar, HomeSearchBar} from "../atoms";
import {useNavigation} from "@react-navigation/native";
import {MaterialIcons} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {setShowUpdateOverlayFlag} from "../../redux/slices/user.slice";
import {Colors} from "../../styles";
import PropTypes from 'prop-types';


const HomeAvatarAndSearch = ({extraStyle}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const updateExist = useSelector(state => state.user.updateExist);

    return (
        <View style={[style.container, extraStyle]}>
            <ProfileAvatar
                onPress={() => {
                    navigation.navigate('Profile');
                }}
            />
            <HomeSearchBar
                onPress={() => {
                    navigation.navigate('Search');
                }}
            />
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
    updateIcon: {
        alignSelf: 'center',
        marginLeft: 5,
    }
});

HomeAvatarAndSearch.propTypes = {
    extraStyle: PropTypes.object,
};


export default HomeAvatarAndSearch;

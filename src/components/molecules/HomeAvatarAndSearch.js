import React from 'react';
import {StyleSheet, View} from 'react-native';
import {HomeProfileAvatar, HomeSearchBar} from "../atoms";
import {useNavigation} from "@react-navigation/native";
import PropTypes from 'prop-types';


const HomeAvatarAndSearch = ({extraStyle}) => {
    const navigation = useNavigation();

    return (
        <View style={[style.container, extraStyle]}>
            <HomeProfileAvatar
                onPress={() => {
                }} //todo : navigate to profile screen
            />
            <HomeSearchBar
                onPress={() => {
                    navigation.navigate('Search');
                }}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

HomeAvatarAndSearch.propTypes = {
    extraStyle: PropTypes.object,
};


export default HomeAvatarAndSearch;

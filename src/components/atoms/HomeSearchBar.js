import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SearchBar} from "react-native-elements";
import {Colors, Mixins} from "../../styles";
import PropTypes from 'prop-types';


const HomeSearchBar = ({extraStyle, onPress}) => {
    return (
        <View
            style={extraStyle}
            onTouchEnd={() => {
                onPress();
            }}>
            <SearchBar
                editable={false}
                containerStyle={style.searchBarContainer}
                inputContainerStyle={style.searchBar}
                inputStyle={style.icon}
                placeholder={'Search here ....'}
                testID={'home-searchBar'}
            />
        </View>
    );
}

const style = StyleSheet.create({
    searchBarContainer: {
        borderRadius: 25,
        ...Mixins.padding(0),
        marginLeft: 10,
        width: Mixins.getWindowWidth(78),
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
    }
})

HomeSearchBar.propTypes = {
    extraStyle: PropTypes.object,
    onPress: PropTypes.func.isRequired
}


export default HomeSearchBar;

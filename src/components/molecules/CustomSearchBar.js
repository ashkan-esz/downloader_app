import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {SearchBar} from "react-native-elements";
import {useDebounce} from "../../hooks";
import {Colors, Mixins} from "../../styles";
import PropsTypes from "prop-types";


const CustomSearchBar = ({extraStyle, onTextChange, isLoading, inputRef}) => {
    const inputStyle = {
        color: '#ffffff',
        marginLeft: isLoading ? 7 : -5
    };
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchTerm = useDebounce(searchValue, 500);

    useEffect(() => {
        onTextChange(debouncedSearchTerm)
    }, [debouncedSearchTerm]);

    return (
        <View style={extraStyle}>
            <SearchBar
                onClear={() => {
                    inputRef.current.focus();
                }}
                containerStyle={style.searchBarContainer}
                inputContainerStyle={style.searchBar}
                inputStyle={inputStyle}
                onChangeText={(value) => {
                    setSearchValue(value);
                }}
                searchIcon={
                    <ActivityIndicator
                        size={"large"}
                        color={'blue'}
                        animating={isLoading}
                    />
                }
                showLoading={true}
                value={searchValue}
                placeholder={'Avengers....'}
                ref={inputRef}
                testID={'custom-searchBar'}
            />
        </View>
    );
};

const style = StyleSheet.create({
    searchBarContainer: {
        borderRadius: 25,
        ...Mixins.padding(0),
        marginBottom: 15,
    },
    searchBar: {
        borderRadius: 25,
        backgroundColor: Colors.GRAY,
        height: 45,
    }
})

CustomSearchBar.propTypes = {
    extraStyle: PropsTypes.object,
    onTextChange: PropsTypes.func.isRequired,
    isLoading: PropsTypes.bool.isRequired,
    inputRef: PropsTypes.object
};


export default CustomSearchBar;

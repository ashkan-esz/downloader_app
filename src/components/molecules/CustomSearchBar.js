import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {SearchBar} from "@rneui/themed";
import {useDebounce} from "../../hooks";
import {Colors, Mixins} from "../../styles";
import PropsTypes from "prop-types";


const CustomSearchBar = ({onTextChange, isLoading, inputRef, closeFilterBox}) => {
    const inputStyle = {
        color: '#ffffff',
        marginLeft: isLoading ? 7 : -5
    };
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearchTerm = useDebounce(searchValue, 500);

    useEffect(() => {
        onTextChange(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <SearchBar
            onClear={() => {
                inputRef.current.focus();
            }}
            autoFocus={true}
            containerStyle={style.searchBarContainer}
            inputContainerStyle={style.searchBar}
            inputStyle={inputStyle}
            onChangeText={(value) => {
                closeFilterBox();
                setSearchValue(value);
            }}
            searchIcon={
                <ActivityIndicator
                    size={"large"}
                    color={Colors.THIRD}
                    animating={isLoading}
                />
            }
            value={searchValue}
            placeholder={'Avengers....'}
            ref={inputRef}
            testID={'custom-searchBar'}
        />
    );
};

const style = StyleSheet.create({
    searchBarContainer: {
        borderRadius: 25,
        ...Mixins.padding(0),
        marginBottom: 5,
    },
    searchBar: {
        borderRadius: 25,
        backgroundColor: Colors.SECONDARY,
        height: 45,
    }
})

CustomSearchBar.propTypes = {
    onTextChange: PropsTypes.func.isRequired,
    isLoading: PropsTypes.bool.isRequired,
    inputRef: PropsTypes.object,
    closeFilterBox: PropsTypes.func.isRequired
};


export default CustomSearchBar;

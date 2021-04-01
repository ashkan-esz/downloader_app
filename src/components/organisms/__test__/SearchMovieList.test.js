import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import SearchMovieCardsList from "../movieList/SearchMovieList";
import * as ReactNative from "react-native";

jest.spyOn(ReactNative.Keyboard, 'dismiss').mockImplementation(() => {});

jest.mock("../../molecules/MovieError", () => {
    const {Button} = require('react-native');
    return ({retry}) => {
        return (
            <Button title={'retry-button'} onPress={retry}/>
        );
    }
});

jest.mock("../../atoms/MovieSearchNotFound", () => {
    const {Text} = require('react-native');
    return () => {
        return (
            <Text>not-found</Text>
        );
    }
});

jest.mock("../../atoms/SearchMovieCard", () => {
    const {Button} = require('react-native');
    return ({onPress}) => {
        return (
            <Button title={'movie-card'} onPress={onPress}/>
        );
    }
});

describe("movie cards list", () => {

    test('renders error correctly', () => {
        let retry = jest.fn();
        let {toJSON, getByText} = render(
            <SearchMovieCardsList
                loadedData={[]}
                isLoading={false}
                error={true}
                searchValue={''}
                retry={retry}
            />
        );
        expect(toJSON()).toMatchSnapshot();
        let retryButton = getByText('retry-button');
        expect(retry).toHaveBeenCalledTimes(0);
        fireEvent.press(retryButton);
        expect(retry).toHaveBeenCalledTimes(1);
    });

    test('renders not found correctly', () => {
        let retry = jest.fn();
        let {toJSON, getByText} = render(
            <SearchMovieCardsList
                loadedData={[]}
                isLoading={false}
                error={false}
                searchValue={'hi'}
                retry={retry}
            />
        );
        expect(toJSON()).toMatchSnapshot();
        let notFounfText = getByText('not-found');
        expect(notFounfText).toBeTruthy();
    });

    test('renders movie lists correctly', () => {
        let retry = jest.fn();
        let tempFunc = jest.fn();
        let {toJSON, getByText} = render(
            <SearchMovieCardsList
                loadedData={[
                    {
                        title: 'the flash',
                        rawTitle: 'the flash',
                        poster: ['hi', 'there'],
                        year: 2015
                    }
                ]}
                isLoading={false}
                error={false}
                searchValue={'the flash'}
                retry={retry}
                tempFunc={tempFunc}
            />
        );
        expect(toJSON()).toMatchSnapshot();
        let movieCard = getByText('movie-card');
        expect(tempFunc).toHaveBeenCalledTimes(0);
        fireEvent.press(movieCard);
        expect(tempFunc).toHaveBeenCalledTimes(1);
    });
});

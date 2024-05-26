import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import SearchMovieCard from "../../../screens/AppScreens/MovieListScreen/SearchScreen/SearchMovieCard";

describe("movie card in search Screen", () => {

    test('renders correctly and handle onPress', () => {
        let onPress = jest.fn();
        let {toJSON,getByTestId} = render(
            <SearchMovieCard
                poster={''}
                title={''}
                year={''}
                onPress={onPress}
            />
        );
        expect(toJSON()).toMatchSnapshot();
        let image = getByTestId('movie-card');
        expect(onPress).toHaveBeenCalledTimes(0);
        fireEvent.press(image);
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});

import * as React from "react";
import {act, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import {NavigationContainer} from "@react-navigation/native";
import MovieStackNavigations from "../MovieStackNavigations";

jest.mock("../../screens/AppScreens/HomeScreen/HomeScreen", () => {
    const {SearchBar} = require("@rneui/themed");
    return () => {
        return (
            <SearchBar testID={'searchBar'}/>
        );
    }
})

describe("home navigation", () => {

    test('renders correct screen (home)', async () => {
        let {getByTestId} = render(
            <NavigationContainer>
                <MovieStackNavigations/>
            </NavigationContainer>
        );

        await act(async () => {
            await expect(getByTestId('searchBar')).toBeTruthy();
        });

    });

});

import * as React from "react";
import {act, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import {NavigationContainer} from "@react-navigation/native";
import HomeStackNavigations from "../HomeStackNavigations";

jest.mock("../../screens/HomeScreens/HomeScreen", () => {
    const {SearchBar} = require("react-native-elements");
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
                <HomeStackNavigations/>
            </NavigationContainer>
        );

        await act(async () => {
            await expect(getByTestId('searchBar')).toBeTruthy();
        });

    });

});

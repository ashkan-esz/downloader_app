import * as React from "react";
import {act, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import {NavigationContainer} from "@react-navigation/native";
import AppStackNavigations from "../AppStackNavigations";

jest.mock("../../screens/AppScreens/HomeScreen", () => {
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
                <AppStackNavigations/>
            </NavigationContainer>
        );

        await act(async () => {
            await expect(getByTestId('searchBar')).toBeTruthy();
        });

    });

});

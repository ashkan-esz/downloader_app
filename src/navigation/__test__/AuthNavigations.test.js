import * as React from "react";
import {act, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import {NavigationContainer} from "@react-navigation/native";
import AuthNavigations from "../AuthNavigations";

describe("auth navigation", () => {

    test('renders correct screen', async () => {
        let {getByText} = render(
            <NavigationContainer>
                <AuthNavigations/>
            </NavigationContainer>
        );

        await act(async () => {
            await expect(getByText('Sign In')).toBeTruthy();
        });

        await act(async () => {
            await expect(getByText('Create Account')).toBeTruthy();
        });
    });

});

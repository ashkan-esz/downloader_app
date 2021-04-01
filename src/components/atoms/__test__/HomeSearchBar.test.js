import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import HomeSearchBar from "../HomeSearchBar";

describe("home searchBar", () => {

    test('renders correctly', () => {
        let onPress = jest.fn();
        let {toJSON} = render(
            <HomeSearchBar onPress={onPress}/>
        );
        expect(toJSON()).toMatchSnapshot();
    });

});

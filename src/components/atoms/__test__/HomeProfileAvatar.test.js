import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import HomeProfileAvatar from "../HomeProfileAvatar";

describe("home profile avatar", () => {

    test('renders correctly and handle onPress', () => {
        let onPress = jest.fn();
        let {toJSON,getByTestId} = render(
            <HomeProfileAvatar onPress={onPress}/>
        );
        let avatar = getByTestId('home-avatar');
        expect(toJSON()).toMatchSnapshot();
        expect(onPress).toHaveBeenCalledTimes(0);
        fireEvent.press(avatar);
        expect(onPress).toHaveBeenCalledTimes(1);
    });

});

import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import ProfileAvatar from "../ProfileAvatar";

describe("home profile avatar", () => {

    test('renders correctly and handle onPress', () => {
        let onPress = jest.fn();
        let {toJSON,getByTestId} = render(
            <ProfileAvatar onPress={onPress}/>
        );
        let avatar = getByTestId('home-avatar');
        expect(toJSON()).toMatchSnapshot();
        expect(onPress).toHaveBeenCalledTimes(0);
        fireEvent.press(avatar);
        expect(onPress).toHaveBeenCalledTimes(1);
    });

});

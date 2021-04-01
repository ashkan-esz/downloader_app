import React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import GoogleButton from "../GoogleButton";


describe("google button", () => {

    test('renders correctly handle onPress', () => {
        let onPress = jest.fn();
        let {getByTestId, toJSON} = render(<GoogleButton text={'test text'} onPress={onPress}/>);
        expect(toJSON()).toMatchSnapshot();
        expect(onPress).not.toHaveBeenCalled();
        fireEvent.press(getByTestId('google-button'));
        expect(onPress).toBeCalledTimes(1);
    });

});

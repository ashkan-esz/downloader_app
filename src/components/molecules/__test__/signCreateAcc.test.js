import React from "react";
import {cleanup, fireEvent, render} from '@testing-library/react-native';
import SignCreactAcc from '../signCreatAcc';

describe("sign in or create account", () => {

    test('renders correctly and handle onPress', () => {
        let onSignIn = jest.fn();
        let onCreatAcc = jest.fn();
        let wrapper = render(<SignCreactAcc onSignIn={onSignIn} onCreatAcc={onCreatAcc}/>);
        expect(wrapper.toJSON()).toMatchSnapshot();

        let {getByText} = wrapper;
        let signInButton = getByText('Sign In');
        let createAccButton = getByText('Create Account');

        expect(onSignIn).toHaveBeenCalledTimes(0);
        expect(onCreatAcc).toHaveBeenCalledTimes(0);

        fireEvent.press(signInButton);
        expect(onSignIn).toHaveBeenCalledTimes(1);
        expect(onCreatAcc).toHaveBeenCalledTimes(0);

        fireEvent.press(createAccButton);
        expect(onSignIn).toHaveBeenCalledTimes(1);
        expect(onCreatAcc).toHaveBeenCalledTimes(1);
    });
});

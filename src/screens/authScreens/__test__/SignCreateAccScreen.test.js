import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import SignCreateAccScreen from "../SignCreateAccScreen";

describe("SignUp or create account screen ", () => {

    test('renders correctly', () => {
        let {toJSON} = render(
            <SignCreateAccScreen/>
        );
        expect(toJSON()).toMatchSnapshot();
    });

    test('navigation to SignIn', ()=> {
        let navigate = jest.fn();
        let {getByText} = render(
            <SignCreateAccScreen navigation={{navigate}}/>
        )
        let signInButton = getByText('Sign In');
        expect(navigate).toHaveBeenCalledTimes(0);
        fireEvent.press(signInButton);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith('SignIn');
    });

    test('navigation to SignUp', ()=> {
        let navigate = jest.fn();
        let {getByText} = render(
            <SignCreateAccScreen navigation={{navigate}}/>
        )
        let createAccButton = getByText('Create Account');
        expect(navigate).toHaveBeenCalledTimes(0);
        fireEvent.press(createAccButton);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith('SignUp');
    });

});

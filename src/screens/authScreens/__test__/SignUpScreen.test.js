import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import SignUpScreen from "../SignUpScreen";

jest.mock("../../../components/organisms/SignUpForm", () => {
        const {Button} = require("react-native");
        return ({onSubmit}) => {
            return (
                <Button title={'Signup'} onPress={()=>onSubmit({title:'mocked signup form'})}/>
            )
        }
    }
);

jest.mock('../../../components/atoms/GoogleButton',()=>{
    const {Button} = require("react-native");
    return ({onPress})=>{
        return (
            <Button title={'google-btn'} onPress={onPress}/>
        );
    }
})

describe("signup screen", () => {

    test('renders correctly', () => {
        let {toJSON} = render(
            <SignUpScreen/>
        );
        expect(toJSON()).toMatchSnapshot();
    });

    test('navigation to Home with form onsubmit', async () => {
        let navigate = jest.fn();
        let {getByText} = render(
            <SignUpScreen navigation={{navigate}}/>
        )
        let signUpButton = getByText('Signup');
        expect(navigate).toHaveBeenCalledTimes(0);
        fireEvent.press(signUpButton);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith('Home');
    });

    test('navigation to SignUp from "CREATE ACCOUNT" button', () => {
        let navigate = jest.fn();
        let {getByText} = render(
            <SignUpScreen navigation={{navigate}}/>
        )
        let createAccButton = getByText('SIGN IN');
        expect(navigate).toHaveBeenCalledTimes(0);
        fireEvent.press(createAccButton);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith('SignIn');
    });

});

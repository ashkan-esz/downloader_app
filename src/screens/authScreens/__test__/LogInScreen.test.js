import * as React from "react";
import { fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import LogInScreen from "../LogInScreen";

jest.mock("../../../components/organisms/LogInForm", () => {
        const {Button} = require("react-native");
        return ({onSubmit}) => {
            return (
                <Button title={'Login'} onPress={()=>onSubmit({title:'mocked login form'})}/>
            )
        }
    }
);


describe("Login/SignIn screen ", () => {

    test('renders correctly', () => {
        let {toJSON} = render(
            <LogInScreen/>
        );
        expect(toJSON()).toMatchSnapshot();
    });

    test('navigation to Home with form onsubmit', async () => {
        let navigate = jest.fn();
        let {getByText} = render(
            <LogInScreen navigation={{navigate}}/>
        )
        let signInButton = getByText('Login');
        expect(navigate).toHaveBeenCalledTimes(0);
        fireEvent.press(signInButton);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith('Home');
    });

    test('navigation to SignUp from "CREATE ACCOUNT" button', () => {
        let navigate = jest.fn();
        let {getByText} = render(
            <LogInScreen navigation={{navigate}}/>
        )
        let createAccButton = getByText('CREATE ACCOUNT');
        expect(navigate).toHaveBeenCalledTimes(0);
        fireEvent.press(createAccButton);
        expect(navigate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith('SignUp');
    });

});

import * as React from "react";
import {act, fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import LogInForm from "../LogInForm";

jest.spyOn(React,'useEffect').mockImplementation(()=>{});

describe("Login form", () => {
    let wrapper, onSubmit;

    beforeEach(() => {
        onSubmit = jest.fn();
        wrapper = render(
            <LogInForm
                onSubmit={onSubmit}
            />
        );
    })

    const errors = {
        required: '*This is required.',
        short: '*Too Short.',
        long: '*Too Long.',
        invalid: '*Invalid Email.'
    };

    test('renders correctly', () => {
        let {toJSON} = wrapper;
        expect(toJSON()).toMatchSnapshot();
    });

    test('test empty fields', async () => {
        let {getByTestId, getByText} = wrapper;
        let loginButton = getByText('Login');
        expect(onSubmit).toHaveBeenCalledTimes(0);
        await act(async () => {
            await fireEvent.press(loginButton);
        })
        let emailError = getByTestId('email-error');
        let passwordError = getByTestId('password-error');
        expect(emailError).toBeTruthy();
        expect(passwordError).toBeTruthy();
        expect(emailError.props.children.join('')).toBe(errors.required);
        expect(passwordError.props.children.join('')).toBe(errors.required);
        expect(onSubmit).toHaveBeenCalledTimes(0);
    });

    test('test short length fields', async () => {
        let {getByTestId, getByText} = wrapper;
        let emailInput = getByTestId('email-input');
        let passwordInput = getByTestId('password-input');
        let loginButton = getByText('Login');
        expect(onSubmit).toHaveBeenCalledTimes(0);
        fireEvent.changeText(emailInput, 'aaaaa');
        fireEvent.changeText(passwordInput, 'aaaaa');
        await act(async () => {
            await fireEvent.press(loginButton);
        });
        let emailError = getByTestId('email-error');
        let passwordError = getByTestId('password-error');
        expect(emailError).toBeTruthy();
        expect(passwordError).toBeTruthy();
        expect(emailError.props.children.join('')).toBe(errors.invalid);
        expect(passwordError.props.children.join('')).toBe(errors.short);
        expect(onSubmit).toHaveBeenCalledTimes(0);
    });

    test('test correct fields', async () => {
        let {getByTestId, getByText, queryByTestId} = wrapper;
        let emailInput = getByTestId('email-input');
        let passwordInput = getByTestId('password-input');
        let loginButton = getByText('Login');
        expect(onSubmit).toHaveBeenCalledTimes(0);
        fireEvent.changeText(emailInput, 'ashkan@gmail.com');
        fireEvent.changeText(passwordInput, 'ashkan---hi@@@');
        await act(async () => {
            await fireEvent.press(loginButton);
        });
        expect(queryByTestId('email-error')).toBeFalsy();
        expect(queryByTestId('password-error')).toBeFalsy();
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

});

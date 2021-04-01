import * as React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import CustomTextInput from "../CustomTextInput";
import '@testing-library/jest-dom';

describe("Custom text input", () => {

    test('renders correctly and handle onChange method', () => {
        let onChange = jest.fn();
        let {getByTestId, toJSON} = render(
            <CustomTextInput
                placeholder={'test'}
                onChangeText={onChange}
                value={"hi"}
                leftIconName={'email'}
            />);

        expect(toJSON()).toMatchSnapshot();

        let input = getByTestId('test-input');

        expect(onChange).toHaveBeenCalledTimes(0);

        fireEvent.changeText(input, 'h');
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0]).toBe('h');

        fireEvent.changeText(input, 'whats up');
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange.mock.calls[1][0]).toBe('whats up');
    });

    test('icons renders and right icon change', () => {
        let onChange = jest.fn();
        let mockSetState = jest.fn();
        jest.spyOn(React, 'useState')
            .mockImplementation((init) => [init, mockSetState]);

        let {getByTestId} = render(
            <CustomTextInput
                placeholder={'test placeholder'}
                onChangeText={onChange}
                value={"hi"}
                leftIconName={'email'}
                secure={true}
            />);

        let leftIcon = getByTestId('left-icon');
        expect(leftIcon).toBeTruthy();

        let rightIcon = getByTestId('right-icon');
        expect(rightIcon).toBeTruthy();

        fireEvent.press(rightIcon);
        expect(mockSetState).toHaveBeenCalledTimes(1);
        expect(mockSetState.mock.calls[0][0]).toBe(false);
        fireEvent.press(rightIcon);
        expect(mockSetState).toHaveBeenCalledTimes(2);
        expect(mockSetState.mock.calls[1][0]).toBe(false);
    });


});


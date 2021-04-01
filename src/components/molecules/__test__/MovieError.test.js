import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import MovieError from "../../atoms/MovieError";
import NetInfo from "@react-native-community/netinfo";

jest.spyOn(NetInfo,'addEventListener').mockImplementation(()=>{});

describe("movie search error", () => {

    test('renders correctly', () => {
        let retry = jest.fn();
        let {toJSON, getByText} = render(
            <MovieError retry={retry}/>
        );
        expect(toJSON()).toMatchSnapshot();
        let retryButton = getByText('retry');

        expect(retry).toHaveBeenCalledTimes(0);
        fireEvent.press(retryButton);
        expect(retry).toHaveBeenCalledTimes(1);
    });

});

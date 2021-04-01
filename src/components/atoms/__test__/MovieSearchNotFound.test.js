import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import MovieSearchNotFound from "../MovieSearchNotFound";

describe("movie search not found", () => {

    test('renders correctly', () => {
        let {toJSON} = render(
            <MovieSearchNotFound/>
        );
        expect(toJSON()).toMatchSnapshot();
    });

});

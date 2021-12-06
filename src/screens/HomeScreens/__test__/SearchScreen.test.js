import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import SearchScreen from "../SearchScreen";

jest.mock("../../../components/atoms/CustomSearchBar", () => {
    const {Button} = require('react-native');
    return ({onchange, setIsLoading}) => {
        return (
            <Button
                title={'searchBar'}
                onPress={() => {
                    onchange();
                    setIsLoading(true);
                }
                }
            />
        );
    }
});

jest.mock("../../../components/organisms/SearchMovieCardsList", () => {
    const {Button} = require('react-native');
    return ({retry}) => {
        return (
            <Button
                title={'movieList'}
                onPress={retry}
            />
        );
    }
});

jest.spyOn(React,'useEffect').mockImplementation(()=>{})

describe("search screen and ...", () => {

    test('renders correctly', () => {
        jest.spyOn(React,'useEffect').mockImplementation(()=>{});
        let {toJSON, getByText} = render(
            <SearchScreen/>
        );
        expect(toJSON()).toMatchSnapshot();
        let searchBar = getByText('searchBar');
        let movieList = getByText('movieList');
        expect(searchBar).toBeTruthy();
        expect(movieList).toBeTruthy();
    });

});

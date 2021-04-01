import * as React from "react";
import {fireEvent, render} from '@testing-library/react-native';
import '@testing-library/jest-dom';
import OtaUpdate from "../OtaUpdate";

describe("ota update", () => {

    test('renders correctly and handle clicks', () => {
        let mockSetState = jest.fn();
        jest.spyOn(React, 'useState')
            .mockImplementation((init) => [init, mockSetState]);
        let downloadUpdate = jest.fn();
        let setIsDownloading = jest.fn();
        let {toJSON, getByText} = render(
            <OtaUpdate
                update={true}
                downloadUpdate={downloadUpdate}
                setIsDownloading={setIsDownloading}
                isDownloading={false}
            />
        );
        expect(toJSON()).toMatchSnapshot();

        let cancelButton = getByText('Cancel');

        expect(mockSetState).toHaveBeenCalledTimes(0);
        fireEvent.press(cancelButton);
        expect(mockSetState).toHaveBeenCalledTimes(1);
        expect(mockSetState.mock.calls[0][0]).toBe(false);

        expect(downloadUpdate).toHaveBeenCalledTimes(0);
        expect(setIsDownloading).toHaveBeenCalledTimes(0);
        let downloadButton = getByText('Download');
        fireEvent.press(downloadButton);
        expect(downloadUpdate).toHaveBeenCalledTimes(1);
        expect(setIsDownloading).toHaveBeenCalledTimes(1);
        expect(setIsDownloading.mock.calls[0][0]).toBe(true);
    });

});

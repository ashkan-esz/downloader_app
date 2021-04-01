import * as mixins from '../mixins';

describe("test mixins functions", () => {

    test('test dimensions', () => {
        let dimensions = mixins.dimensions;
        expect(dimensions(0, 1, 2, 3, 'padding')).toEqual({
            paddingTop: 0,
            paddingRight: 1,
            paddingBottom: 2,
            paddingLeft: 3
        });
    });

    test('test padding', () => {
        let padding = mixins.padding;
        expect(padding(0, 1, 2, 3)).toEqual({
            paddingTop: 0,
            paddingRight: 1,
            paddingBottom: 2,
            paddingLeft: 3
        });
    });

    test('test margin', () => {
        let margin = mixins.margin;
        expect(margin(0, 1, 2, 3)).toEqual({
            marginTop: 0,
            marginRight: 1,
            marginBottom: 2,
            marginLeft: 3
        });
    });

    test('test box shadow', () => {
        let boxShadow = mixins.boxShadow;
        expect(boxShadow('red', {height: 1, width: 2}, 10, 0.5)).toEqual({
            shadowColor: 'red',
            shadowOffset: {height: 1, width: 2},
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 10,
        });
        expect(boxShadow('red')).toEqual({
            shadowColor: 'red',
            shadowOffset: {height: 2, width: 2},
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
        });
    });

});

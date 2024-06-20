import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {MovieError} from "../atoms";
import {Mixins} from "../../styles";
import PropTypes from 'prop-types';


const HomeScreenFlashList = ({
                                 extraStyle,
                                 onViewableItemsChanged,
                                 data,
                                 keyExtractor,
                                 renderItem,
                                 itemSize,
                                 isError,
                                 retry,
                             }) => {


    if (isError) {
        return (
            <MovieError
                containerStyle={{...extraStyle, ...style.notFound}}
                retry={retry}
            />
        );
    }

    return (
        <View style={[style.container, extraStyle]}>
            <FlashList
                horizontal={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                estimatedItemSize={itemSize}
                estimatedListSize={{height: itemSize, width: Mixins.WINDOW_WIDTH - 20}}
                initialNumToRender={3}
                ListEmptyComponent={
                    <MovieError
                        containerStyle={{...extraStyle, ...style.notFound}}
                        errorMessage={"No Title Found!"}
                    />
                }
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 0,
        flexShrink: 1,
        height: 240,
        marginTop: 10,
    },
    notFound: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        width: Mixins.WINDOW_WIDTH - 20,
        marginTop: 10,
        marginBottom: 10,
    },
});

HomeScreenFlashList.propTypes = {
    extraStyle: PropTypes.object,
    data: PropTypes.array.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    itemSize: PropTypes.number.isRequired,
    onViewableItemsChanged: PropTypes.func,
    isError: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    columnsNumber: PropTypes.number,
}


export default HomeScreenFlashList;

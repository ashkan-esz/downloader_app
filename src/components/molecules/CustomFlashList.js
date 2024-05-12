import React, {useMemo} from 'react';
import {View, StyleSheet, RefreshControl, ActivityIndicator} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {MovieError, ScrollTop} from "../atoms";
import {useScrollDirection} from "../../hooks";
import {Mixins} from "../../styles";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";


const CustomFlashList = ({
                             extraStyle,
                             flatListRef,
                             onScrollDo,
                             onViewableItemsChanged,
                             data,
                             keyExtractor,
                             renderItem,
                             itemSize,
                             onEndReached,
                             refreshing,
                             onRefresh,
                             fadingEdgeLength,
                             listFooterPaddingBottom,
                             showScrollTopIcon = false,
                             isError,
                             retry,
                             isLoading,
                             isFetching,
                             isFetchingNextPage,
                             showNothing,
                             columnsNumber,
                             onEndReachedThreshold,
                             initialNumToRender,
                             extraHeightDiff,
                         }) => {

    const {scrollDirection, onScroll} = useScrollDirection();
    const internet = useSelector(state => state.user.internet);

    const containerHeight = useMemo(() => ({
        height: internet ? Mixins.WINDOW_HEIGHT - 140 - (extraHeightDiff || 0) : Mixins.WINDOW_HEIGHT - 165 - (extraHeightDiff || 0),
    }), [internet, extraHeightDiff]);

    const _onScroll = (event) => {
        onScrollDo && onScrollDo();
        onScroll(event);
    }

    const listFooterComponent = useMemo(() => (
        isFetchingNextPage && <ActivityIndicator
            style={{
                marginBottom: 30 + (listFooterPaddingBottom || 0) + (internet ? 0 : 5),
            }}
            size={"large"}
            color={"red"}
            animating={true}
        />
    ), [isFetchingNextPage, listFooterPaddingBottom, internet]);

    if (isError) {
        return (
            <MovieError
                containerStyle={style.notFound}
                retry={retry}
            />
        );
    }

    if (showNothing) {
        return null;
    }

    if (isLoading || (data.length === 0 && isFetching)) {
        return (
            <ActivityIndicator
                style={style.loadingActivity}
                size={"large"}
                color={"red"}
                animating={true}
            />
        );
    }

    return (
        <View style={[style.container, containerHeight, extraStyle]}>
            <FlashList
                numColumns={columnsNumber || 1}
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onScroll={_onScroll}
                // scrollEventThrottle={64}
                onViewableItemsChanged={onViewableItemsChanged}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                estimatedItemSize={itemSize}
                //-----------------------------------
                estimatedListSize={{height: itemSize * (initialNumToRender || 3), width: Mixins.WINDOW_WIDTH - 20}}
                initialNumToRender={initialNumToRender || 3}
                //----------------------------------
                onEndReached={onEndReached}
                onEndReachedThreshold={onEndReachedThreshold || 2}
                fadingEdgeLength={fadingEdgeLength || 50}
                ListEmptyComponent={
                    <MovieError
                        containerStyle={style.notFound}
                        errorMessage={"No Title Found!"}
                    />
                }
                ListFooterComponent={listFooterComponent}
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        colors={['blue', 'red']}
                    />
                }
            />

            <ScrollTop
                flatListRef={flatListRef}
                extraMarginBottom={(listFooterPaddingBottom || 0) + (internet ? 0 : 5) - (extraHeightDiff || 0)}
                show={scrollDirection === 'top' && !isLoading && !isError && showScrollTopIcon}
            />

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 0,
        flexShrink: 1,
        marginTop: 10,
    },
    notFound: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Mixins.getWindowHeight(33),
        marginTop: 10,
    },
    loadingActivity: {
        marginTop: 30
    },
});

CustomFlashList.propTypes = {
    extraStyle: PropTypes.object,
    data: PropTypes.array.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    renderItem: PropTypes.func.isRequired,
    itemSize: PropTypes.number.isRequired,
    onEndReached: PropTypes.func.isRequired,
    refreshing: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    fadingEdgeLength: PropTypes.number,
    listFooterPaddingBottom: PropTypes.number,
    flatListRef: PropTypes.object,
    onViewableItemsChanged: PropTypes.func,
    onScrollDo: PropTypes.func,
    showScrollTopIcon: PropTypes.bool,
    isError: PropTypes.bool.isRequired,
    retry: PropTypes.func,
    isLoading: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isFetchingNextPage: PropTypes.bool.isRequired,
    showNothing: PropTypes.bool,
    columnsNumber: PropTypes.number,
    onEndReachedThreshold: PropTypes.number,
    initialNumToRender: PropTypes.number,
    extraHeightDiff: PropTypes.number,
}


export default CustomFlashList;

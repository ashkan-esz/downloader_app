import React from 'react';
import {View, StyleSheet, RefreshControl, ActivityIndicator} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {Text} from "@rneui/themed";
import {MovieError, ScrollTop} from "../atoms";
import {useScrollDirection} from "../../hooks";
import {Colors, Mixins, Typography} from "../../styles";
import PropTypes from 'prop-types';


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
                             listFooterMarginTop,
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
                         }) => {

    const {scrollDirection, onScroll} = useScrollDirection();

    const _onScroll = (event) => {
        onScrollDo && onScrollDo();
        onScroll(event);
    }

    const listFooterText = isFetchingNextPage
        ? 'Loading....'
        : (!isLoading && data.length > 4) ? 'END' : ''

    const listFooterComponent = () => (
        <View style={style.listFooter}>
            <Text style={style.listFooterText}>
                {listFooterText}
            </Text>
        </View>
    );

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
        <View style={[style.container, extraStyle]}>
            <FlashList
                numColumns={columnsNumber || 1}
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onScroll={_onScroll}
                onViewableItemsChanged={onViewableItemsChanged}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                estimatedItemSize={itemSize}
                //-----------------------------------
                estimatedListSize={{height: itemSize * (initialNumToRender || 2.6), width: Mixins.WINDOW_WIDTH - 20}}
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
                ListFooterComponentStyle={{
                    paddingBottom: listFooterPaddingBottom || 0,
                    marginTop: listFooterMarginTop || 0,
                }}
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
                extraMarginBottom={listFooterPaddingBottom}
                show={scrollDirection === 'top' && !isLoading && !isError && showScrollTopIcon}
            />

        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 0,
        flexShrink: 1,
        height: Mixins.WINDOW_HEIGHT - 100,
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
    listFooter: {
        width: Mixins.getWindowWidth(90),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    listFooterText: {
        textAlign: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
        marginTop: -30,
        fontSize: Typography.getFontSize(22),
        color: Colors.RED2,
    }
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
    listFooterMarginTop: PropTypes.number,
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
}


export default CustomFlashList;

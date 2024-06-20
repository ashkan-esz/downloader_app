import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {CustomFlashList} from "../../../../components/molecules";
import SearchMovieCard from "./SearchMovieCard";
import {Mixins} from "../../../../styles";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";

const itemSize = Mixins.getWindowHeight(24) + (16 + 14 + 3) + 20; //252,256

const SearchMovieList = ({
                             flatListRef,
                             searchValue,
                             data,
                             isLoading,
                             isFetching,
                             isFetchingNextPage,
                             refreshing,
                             onRefresh,
                             onEndReached,
                             isError,
                             retry,
                             onScroll,
                             showScrollTopIcon
                         }) => {

    const internet = useSelector(state => state.user.internet);
    const listStyle = useMemo(() => ({
        marginTop: 15,
        height: internet ? Mixins.WINDOW_HEIGHT - 230 : Mixins.WINDOW_HEIGHT - 255,
        paddingLeft: 10,
    }), [internet]);

    if (!searchValue) {
        return null;
    }

    const keyExtractor = (item) => item._id.toString();
    const renderItem = ({item}) => (
        <SearchMovieCard
            posters={item.posters}
            title={item.rawTitle}
            premiered={item.premiered}
            type={item.type}
            movieId={item._id}
            rating={item.rating}
            follow={item.userStats?.follow || false}
            watchList={item.userStats?.watchlist || false}
        />
    );

    return (
        <CustomFlashList
            extraStyle={listStyle}
            columnsNumber={3}
            flatListRef={flatListRef}
            onScrollDo={onScroll}
            showScrollTopIcon={showScrollTopIcon}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            itemSize={itemSize}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.6}
            onRefresh={onRefresh}
            refreshing={refreshing}
            isError={isError}
            retry={retry}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
};

const style = StyleSheet.create({});

SearchMovieList.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    searchValue: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isFetchingNextPage: PropTypes.bool.isRequired,
    refreshing: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onEndReached: PropTypes.func.isRequired,
    isError: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
    showScrollTopIcon: PropTypes.bool,
};


export default memo(SearchMovieList);

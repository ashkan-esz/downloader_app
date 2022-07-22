import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {CustomFlashList, SearchMovieCard} from "../../molecules";
import {Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';

const itemSize = Mixins.getWindowHeight(24) + Typography.getFontSize(16 + 14 + 3) + 20; //252,256

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

    const moviesData = data.map(item => item.movies).flat(1);

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
            rating={item.rating.imdb || item.rating.myAnimeList}
            like={item.userStats.like_movie}
            dislike={item.userStats.dislike_movie}
            save={item.userStats.save}
        />
    );

    return (
        <CustomFlashList
            extraStyle={style.listWrapper}
            columnsNumber={3}
            flatListRef={flatListRef}
            onScrollDo={onScroll}
            showScrollTopIcon={showScrollTopIcon}
            data={moviesData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            itemSize={itemSize}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.6}
            onRefresh={onRefresh}
            refreshing={refreshing}
            listFooterMarginTop={-15}
            listFooterPaddingBottom={70}
            isError={isError}
            retry={retry}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
};

const style = StyleSheet.create({
    listWrapper: {
        marginTop: 15,
    }
});

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

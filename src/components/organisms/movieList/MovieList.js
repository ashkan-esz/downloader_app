import React from 'react';
import {StyleSheet} from 'react-native';
import {CustomFlashList, SectionMovieCard} from "../../molecules";
import {Mixins} from "../../../styles";
import PropTypes from 'prop-types';

const itemSize = Math.floor(Math.min(Mixins.getWindowHeight(33), 255)) + 19; //274

const MovieList = ({
                       flatListRef,
                       onScroll,
                       showScrollTopIcon,
                       data,
                       isLoading,
                       isFetching,
                       isFetchingNextPage,
                       onEndReached,
                       refreshing,
                       onRefresh,
                       isError,
                       retry
                   }) => {


    const keyExtractor = (item) => item._id.toString();
    const renderItem = ({item}) => (
        <SectionMovieCard
            tab={''}
            posters={item.posters}
            movieId={item._id}
            title={item.rawTitle}
            rating={item.rating.imdb || item.rating.myAnimeList}
            premiered={item.premiered}
            type={item.type}
            genres={item.genres}
            latestData={item.latestData}
            nextEpisode={item.nextEpisode}
            likesCount={item.userStats.like_movie_count}
            dislikesCount={item.userStats.dislike_movie_count}
            likeOrDislike={item.userStats.like_movie ? 'like' : item.userStats.dislike_movie ? 'dislike' : ''}
        />
    );

    return (
        <CustomFlashList
            flatListRef={flatListRef}
            onScrollDo={onScroll}
            showScrollTopIcon={showScrollTopIcon}
            initialNumToRender={1}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            itemSize={itemSize}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={refreshing}
            listFooterMarginTop={-10}
            isError={isError}
            retry={retry}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
};

const style = StyleSheet.create({});

MovieList.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isFetchingNextPage: PropTypes.bool.isRequired,
    refreshing: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onEndReached: PropTypes.func,
    isError: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
    showScrollTopIcon: PropTypes.bool.isRequired,
}


export default MovieList;

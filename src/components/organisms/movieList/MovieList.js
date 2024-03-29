import React from 'react';
import {StyleSheet} from 'react-native';
import {CustomFlashList, SectionMovieCard} from "../../molecules";
import {Mixins} from "../../../styles";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";

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

    const internet = useSelector(state => state.user.internet);

    const keyExtractor = (item) => item._id.toString();
    const renderItem = ({item}) => (
        <SectionMovieCard
            tab={''}
            posters={item.posters}
            movieId={item._id}
            title={item.rawTitle}
            rating={item.rating}
            premiered={item.premiered}
            type={item.type}
            genres={item.genres}
            latestData={item.latestData}
            nextEpisode={item.nextEpisode}
            likesCount={item.userStats.likes_count}
            dislikesCount={item.userStats.dislikes_count}
            followsCount={item.userStats.follow_count}
            like={item.userStats.like}
            dislike={item.userStats.dislike}
            follow={item.userStats.follow}
        />
    );

    return (
        <CustomFlashList
            flatListRef={flatListRef}
            onScrollDo={onScroll}
            showScrollTopIcon={showScrollTopIcon}
            initialNumToRender={2}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            itemSize={itemSize}
            onEndReached={onEndReached}
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

import React from 'react';
import {StyleSheet} from 'react-native';
import {CustomFlashList, SectionMovieCard} from "../../molecules";
import {Mixins} from "../../../styles";
import PropTypes from 'prop-types';

const itemSize = Math.floor(Math.min(Mixins.getWindowHeight(33), 255)) + 19; //274

const TimeLineMovieList = ({
                               flatListRef,
                               onScroll,
                               showScrollTopIcon,
                               spacing,
                               data,
                               isLoading,
                               isFetching,
                               isFetchingNextPage,
                               onEndReached,
                               refreshing,
                               onRefresh,
                               isError,
                               retry,
                               showNothing
                           }) => {

    const keyExtractor = (item) => item._id.toString();
    const renderItem = ({item}) => (
        <SectionMovieCard
            tab={spacing === new Date().getDay() ? 'todaySeries' : ''}
            posters={item.posters}
            movieId={item._id}
            title={item.rawTitle}
            rating={item.rating}
            premiered={item.premiered}
            type={item.type}
            genres={item.genres}
            latestData={item.latestData}
            nextEpisode={item.nextEpisode}
            likesCount={item.userStats?.likes_count || 0}
            dislikesCount={item.userStats?.dislikes_count || 0}
            followsCount={item.userStats?.follow_count || 0}
            like={item.userStats?.like || false}
            dislike={item.userStats?.dislike || false}
            follow={item.userStats?.follow || false}
        />
    );

    return (
        <CustomFlashList
            flatListRef={flatListRef}
            onScrollDo={onScroll}
            showScrollTopIcon={showScrollTopIcon}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            itemSize={itemSize}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={refreshing}
            isError={isError}
            retry={retry}
            hideRetry={true}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            showNothing={showNothing}
            extraHeightDiff={10}
        />
    );
};

const style = StyleSheet.create({});

TimeLineMovieList.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    onScroll: PropTypes.func,
    showScrollTopIcon: PropTypes.bool,
    spacing: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isFetchingNextPage: PropTypes.bool.isRequired,
    refreshing: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onEndReached: PropTypes.func,
    isError: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired,
    showNothing: PropTypes.bool,
}


export default TimeLineMovieList;

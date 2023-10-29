import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {CustomFlashList, TrailerMovieCard} from "../../molecules";
import {Mixins} from "../../../styles";
import PropTypes from 'prop-types';

const itemSize = Math.floor(Math.max(Mixins.WINDOW_WIDTH / 1.6, 200) * 1.7) + 35; //417,472

const trailersMovieList = ({
                               flatListRef,
                               data,
                               isLoading,
                               isFetching,
                               isFetchingNextPage,
                               onEndReached,
                               refreshing,
                               onRefresh,
                               isError,
                               retry,
                               onScroll,
                               showScrollTopIcon,
                           }) => {

    const [onScreenViewItems, setOnScreenViewItems] = useState([]);

    const handleVieweableItemsChanged = useCallback(({viewableItems}) => {
        setOnScreenViewItems(viewableItems.map(item => item.index));
    }, []);

    const keyExtractor = (item) => item._id.toString();
    const renderItem = ({index, item}) => (
        <TrailerMovieCard
            isOnScreenView={onScreenViewItems.includes(index)}
            posters={item.posters}
            trailer={item.trailers ? item.trailers[0].url : ''}
            movieId={item._id}
            title={item.rawTitle}
            rating={item.rating}
            premiered={item.premiered}
            type={item.type}
            genres={item.genres}
            latestData={item.latestData}
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
            onViewableItemsChanged={handleVieweableItemsChanged}
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
            listFooterMarginTop={-15}
            isError={isError}
            retry={retry}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
        />
    );
};

const style = StyleSheet.create({});

trailersMovieList.propTypes = {
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
    showScrollTopIcon: PropTypes.bool,
};


export default trailersMovieList;

import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from "react-redux";
import {CustomFlashList} from "../../../../components/molecules";
import TrailerMovieCard from "./TrailerMovieCard";
import {Mixins} from "../../../../styles";
import PropTypes from 'prop-types';

const itemSize = Math.floor(Math.max(Mixins.WINDOW_WIDTH * (9/16), 200) * 1.7) + 35; //417,472

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
                               showNothing,
                               extraHeightDiff,
                           }) => {

    const [onScreenViewItems, setOnScreenViewItems] = useState([]);
    const internet = useSelector(state => state.user.internet);

    const handleVieweableItemsChanged = useCallback(({viewableItems}) => {
        setOnScreenViewItems(viewableItems.map(item => item.index));
    }, []);

    const keyExtractor = (item) => item._id.toString();
    const renderItem = ({index, item}) => (
        <TrailerMovieCard
            isOnScreenView={onScreenViewItems.includes(index)}
            posters={item.posters}
            widePoster={item.poster_wide_s3}
            trailers={item.trailers}
            movieId={item._id}
            title={item.rawTitle}
            rating={item.rating}
            premiered={item.premiered}
            type={item.type}
            genres={item.genres}
            latestData={item.latestData}
            nextEpisode={item.nextEpisode}
            follow={item.userStats?.follow || false}
            watchList={item.userStats?.watchlist || false}
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
            extraHeightDiff={extraHeightDiff}
            isError={isError}
            retry={retry}
            hideRetry={true}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            showNothing={showNothing}
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
    showNothing: PropTypes.bool,
    extraHeightDiff: PropTypes.number,
};


export default trailersMovieList;

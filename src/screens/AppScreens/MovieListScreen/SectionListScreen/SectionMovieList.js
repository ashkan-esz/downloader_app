import React from 'react';
import {StyleSheet} from 'react-native';
import {CustomFlashList} from "../../../../components/molecules";
import MovieCard from "../MovieCard";
import {Mixins} from "../../../../styles";
import PropTypes from 'prop-types';

const itemSize = Math.floor(Math.min(Mixins.getWindowHeight(33), 255)) + 19; //274

const SectionMovieList = ({
                              flatListRef,
                              onScroll,
                              showScrollTopIcon,
                              tab,
                              changedTab,
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
        <MovieCard
            posters={item.posters}
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
            listFooterPaddingBottom={40} //todo : check better way
            extraHeightDiff={40}
            isError={isError}
            retry={retry}
            isLoading={isLoading}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            showNothing={tab !== changedTab}
        />
    );
};

const style = StyleSheet.create({});

SectionMovieList.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    tab: PropTypes.string.isRequired,
    changedTab: PropTypes.string.isRequired,
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
};


export default SectionMovieList;
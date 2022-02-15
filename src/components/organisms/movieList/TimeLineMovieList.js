import React from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {SectionMovieCard} from "../../molecules";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const TimeLineMovieList = ({
                               flatListRef,
                               spacing,
                               changedSpacing,
                               data,
                               isLoading,
                               isFetchingNextPage,
                               onEndReached,
                               refreshing,
                               onRefresh,
                               isError,
                               retry
                           }) => {
    if (isError) {
        return (
            <MovieError retry={retry}/>
        );
    }

    //todo : handle data.length === 0

    if (data.length === 0 || isLoading || spacing !== changedSpacing) {
        return (
            <ActivityIndicator
                style={style.loadingActivity}
                size={"large"}
                color={"red"}
                animating={true}
            />
        );
    }

    const keyExtractor = (item) => item._id.toString();
    const renderItem = ({item}) => (
        <SectionMovieCard
            tab={spacing === new Date().getDay() ? 'todaySeries' : ''}
            posters={item.posters}
            movieId={item._id}
            title={item.rawTitle}
            rating={item.rating.imdb || item.rating.myAnimeList}
            premiered={item.premiered}
            type={item.type}
            genres={item.genres}
            latestData={item.latestData}
            nextEpisode={item.nextEpisode}
            status={item.status}
            likesCount={item.likesCount}
            dislikesCount={item.dislikesCount}
            likeOrDislike={item.likeOrDislike}
        />
    );

    const loadingPadding = {
        paddingLeft: isFetchingNextPage ? '10%' : '5%',
    };
    const listFooterComponent = () => (
        <Text style={[style.listFooter, loadingPadding]}>
            {isFetchingNextPage ? 'Loading....' : (!isLoading && data.length > 4 && spacing === changedSpacing) ? 'END' : ''}
        </Text>
    );

    const _fadingEdgeLength = Mixins.WINDOW_HEIGHT < 700 ? 55 : 100;

    return (
        <View style={style.container}>
            <FlatList
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                maxToRenderPerBatch={6}
                windowSize={51}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialNumToRender={3}
                onEndReached={onEndReached}
                onEndReachedThreshold={2}
                fadingEdgeLength={_fadingEdgeLength}
                ListFooterComponent={listFooterComponent}
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        colors={['blue', 'red']}
                    />
                }
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        height: Mixins.WINDOW_HEIGHT - 130,
    },
    loadingActivity: {
        marginTop: 30
    },
    listFooter: {
        width: Mixins.getWindowWidth(90),
        textAlign: 'center',
        alignItems: 'center',
        fontSize: Typography.getFontSize(22),
        color: Colors.RED2,
        paddingTop: 0,
        paddingBottom: 30,
    },
});

TimeLineMovieList.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    spacing: PropTypes.number.isRequired,
    changedSpacing: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isFetchingNextPage: PropTypes.bool.isRequired,
    refreshing: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onEndReached: PropTypes.func,
    isError: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired,
}


export default TimeLineMovieList;

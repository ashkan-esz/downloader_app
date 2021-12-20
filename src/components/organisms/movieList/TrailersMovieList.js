import React, {useCallback, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {TrailerMovieCard} from "../../molecules";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const trailersMovieList = ({
                               flatListRef,
                               data,
                               isLoading,
                               isFetchingNextPage,
                               onEndReached,
                               refreshing,
                               onRefresh,
                               isError,
                               retry,
                               onScroll
                           }) => {

    const [onScreenViewItems, setOnScreenViewItems] = useState([]);

    const handleVieweableItemsChanged = useCallback(({viewableItems}) => {
        setOnScreenViewItems(viewableItems.map(item => item.index));
    }, []);

    if (isError) {
        return (
            <MovieError retry={retry}/>
        );
    }

    if (data.length === 0 || isLoading) {
        return (
            <ActivityIndicator
                style={style.loadingActivity}
                size={"large"}
                color={"red"}
                animating={true}
            />
        );
    }

    const _keyExtractor = (item) => item._id.toString();
    const _renderItem = ({index, item}) => (
        <TrailerMovieCard
            isOnScreenView={onScreenViewItems.includes(index)}
            posters={item.posters}
            trailer={item.trailers ? item.trailers[0].link : ''}
            id={item._id}
            title={item.rawTitle}
            rating={item.rating.imdb || item.rating.myAnimeList}
            premiered={item.premiered}
            type={item.type}
            genres={item.genres}
            latestData={item.latestData}
            nextEpisode={item.nextEpisode}
            status={item.status}
            like={item.like}
        />
    );

    const loadingPadding = {
        paddingLeft: isFetchingNextPage ? '10%' : '5%',
    };
    const listFooterComponent = () => (
        <Text style={[style.listFooter, loadingPadding]}>
            {isFetchingNextPage ? 'Loading....' : (!isLoading && data.length > 4) ? 'END' : ''}
        </Text>
    );

    const _fadingEdgeLength = Mixins.WINDOW_HEIGHT < 700 ? 55 : 100;

    return (
        <View style={style.container}>
            <FlatList
                onViewableItemsChanged={handleVieweableItemsChanged}
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                maxToRenderPerBatch={6}
                windowSize={51}
                data={data}
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
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
        height: Mixins.WINDOW_HEIGHT - 85,
        marginTop: 10,
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
        marginTop: -10,
        paddingBottom: 65,
    },
});

trailersMovieList.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isFetchingNextPage: PropTypes.bool.isRequired,
    refreshing: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onEndReached: PropTypes.func,
    isError: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
};


export default trailersMovieList;

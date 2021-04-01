import React from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {TrailerMovieCard} from "../../molecules";
import {getPoster, getRating, getTitleSnakeCase, getTrailer} from "../../../utils";
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
                               retry
                           }) => {
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


    const keyExtractor = (item) => item.title;
    const renderItem = ({item}) => (
        <TrailerMovieCard
            poster={getPoster(item.poster)}
            trailer={getTrailer(item.trailers, '720')}
            id={item._id}
            title={item.rawTitle || getTitleSnakeCase(item.title)}
            rating={getRating(item.rating)}
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
                onEndReachedThreshold={Mixins.WINDOW_HEIGHT < 700 ? 2 : 1}
                fadingEdgeLength={Mixins.WINDOW_HEIGHT < 700 ? 55 : 100}
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
        marginTop: 15,
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
        paddingBottom: 30,
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
};


export default trailersMovieList;

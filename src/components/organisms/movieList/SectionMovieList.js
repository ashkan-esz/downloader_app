import React from 'react';
import {View, StyleSheet, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {Text} from "react-native-elements";
import {MovieError} from "../../atoms";
import {SectionMovieCard} from "../../molecules";
import {homeStackHelpers} from "../../../helper";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const SectionMovieList = ({
                              flatListRef,
                              tab,
                              changedTab,
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

    if (isError) {
        return (
            <MovieError retry={retry}/>
        );
    }

    if (data.length === 0 || isLoading || tab !== changedTab) {
        return (
            <ActivityIndicator
                style={style.loadingActivity}
                size={"large"}
                color={"red"}
                animating={true}
            />
        );
    }


    const keyExtractor = (item) => item.title + item.year;
    const renderItem = ({item}) => (
        <SectionMovieCard
            tab={tab}
            poster={homeStackHelpers.getPoster(item.poster)}
            id={item._id}
            title={item.rawTitle || homeStackHelpers.getTitleSnakeCase(item.title)}
            rating={homeStackHelpers.getRating(item.rating)}
            premiered={item.premiered}
            type={item.type}
            genres={item.genres}
            latestData={item.latestData}
            nextEpisode={item.nextEpisode || {}}
            status={item.status}
            like={item.like}
        />
    );

    const loadingPadding = {
        paddingLeft: isFetchingNextPage ? '10%' : '5%',
    };
    const listFooterComponent = () => (
        <Text style={[style.listFooter, loadingPadding]}>
            {isFetchingNextPage ? 'Loading....' : (!isLoading && data.length > 4 && tab === changedTab) ? 'END' : ''}
        </Text>
    );

    const _fadingEdgeLength = Mixins.WINDOW_HEIGHT < 700 ? 55 : 100;

    return (
        <View style={style.container}>
            <FlatList
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
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
        paddingTop: 0,
        paddingBottom: 30,
    },
});

SectionMovieList.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    tab: PropTypes.string.isRequired,
    changedTab: PropTypes.string.isRequired,
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


export default SectionMovieList;

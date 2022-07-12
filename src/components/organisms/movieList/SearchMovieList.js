import React, {memo} from 'react';
import {View, StyleSheet, Keyboard, FlatList} from 'react-native';
import {Text} from "react-native-elements";
import {MovieSearchNotFound, MovieError} from "../../atoms";
import {SearchMovieCard} from "../../molecules";
import {Colors, Mixins, Typography} from "../../../styles";
import PropTypes from 'prop-types';


const SearchMovieList = ({
                             flatListRef,
                             searchValue,
                             data,
                             isLoading,
                             isFetching,
                             isFetchingNextPage,
                             refreshing,
                             onRefresh,
                             onEndReached,
                             isError,
                             retry,
                             onScroll
                         }) => {

    const moviesData = data.map(item => item.movies).flat(1);

    if (!searchValue) {
        return null;
    }

    if (isError) {
        return (
            <MovieError retry={retry}/>
        );
    }

    if (moviesData.length === 0 && !isLoading && !isFetching) {
        return (
            <MovieSearchNotFound/>
        );
    }


    const keyExtractor = (item) => item._id.toString();

    const renderItem = ({item}) => (
        <SearchMovieCard
            posters={item.posters}
            title={item.rawTitle}
            premiered={item.premiered}
            type={item.type}
            movieId={item._id}
            rating={item.rating.imdb || item.rating.myAnimeList}
            likeOrDislike={item.userStats.like_movie ? 'like' : item.userStats.dislike_movie ? 'dislike' : ''}
        />
    );

    const loadingPadding = {
        paddingLeft: isFetchingNextPage ? '6%' : '5%',
    };
    const listFooterComponent = () => (
        <Text style={[style.listFooter, loadingPadding]}>
            {isFetchingNextPage ? 'Loading....' : (!isLoading && moviesData.length > 6) ? 'END' : ''}
        </Text>
    );

    const _fadingEdgeLength = Mixins.WINDOW_HEIGHT < 700 ? 50 : 100;

    return (
        <View style={style.container}>
            <FlatList
                ref={flatListRef}
                contentContainerStyle={style.listWrapper}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                maxToRenderPerBatch={9}
                windowSize={51}
                data={moviesData}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialNumToRender={12}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.6}
                fadingEdgeLength={_fadingEdgeLength}
                onScrollBeginDrag={() => Keyboard.dismiss()}
                ListFooterComponent={listFooterComponent}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        height: Mixins.WINDOW_HEIGHT - 130
    },
    listWrapper: {
        marginTop: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    listFooter: {
        width: Mixins.getWindowWidth(90),
        textAlign: 'center',
        fontSize: Typography.getFontSize(22),
        color: Colors.RED2,
        paddingBottom: 85,
    }
});

SearchMovieList.propTypes = {
    flatListRef: PropTypes.object.isRequired,
    searchValue: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isFetchingNextPage: PropTypes.bool.isRequired,
    refreshing: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onEndReached: PropTypes.func.isRequired,
    isError: PropTypes.bool.isRequired,
    retry: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
};


export default memo(SearchMovieList);

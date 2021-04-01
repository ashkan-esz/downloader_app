import React, {memo} from 'react';
import {View, StyleSheet, Keyboard, FlatList} from 'react-native';
import {Text} from "react-native-elements";
import {MovieSearchNotFound, MovieError} from "../../atoms";
import {SearchMovieCard} from "../../molecules";
import {getPoster, getRating, getTitleSnakeCase} from "../../../utils";
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
                         }) => {


    if (!searchValue) {
        return null;
    }

    if (isError) {
        return (
            <MovieError retry={retry}/>
        );
    }

    if (data.length === 0 && !isLoading && !isFetching) {
        return (
            <MovieSearchNotFound/>
        );
    }


    const keyExtractor = (item) => item.title;
    const renderItem = ({item}) => (
        <SearchMovieCard
            poster={getPoster(item.poster)}
            title={item.rawTitle || getTitleSnakeCase(item.title)}
            premiered={item.premiered}
            type={item.type}
            extraData={{
                id: item._id,
                rating: getRating(item.rating),
            }}
        />
    );

    const loadingPadding = {
        paddingLeft: isFetchingNextPage ? '6%' : '5%',
    };
    const listFooterComponent = () => (
        <Text style={[style.listFooter, loadingPadding]}>
            {isFetchingNextPage ? 'Loading....' : (!isLoading && data.length > 6) ? 'End' : ''}
        </Text>
    );

    return (
        <View style={style.container}>
            <FlatList
                ref={flatListRef}
                contentContainerStyle={style.listWrapper}
                showsVerticalScrollIndicator={false}
                maxToRenderPerBatch={9}
                windowSize={51}
                data={data}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialNumToRender={12}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.6}
                fadingEdgeLength={Mixins.WINDOW_HEIGHT < 700 ? 50 : 100}
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
        marginTop: 5,
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
        paddingBottom: 30,
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
    retry: PropTypes.func.isRequired
};


export default memo(SearchMovieList);

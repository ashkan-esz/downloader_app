import React, {useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation, StatusBar} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {ScreenLayout} from "../../components/layouts";
import {FilterType} from "../../components/molecules";
import {MovieList} from "../../components/organisms";
import {getSortedMovies} from "../../api";

const MovieListScreen = () => {
    const route = useRoute();
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(['movie', 'serial', 'anime_movie', 'anime_serial']);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    const _closeFilterBox = () => {
        if (expanded) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpanded(false);
        }
    }

    async function getData({pageParam = 1}) {
        let result = await getSortedMovies(route.params.pageType, types, 'medium', pageParam);
        if (result && result !== 'error') {
            return result;
        } else {
            //todo : handle error
            return [];
        }
    }

    const {data, fetchNextPage, isLoading, isFetching, isFetchingNextPage, isError} = useInfiniteQuery(
        [route.params.pageType, 'movieListScreen', types],
        getData,
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length % 12 === 0 && lastPage.length !== 0) {
                    return allPages.length + 1;
                }
                return undefined;
            },
            placeholderData: {pages: [[]]},
            cacheTime: 2 * 60 * 1000,
            staleTime: 2 * 60 * 1000,
        });

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries([route.params.pageType, 'movieListScreen', types]);
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries([route.params.pageType, 'movieListScreen', types]);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={style.container}>
                <FilterType
                    expanded={expanded}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <MovieList
                    flatListRef={flatListRef}
                    data={data.pages.flat(1)}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    isError={isError}
                    retry={_retry}
                    onScroll={_closeFilterBox}
                    showScrollTopIcon={!expanded && (data.pages[0].length > 0)}
                />
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        top: StatusBar.currentHeight + 60,
    }
});


export default MovieListScreen;

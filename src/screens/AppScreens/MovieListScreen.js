import React, {useMemo, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation, StatusBar} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {ScreenLayout} from "../../components/layouts";
import {FilterType} from "../../components/molecules";
import {MovieList} from "../../components/organisms";
import {useSelector} from "react-redux";
import * as movieApis from "../../api/movieApis";

const MovieListScreen = () => {
    const route = useRoute();
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(['movie', 'serial', 'anime_movie', 'anime_serial']);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);

    const containerStyle = useMemo(() => ({
        position: 'absolute',
        width: '100%',
        top: internet ? StatusBar.currentHeight + 60 : StatusBar.currentHeight + 35,
    }), [internet]);

    const _closeFilterBox = () => {
        if (expanded) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpanded(false);
        }
    }

    async function getData(pageParam) {
        let result = await movieApis.getSortedMovies(route.params.pageType, types, 'medium', pageParam);
        if (result && result !== 'error') {
            return result;
        } else {
            //todo : handle error
            return [];
        }
    }

    const {data, fetchNextPage, isPending, isFetching, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: [route.params.pageType, 'movieListScreen', types],
        queryFn: ({pageParam}) => getData(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length % 12 === 0 && lastPage.length !== 0) {
                return allPages.length + 1;
            }
            return null;
        },
        placeholderData: {pages: [[]]},
        gcTime: 2 * 60 * 1000,
        staleTime: 2 * 60 * 1000,
    });

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({
            queryKey: [route.params.pageType, 'movieListScreen', types]
        });
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries({
            queryKey: [route.params.pageType, 'movieListScreen', types]
        });
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={containerStyle}>
                <FilterType
                    expanded={expanded}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <MovieList
                    flatListRef={flatListRef}
                    data={data.pages.flat(1)}
                    isLoading={isPending}
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

const style = StyleSheet.create({});


export default MovieListScreen;

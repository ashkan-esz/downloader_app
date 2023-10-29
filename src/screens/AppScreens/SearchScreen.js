import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation, Keyboard} from 'react-native';
import {ScreenLayout} from '../../components/layouts';
import {SearchMovieList} from "../../components/organisms";
import {CustomSearchBar, FilterType} from "../../components/molecules";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {searchTitle} from "../../api";


const SearchScreen = () => {
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(['movie', 'serial', 'anime_movie', 'anime_serial']);
    const [refreshing, setRefreshing] = useState(false);
    const searchBarRef = useRef();
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        searchBarRef.current.focus();
    }, []);

    const _onScroll = () => {
        Keyboard.dismiss();
        _closeFilterBox();
    }

    const _closeFilterBox = () => {
        if (expanded) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpanded(false);
        }
    }

    const getData = async ({pageParam = 1}) => {
        if (!debouncedSearchValue) {
            return {movies: [], staff: [], characters: []};
        }
        let result = await searchTitle(debouncedSearchValue, types, 'low', pageParam);
        if (result !== 'error') {
            return result;
        } else {
            //todo : handle error
            return [];
        }
    }

    const {data, fetchNextPage, isLoading, isFetching, isFetchingNextPage, isError} = useInfiniteQuery(
        [debouncedSearchValue, 'searchScreen', types],
        getData,
        {
            getNextPageParam: (lastPage, allPages) => {
                if (
                    lastPage.movies.length && lastPage.movies.length % 12 === 0 ||
                    lastPage.staff.length && lastPage.staff.length % 12 === 0 ||
                    lastPage.characters.length && lastPage.characters.length % 12 === 0
                ) {
                    return allPages.length + 1;
                }
                return undefined;
            },
            placeholderData: {pages: [{movies: [], staff: [], characters: []}]},
            keepPreviousData: true,
            cacheTime: 3 * 60 * 1000,
            staleTime: 3 * 60 * 1000,
        });


    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries([debouncedSearchValue, 'searchScreen', types]);
        setRefreshing(false);
    }

    const _retry = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries([debouncedSearchValue, 'searchScreen', types]);
        setRefreshing(false);
    }

    return (
        <ScreenLayout
            backgroundColor={'#000000'}
            paddingSides={20}>
            <View style={style.container}>

                <CustomSearchBar
                    onTextChange={setDebouncedSearchValue}
                    isLoading={isLoading || isFetching}
                    inputRef={searchBarRef}
                    closeFilterBox={_closeFilterBox}
                />

                <FilterType
                    expanded={expanded}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <SearchMovieList
                    flatListRef={flatListRef}
                    showScrollTopIcon={(data.pages[0].movies.length > 0)}
                    searchValue={debouncedSearchValue}
                    data={data.pages}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    onEndReached={fetchNextPage}
                    isError={isError}
                    retry={_retry}
                    onScroll={_onScroll}
                />

            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        top: 95,
    }
});


export default SearchScreen;

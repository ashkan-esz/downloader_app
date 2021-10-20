import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import {ScreenLayout} from '../../components/layouts';
import {SearchMovieList} from "../../components/organisms";
import {CustomSearchBar, FilterType} from "../../components/molecules";
import {ScrollTop} from "../../components/atoms";
import {useInfiniteQuery, useQueryClient} from "react-query";
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

    const _closeFilterBox = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(false);
    }

    const getData = async ({pageParam = 1}) => {
        if (!debouncedSearchValue) {
            return [];
        }
        let result = await searchTitle(debouncedSearchValue, types, 'low', pageParam);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isLoading, isFetching, isFetchingNextPage, isError} = useInfiniteQuery(
        [debouncedSearchValue, 'searchScreen', types],
        getData,
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length % 12 === 0) {
                    return allPages.length + 1
                }
                return undefined;
            },
            placeholderData: {pages: [[]]},
            keepPreviousData: true
        });


    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.removeQueries([debouncedSearchValue, 'searchScreen', types]);
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
                    searchValue={debouncedSearchValue}
                    data={data.pages.flat(1)}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    onEndReached={fetchNextPage}
                    isError={isError}
                    retry={_retry}
                    onScroll={_closeFilterBox}
                />

                <ScrollTop
                    flatListRef={flatListRef}
                    show={(data.pages[0].length > 0 && !isLoading && !isError)}
                    bottom={expanded ? 105 : 65}
                    right={3}
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

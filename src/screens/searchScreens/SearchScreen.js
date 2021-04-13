import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import {ScreenLayout} from '../../components/layouts';
import {SearchMovieList} from "../../components/organisms";
import {CustomSearchBar, FilterBox} from "../../components/molecules";
import {ScrollTop} from "../../components/atoms";
import {useInfiniteQuery, useQueryClient} from "react-query";
import {searchTitle} from "../../api";


const SearchScreen = () => {
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [filters, setFilters] = useState({
        types: ['movie', 'serial'],
        imdbScore: [0, 10],
        genres: null,
    });
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
        let result = await searchTitle(debouncedSearchValue, filters.types, 'low', pageParam);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isLoading, isFetching, isFetchingNextPage, isError} = useInfiniteQuery(
        [debouncedSearchValue, 'searchScreen', filters.types],
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
        await queryClient.removeQueries([debouncedSearchValue, 'searchScreen', filters.types]);
        setRefreshing(false);
    }

    const _retry = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries([debouncedSearchValue, 'searchScreen', filters.types]);
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

                <FilterBox
                    expanded={expanded}
                    setExpanded={setExpanded}
                    filters={filters}
                    setFilters={setFilters}
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
                    bottom={expanded ? 110 : 65}
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
        top: 80,
    }
});


export default SearchScreen;

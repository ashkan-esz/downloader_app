import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation, Keyboard, StatusBar} from 'react-native';
import {ScreenLayout} from '../../../../components/layouts';
import {CustomSearchBar} from "../../../../components/molecules";
import SearchMovieList from "./SearchMovieList";
import FilterType from "../FilterType";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import * as movieApis from "../../../../api/movieApis";
import {movieTypes} from "../../../../utils";


const SearchScreen = () => {
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(movieTypes.all);
    const [refreshing, setRefreshing] = useState(false);
    const searchBarRef = useRef();
    const flatListRef = useRef();
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);

    const containerStyle = useMemo(() => ({
        position: 'absolute',
        width: '100%',
        top: internet ? StatusBar.currentHeight + 75 : StatusBar.currentHeight + 25,
    }), [internet]);

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

    const getData = async (pageParam) => {
        if (!debouncedSearchValue) {
            return [];
        }
        let result = await movieApis.searchTitle(debouncedSearchValue, types, 'low', pageParam);
        if (result !== 'error') {
            return result;
        } else {
            //todo : handle error
            return [];
        }
    }

    const {data, fetchNextPage, isPending, isFetching, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['movie', debouncedSearchValue, 'searchScreen', types],
        queryFn: ({pageParam}) => getData(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length % 12 === 0 && lastPage.length !== 0) {
                return allPages.length + 1;
            }
            return null;
        },
        placeholderData: {pages: [[]]},
        gcTime: 3 * 60 * 1000,
        staleTime: 3 * 60 * 1000,
    });

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({
            queryKey: ['movie', debouncedSearchValue, 'searchScreen', types]
        });
        setRefreshing(false);
    }

    const _retry = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({
            queryKey: ['movie', debouncedSearchValue, 'searchScreen', types]
        });
        setRefreshing(false);
    }

    return (
        <ScreenLayout
            backgroundColor={'#000000'}
            paddingSides={10}>
            <View style={containerStyle}>

                <CustomSearchBar
                    onTextChange={setDebouncedSearchValue}
                    isLoading={isPending || isFetching}
                    inputRef={searchBarRef}
                    closeFilterBox={_closeFilterBox}
                />

                <FilterType
                    hidden={false}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <SearchMovieList
                    flatListRef={flatListRef}
                    showScrollTopIcon={(data.pages[0].length > 0)}
                    searchValue={debouncedSearchValue}
                    data={data.pages.flat(1)}
                    isLoading={isPending}
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

const style = StyleSheet.create({});


export default SearchScreen;

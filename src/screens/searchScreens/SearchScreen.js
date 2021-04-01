import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScreenLayout} from '../../components/layouts';
import {CustomSearchBar} from "../../components/molecules";
import {searchAll} from "../../api";
import {SearchMovieList} from "../../components/organisms";
import {useInfiniteQuery, useQueryClient} from "react-query";
import {ScrollTop} from "../../components/atoms";


const SearchScreen = () => {
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const searchBarRef = useRef();
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        searchBarRef.current.focus();
    }, []);

    const getData = async ({pageParam = 1}) => {
        if (!debouncedSearchValue) {
            return [];
        }
        let result = await searchAll(debouncedSearchValue, 'low', pageParam);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isLoading, isFetching, isFetchingNextPage, isError} = useInfiniteQuery(
        [debouncedSearchValue, 'searchScreen'],
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
        await queryClient.removeQueries([debouncedSearchValue, 'searchScreen']);
        setRefreshing(false);
    }

    const _retry = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries([debouncedSearchValue, 'searchScreen']);
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
                />

                <ScrollTop
                    flatListRef={flatListRef}
                    show={(data.pages[0].length > 0 && !isLoading && !isError)}
                    bottom={30}
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

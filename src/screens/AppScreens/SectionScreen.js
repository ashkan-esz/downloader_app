import React, {useEffect, useRef, useState} from 'react';
import {LayoutAnimation, Platform, StyleSheet, UIManager, View} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {SectionMovieList} from "../../components/organisms";
import {SectionNavBar, FilterType} from "../../components/molecules";
import {useRoute} from '@react-navigation/native';
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {getNews, getSortedMovies, getUpdates} from "../../api";


const SectionScreen = () => {
    const sections = ['inTheaters', 'comingSoon', 'recent', 'update'];
    const route = useRoute();
    const [tab, setTab] = useState(route.params.startTab);
    const [changedTab, setChangedTab] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(['movie', 'serial', 'anime_movie', 'anime_serial']);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        setTimeout(() => setChangedTab(route.params.startTab), 5)
    }, []);

    const _closeFilterBox = () => {
        if (expanded) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpanded(false);
        }
    }

    async function getData({pageParam = 1, TAB}) {
        const state = TAB || tab;
        let result;
        if (state === 'inTheaters') {
            result = await getSortedMovies('inTheaters', types, 'medium', pageParam);
        } else if (state === 'comingSoon') {
            result = await getSortedMovies('comingSoon', types, 'medium', pageParam);
        } else if (state === 'recent') {
            result = await getNews(types, 'medium', pageParam);
        } else if (state === 'update') {
            result = await getUpdates(types, 'medium', pageParam);
        }
        if (result && result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    //prefetch data
    useEffect(() => {
        async function prefetchData() {
            let promiseArray = [];
            for (let i = 0; i < sections.length; i++) {
                let query = queryClient.prefetchInfiniteQuery(
                    [sections[i], 'sectionScreen', types],
                    () => getData({TAB: sections[i]}));
                promiseArray.push(query);
            }
            await Promise.all(promiseArray);
        }

        prefetchData();
    }, []);

    const {data, fetchNextPage, isLoading, isFetching, isFetchingNextPage, isError} = useInfiniteQuery(
        [tab, 'sectionScreen', types],
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

    const _onTabChange = (value) => {
        if (tab === value && flatListRef && flatListRef.current) {
            flatListRef.current.scrollToOffset({animated: true, offset: 0});
        }
        setChangedTab(value);
        _closeFilterBox();
        setTimeout(() => setTab(value), 2);
    }

    const _onRefresh = async () => {
        setRefreshing(true);
        let promiseArray = [];
        for (let i = 0; i < sections.length; i++) {
            let query = queryClient.refetchQueries([sections[i], 'sectionScreen', types]);
            promiseArray.push(query);
        }
        await Promise.all(promiseArray);
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries([tab, 'sectionScreen', types]);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={style.container}>

                <SectionNavBar
                    extraStyle={style.navbar}
                    sections={sections}
                    tab={tab}
                    changedTab={changedTab}
                    onTabChange={_onTabChange}
                />

                <FilterType
                    expanded={expanded}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <SectionMovieList
                    flatListRef={flatListRef}
                    tab={tab}
                    changedTab={changedTab}
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
                    showScrollTopIcon={!expanded && (data.pages[0].length > 0 && tab === changedTab)}
                />
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        top: 75,
    }
});


export default SectionScreen;

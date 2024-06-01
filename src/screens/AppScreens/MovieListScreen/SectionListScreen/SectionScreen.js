import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {ScreenLayout} from "../../../../components/layouts";
import FilterType from "../FilterType";
import SectionMovieList from "./SectionMovieList";
import SectionNavBar from "./SectionNavBar";
import {useNavigation, useRoute} from '@react-navigation/native';
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import * as movieApis from "../../../../api/movieApis";
import {useSelector} from "react-redux";
import {moviesDataLevel, movieTypes} from "../../../../utils";

export const sectionTypes = Object.freeze({
    news: Object.freeze([
        {name: 'news', label: 'News'},
        {name: 'updates', label: 'Updates'},
        {name: 'inTheaters', label: 'InTheaters'},
        {name: 'comingSoon', label: 'Coming Soon'},
    ]),
    upcoming: Object.freeze([
        {name: 'comingSoon', label: 'Coming Soon'},
        {name: 'animeSeasonUpcoming', label: 'Anime Season'},
        {name: 'animeTopComingSoon', label: 'Anime Top Coming'},
    ]),
    rank: Object.freeze([
        {name: 'follow_month', label: 'Follow Month'},
        {name: 'like_month', label: 'Like Month'},
        {name: 'like', label: 'Like'},
        {name: 'view_month', label: 'View Month'},
    ]),
});

const SectionScreen = () => {
    const route = useRoute();
    const [showNothing, setShowNothing] = useState(true);
    const [tab, setTab] = useState(route.params.startTab);
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(movieTypes.all);
    const [showFilterTab, setShowFilterTab] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);
    const navigation = useNavigation();

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('transitionEnd', (e) => {
            setShowNothing(false);
        });
        return unsubscribe;
    }, [navigation]);

    const containerStyle = useMemo(() => ({
        position: 'absolute',
        width: '100%',
        top: internet ? StatusBar.currentHeight + 60 : StatusBar.currentHeight + 10,
    }), [internet]);

    const _onScroll = useCallback((event) => {
        setShowFilterTab(event.nativeEvent.contentOffset.y < 150);
    }, []);

    async function getData({pageParam = 1, TAB}) {
        const state = TAB || tab;
        let result;
        if (state === 'news') {
            result = await movieApis.getNews(types, moviesDataLevel.medium, pageParam);
        } else if (state === 'updates') {
            result = await movieApis.getUpdates(types, moviesDataLevel.medium, pageParam);
        } else {
            result = await movieApis.getSortedMovies(state, types, moviesDataLevel.medium, pageParam);
        }
        if (result && result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    // //prefetch data
    // useEffect(() => {
    //     async function prefetchData() {
    //         let promiseArray = [];
    //         for (let i = 0; i < route.params.tabs.length; i++) {
    //             let query = queryClient.prefetchInfiniteQuery({
    //                 queryKey: ['movie', route.params.tabs[i].name, 'sectionScreen', types],
    //                 queryFn: () => getData({TAB: route.params.tabs[i].name})
    //             });
    //             promiseArray.push(query);
    //         }
    //         await Promise.all(promiseArray);
    //     }
    //
    //     prefetchData();
    // }, []);

    const {data, fetchNextPage, isPending, isFetching, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['movie', tab, 'sectionScreen', types],
        queryFn: ({pageParam}) => getData({pageParam}),
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
        notifyOnChangeProps: "all",
    });

    const _onTabChange = (value) => {
        if (expanded) {
            setExpanded(false);
        }
        setTab(value);
        setShowNothing(true);
        setTimeout(() => setShowNothing(false), 100);
    }

    const _onRefresh = async () => {
        setRefreshing(true);
        let promiseArray = [];
        for (let i = 0; i < route.params.tabs.length; i++) {
            let query = queryClient.refetchQueries({
                queryKey: ['movie', route.params.tabs[i].name, 'sectionScreen', types]
            });
            promiseArray.push(query);
        }
        await Promise.all(promiseArray);
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries({
            queryKey: ['movie', tab, 'sectionScreen', types]
        });
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={containerStyle}>

                <SectionNavBar
                    sections={route.params.tabs}
                    tab={tab}
                    onTabChange={_onTabChange}
                />

                <FilterType
                    expanded={expanded}
                    hidden={!showFilterTab}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <SectionMovieList
                    flatListRef={flatListRef}
                    data={data?.pages.flat(1) || []}
                    isLoading={isPending}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    isError={isError}
                    retry={_retry}
                    onScroll={_onScroll}
                    showScrollTopIcon={!expanded && (data?.pages[0].length > 0)}
                    showNothing={showNothing}
                    extraHeightDiff={showFilterTab ? 45 : 0}
                />
            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({});


export default SectionScreen;

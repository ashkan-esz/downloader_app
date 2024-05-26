import React, {useEffect, useMemo, useRef, useState} from 'react';
import {LayoutAnimation, Platform, StatusBar, StyleSheet, UIManager, View} from 'react-native';
import {ScreenLayout} from "../../../../components/layouts";
import FilterType from "../FilterType";
import SectionMovieList from "./SectionMovieList";
import SectionNavBar from "./SectionNavBar";
import {useRoute} from '@react-navigation/native';
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import * as movieApis from "../../../../api/movieApis";
import {useSelector} from "react-redux";
import {moviesDataLevel} from "../../../../utils";

export const sectionTypes = Object.freeze({
    news: Object.freeze(['news', 'updates', 'inTheaters', 'comingSoon']),
    upcoming: Object.freeze(['comingSoon', "animeSeasonUpcoming", 'animeTopComingSoon']),
    upcoming_names: Object.freeze(['Coming Soon', "Anime Season", 'Anime Top Coming']),
    rank: Object.freeze(["follow_month", "like_month", "like", "view_month"]),
    rank_names: Object.freeze(["Follow Month", "Like Month", "Like", "View Month"]),
});

const SectionScreen = () => {
    const route = useRoute();
    const [tab, setTab] = useState(route.params.startTab);
    const [changedTab, setChangedTab] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(['movie', 'serial', 'anime_movie', 'anime_serial']);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);

    const containerStyle = useMemo(() => ({
        position: 'absolute',
        width: '100%',
        top: internet ? StatusBar.currentHeight + 60 : StatusBar.currentHeight + 10,
    }), [internet]);

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
            //todo : handle error
            return [];
        }
    }

    //prefetch data
    useEffect(() => {
        async function prefetchData() {
            let promiseArray = [];
            for (let i = 0; i < route.params.tabs.length; i++) {
                let query = queryClient.prefetchInfiniteQuery({
                    queryKey: ['movie', route.params.tabs[i], 'sectionScreen', types],
                    queryFn: () => getData({TAB: route.params.tabs[i]})
                });
                promiseArray.push(query);
            }
            await Promise.all(promiseArray);
        }

        prefetchData();
    }, []);

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

    // console.log('----- ', data);

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
        for (let i = 0; i < route.params.tabs.length; i++) {
            let query = queryClient.refetchQueries({
                queryKey: ['movie', route.params.tabs[i], 'sectionScreen', types]
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
                    extraStyle={style.navbar}
                    sections={route.params.tabs}
                    sectionNames={route.params.tabNames}
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
                    isLoading={isPending}
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

const style = StyleSheet.create({});


export default SectionScreen;

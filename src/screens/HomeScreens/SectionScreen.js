import React, {useEffect, useRef, useState} from 'react';
import {LayoutAnimation, StyleSheet, View} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {SectionMovieList} from "../../components/organisms";
import {SectionNavBar, FilterBox} from "../../components/molecules";
import {ScrollTop} from "../../components/atoms";
import {useRoute} from '@react-navigation/native';
import {useInfiniteQuery, useQueryClient} from "react-query";
import {getNews, getTimeLine_day, getTopLikes, getUpdates} from "../../api";


const SectionScreen = () => {
    const sections = ['recent', 'updates', 'populars', 'todaySeries'];
    const route = useRoute();
    const [tab, setTab] = useState(route.params.startTab);
    const [changedTab, setChangedTab] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [filters, setFilters] = useState({
        types: ['movie', 'serial'],
        imdbScore: [0, 10],
        genres: null,
    });
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        setTimeout(() => setChangedTab(route.params.startTab), 5)
    }, []);

    const _closeFilterBox = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(false);
    }

    async function getData({pageParam = 1, TAB}) {
        let result;
        if (TAB) {
            if (TAB === 'recent') {
                result = await getNews(filters.types, 'medium', 1);
            } else if (TAB === 'updates') {
                result = await getUpdates(filters.types, 'medium', 1);
            } else if (TAB === 'populars') {
                result = await getTopLikes(filters.types, 'medium', 1);
            } else if (TAB === 'todaySeries') {
                result = await getTimeLine_day(0, 1);
            }
        } else {
            if (tab === 'recent') {
                result = await getNews(filters.types, 'medium', pageParam);
            } else if (tab === 'updates') {
                result = await getUpdates(filters.types, 'medium', pageParam);
            } else if (tab === 'populars') {
                result = await getTopLikes(filters.types, 'medium', pageParam);
            } else if (tab === 'todaySeries') {
                result = await getTimeLine_day(0, pageParam);
            }
        }

        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    //prefetch data
    useEffect(() => {
        async function prefetchData() {
            let promiseArray = [];
            let promise1 = queryClient.prefetchInfiniteQuery(
                ['recent', 'sectionScreen', filters.types],
                () => getData({TAB: 'recent'}));
            promiseArray.push(promise1);
            let promise2 = queryClient.prefetchInfiniteQuery(
                ['updates', 'sectionScreen', filters.types],
                () => getData({TAB: 'updates'}));
            promiseArray.push(promise2);
            let promise3 = queryClient.prefetchInfiniteQuery(
                ['populars', 'sectionScreen', filters.types],
                () => getData({TAB: 'populars'}));
            promiseArray.push(promise3);
            let promise4 = queryClient.prefetchInfiniteQuery(
                ['todaySeries', 'sectionScreen', filters.types],
                () => getData({TAB: 'todaySeries'}));
            promiseArray.push(promise4);
            await Promise.all(promiseArray);
        }

        prefetchData();
    }, []);

    const {data, fetchNextPage, isLoading, isFetchingNextPage, isError} = useInfiniteQuery(
        [tab, 'sectionScreen', filters.types],
        getData,
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length % 12 === 0) {
                    return allPages.length + 1
                }
                return undefined;
            },
            placeholderData: {pages: [[]]},
            refetchInterval: 3 * 60 * 1000,
        });

    const _onTabChange = (value) => {
        if (tab === value && flatListRef && flatListRef.current) {
            flatListRef.current.scrollToOffset({animated: true, offset: 0});
        }
        setChangedTab(value);
        _closeFilterBox();
        setTimeout(() => setTab(value), 5);
    }

    const _onRefresh = async () => {
        setRefreshing(true);
        let promiseArray = [];
        for (let i = 0; i < sections.length; i++) {
            let query = queryClient.refetchQueries([sections[i], 'sectionScreen', filters.types]);
            promiseArray.push(query);
        }
        await Promise.all(promiseArray);
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries([tab, 'sectionScreen', filters.types]);
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

                {
                    changedTab !== 'todaySeries' && <FilterBox
                        expanded={expanded}
                        setExpanded={setExpanded}
                        filters={filters}
                        setFilters={setFilters}
                    />
                }

                <SectionMovieList
                    flatListRef={flatListRef}
                    tab={tab}
                    changedTab={changedTab}
                    data={data.pages.flat(1)}
                    isLoading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    isError={isError}
                    retry={_retry}
                    onScroll={_closeFilterBox}
                />

                <ScrollTop
                    flatListRef={flatListRef}
                    show={(data.pages[0].length > 0 && !isLoading && tab === changedTab && !isError)}
                    bottom={changedTab !== 'todaySeries' ? (expanded ? 115 : 70) : 25}
                    right={10}
                />

            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        top: 70,
    }
});


export default SectionScreen;

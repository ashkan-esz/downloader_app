import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScreenLayout} from "../../components/layouts";
import {useRoute} from '@react-navigation/native';
import {getNews_all, getTimeLine_today, getTops_byLike_all, getUpdates_all} from "../../api";
import {useInfiniteQuery, useQueryClient} from "react-query";
import {SectionNavBar} from "../../components/molecules";
import {SectionMovieList} from "../../components/organisms";
import {ScrollTop} from "../../components/atoms";

//todo : add type and imdb filter
//todo : fix flicring

const SectionScreen = () => {
    const sections = ['recent', 'updates', 'populars', 'todaySeries'];
    const route = useRoute();
    const [tab, setTab] = useState(route.params.startTab);
    const [changedTab, setChangedTab] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        setTimeout(() => setChangedTab(route.params.startTab), 5)
    }, []);

    async function getData({pageParam = 1, TAB}) {
        let result;
        if (TAB) {
            if (TAB === 'recent') {
                result = await getNews_all('medium', 1);
            } else if (TAB === 'updates') {
                result = await getUpdates_all('medium', 1);
            } else if (TAB === 'populars') {
                result = await getTops_byLike_all('medium', 1);
            } else if (TAB === 'todaySeries') {
                result = await getTimeLine_today(1);
            }
        } else {
            if (tab === 'recent') {
                result = await getNews_all('medium', pageParam);
            } else if (tab === 'updates') {
                result = await getUpdates_all('medium', pageParam);
            } else if (tab === 'populars') {
                result = await getTops_byLike_all('medium', pageParam);
            } else if (tab === 'todaySeries') {
                result = await getTimeLine_today(pageParam);
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
                ['recent', 'sectionScreen'],
                () => getData({TAB: 'recent'}));
            promiseArray.push(promise1);
            let promise2 = queryClient.prefetchInfiniteQuery(
                ['updates', 'sectionScreen'],
                () => getData({TAB: 'updates'}));
            promiseArray.push(promise2);
            let promise3 = queryClient.prefetchInfiniteQuery(
                ['populars', 'sectionScreen'],
                () => getData({TAB: 'populars'}));
            promiseArray.push(promise3);
            let promise4 = queryClient.prefetchInfiniteQuery(
                ['todaySeries', 'sectionScreen'],
                () => getData({TAB: 'todaySeries'}));
            promiseArray.push(promise4);
            await Promise.all(promiseArray);
        }

        prefetchData();
    }, []);

    const {data, fetchNextPage, isLoading, isFetchingNextPage, isError} = useInfiniteQuery(
        [tab, 'sectionScreen'],
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
        setTimeout(() => setTab(value), 5);
    }

    const _onRefresh = async () => {
        setRefreshing(true);
        let promiseArray = [];
        for (let i = 0; i < sections.length; i++) {
            let query = queryClient.refetchQueries([sections[i], 'sectionScreen']);
            promiseArray.push(query);
        }
        await Promise.all(promiseArray);
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries([tab, 'sectionScreen']);
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
                />

                <ScrollTop
                    flatListRef={flatListRef}
                    show={(data.pages[0].length > 0 && !isLoading && tab === changedTab && !isError)}
                    bottom={25}
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

SectionScreen.propTypes = {};


export default SectionScreen;

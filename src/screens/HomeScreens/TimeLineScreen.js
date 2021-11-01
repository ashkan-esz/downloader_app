import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ScrollTop, TimeLinePaging} from "../../components/atoms";
import {TimeLineMovieList} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useInfiniteQuery, useQueryClient} from "react-query";
import {useRoute} from "@react-navigation/native";
import {getSeriesOfDay} from "../../api";


const TimeLineScreen = () => {
    const route = useRoute();
    const [spacing, setSpacing] = useState(route.params.startSpacing);
    const [changedSpacing, setChangedSpacing] = useState(-10);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        setTimeout(() => setChangedSpacing(route.params.startSpacing), 5)
    }, []);

    async function getData({pageParam = 1, SPACING = null}) {
        let result = (SPACING !== null)
            ? await getSeriesOfDay(SPACING, pageParam, ['movie', 'serial', 'anime_movie', 'anime_serial'])
            : await getSeriesOfDay(spacing, pageParam, ['movie', 'serial', 'anime_movie', 'anime_serial']);
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
            let promise1 = queryClient.prefetchInfiniteQuery(['timeLineScreen', -1],
                () => getData({SPACING: -1}));
            promiseArray.push(promise1);
            let promise2 = queryClient.prefetchInfiniteQuery(['timeLineScreen', 0],
                () => getData({SPACING: 0}));
            promiseArray.push(promise2);
            let promise3 = queryClient.prefetchInfiniteQuery(['timeLineScreen', 1],
                () => getData({SPACING: 1}));
            promiseArray.push(promise3);
            await Promise.all(promiseArray);
        }

        prefetchData();
    }, []);

    const {data, fetchNextPage, isLoading, isFetchingNextPage, isError} = useInfiniteQuery(
        ['timeLineScreen', spacing],
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
            // refetchIntervalInBackground: true,
        });

    const _onSpacingChange = (value) => {
        if (spacing === value && flatListRef && flatListRef.current) {
            flatListRef.current.scrollToOffset({animated: true, offset: 0});
        }
        setChangedSpacing(value);
        setTimeout(() => setSpacing(value), 5);
    }

    const _onRefresh = async () => {
        setRefreshing(true);
        let promiseArray = [];
        let query = queryClient.refetchQueries(['timeLineScreen', spacing]);
        promiseArray.push(query);
        let dayCounter = spacing - 1;
        while (dayCounter <= spacing + 1) {
            let query = queryClient.refetchQueries(['timeLineScreen', dayCounter]);
            promiseArray.push(query);
            dayCounter++;
        }
        await Promise.all(promiseArray);
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries(['timeLineScreen', spacing]);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={style.container}>

                <TimeLinePaging
                    extraStyle={style.topPaging}
                    spacing={changedSpacing || spacing}
                    setSpacing={_onSpacingChange}
                />

                <TimeLineMovieList
                    flatListRef={flatListRef}
                    spacing={spacing}
                    changedSpacing={changedSpacing}
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
                    show={(data.pages[0].length > 0 && !isLoading && spacing === changedSpacing && !isError)}
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
        top: 80,
    },
    topPaging: {
        marginTop: 5,
        paddingBottom: 15,
    }
});


export default TimeLineScreen;

import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TimeLinePaging} from "../../components/atoms";
import {TimeLineMovieList} from "../../components/organisms";
import {ScreenLayout} from "../../components/layouts";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {getSeriesOfDay} from "../../api";


const TimeLineScreen = () => {
    const [spacing, setSpacing] = useState(-1);
    const [changedSpacing, setChangedSpacing] = useState(-10);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();

    useEffect(() => {
        const todayNumber = new Date().getDay();
        setSpacing(todayNumber);
        setChangedSpacing(todayNumber);
    }, []);

    async function getData({pageParam = 1, SPACING = null}) {
        if (!SPACING && spacing === -1) {
            return [];
        }
        let result = await getSeriesOfDay(SPACING || spacing, pageParam, ['movie', 'serial', 'anime_movie', 'anime_serial']);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    //prefetch data
    useEffect(() => {
        async function prefetchData() {
            const todayNumber = new Date().getDay();
            let promiseArray = [];
            let next = (todayNumber + 1) % 7;
            let promise1 = queryClient.prefetchInfiniteQuery(['timeLineScreen', next],
                () => getData({SPACING: next}));
            promiseArray.push(promise1);
            let prev = (todayNumber + 6) % 7;
            let promise2 = queryClient.prefetchInfiniteQuery(['timeLineScreen', prev],
                () => getData({SPACING: prev}));
            promiseArray.push(promise2);
            await Promise.all(promiseArray);
        }

        prefetchData();
    }, []);

    const {data, fetchNextPage, isLoading, isFetching, isFetchingNextPage, isError} = useInfiniteQuery(
        ['timeLineScreen', spacing],
        getData,
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.length % 12 === 0 && lastPage.length !== 0) {
                    return allPages.length + 1;
                }
                return undefined;
            },
            placeholderData: {pages: [[]]},
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
        await queryClient.refetchQueries(['timeLineScreen']);
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
                    showScrollTopIcon={(data.pages[0].length > 0 && spacing === changedSpacing)}
                    spacing={spacing}
                    changedSpacing={changedSpacing}
                    data={data.pages.flat(1)}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    isError={isError}
                    retry={_retry}
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

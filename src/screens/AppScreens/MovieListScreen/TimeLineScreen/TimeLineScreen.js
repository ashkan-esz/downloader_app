import React, {useMemo, useRef, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {useSelector} from "react-redux";
import {ScreenLayout} from "../../../../components/layouts";
import TimeLinePaging from "./TimeLinePaging";
import TimeLineMovieList from "./TimeLineMovieList";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import * as movieApis from "../../../../api/movieApis";
import {movieTypes} from "../../../../utils";
import {useNavigation} from "@react-navigation/native";
import {useFrameCallback} from "react-native-reanimated";


const TimeLineScreen = () => {
    const [spacing, setSpacing] = useState(new Date().getDay());
    const [showNothing, setShowNothing] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef();
    const queryClient = useQueryClient();
    const internet = useSelector(state => state.user.internet);
    const navigation = useNavigation();

    useFrameCallback(() => {
        // This is an optimization which prevents stutter on slow momentum scrolling
    });

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

    async function getData({pageParam = 1, SPACING = null}) {
        if (!SPACING && spacing === -1) {
            return [];
        }
        let result = await movieApis.getSeriesOfDay(SPACING || spacing, pageParam, movieTypes.all);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    //prefetch data
    // useEffect(() => {
    //     async function prefetchData() {
    //         const todayNumber = new Date().getDay();
    //         let promiseArray = [];
    //         let next = (todayNumber + 1) % 7;
    //         let promise1 = queryClient.prefetchInfiniteQuery({
    //             queryKey: ['movie', 'timeLineScreen', next],
    //             queryFn: () => getData({SPACING: next})
    //         });
    //         promiseArray.push(promise1);
    //         let prev = (todayNumber + 6) % 7;
    //         let promise2 = queryClient.prefetchInfiniteQuery({
    //             queryKey: ['movie', 'timeLineScreen', prev],
    //             queryFn: () => getData({SPACING: prev})
    //         });
    //         promiseArray.push(promise2);
    //         await Promise.all(promiseArray);
    //     }
    //
    //     prefetchData();
    // }, []);

    const {data, fetchNextPage, isPending, isFetching, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['movie', 'timeLineScreen', spacing],
        queryFn: ({pageParam}) => getData({pageParam}),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length % 12 === 0 && lastPage.length !== 0) {
                return allPages.length + 1;
            }
            return null;
        },
        placeholderData: {pages: [[]]},
        notifyOnChangeProps: "all",
    });

    const _onSpacingChange = (value) => {
        setSpacing(value);
        setShowNothing(true);
        setTimeout(() => setShowNothing(false), 100);
    }

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({queryKey: ['movie', 'timeLineScreen']});
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries({
            queryKey: ['movie', 'timeLineScreen', spacing]
        });
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={containerStyle}>

                <TimeLinePaging
                    extraStyle={style.topPaging}
                    spacing={spacing}
                    setSpacing={_onSpacingChange}
                />

                <TimeLineMovieList
                    flatListRef={flatListRef}
                    showScrollTopIcon={(data?.pages[0].length > 0)}
                    data={data?.pages.flat(1) || []}
                    isLoading={isPending}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    isError={isError}
                    retry={_retry}
                    showNothing={showNothing}
                />

            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({
    topPaging: {
        paddingBottom: 50,
    }
});


export default TimeLineScreen;

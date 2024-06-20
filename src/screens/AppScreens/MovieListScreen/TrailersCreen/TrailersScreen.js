import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {ScreenLayout} from "../../../../components/layouts";
import TrailersMovieList from "./TrailersMovieList";
import FilterType from "../FilterType";
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import * as movieApis from "../../../../api/movieApis";
import {movieTypes} from "../../../../utils";
import {useNavigation} from "@react-navigation/native";
import {useFrameCallback} from "react-native-reanimated";


const TrailersScreen = () => {
    const [showNothing, setShowNothing] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(movieTypes.all);
    const [showFilterTab, setShowFilterTab] = useState(true);
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

    const _onScroll = useCallback((event) => {
        setShowFilterTab(event.nativeEvent.contentOffset.y < 150);
    }, []);

    async function getData(pageParam) {
        let result = await movieApis.getTrailers(types, 'medium', pageParam);
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isPending, isFetching, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['movie', 'trailers', 'trailersScreen', types],
        queryFn: ({pageParam}) => getData(pageParam),
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

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({
            queryKey: ['movie', 'trailers', 'trailersScreen', types]
        });
        setRefreshing(false);
    };

    return (
        <ScreenLayout paddingSides={10}>
            <View style={containerStyle}>

                <FilterType
                    expanded={expanded}
                    hidden={!showFilterTab}
                    setExpanded={setExpanded}
                    types={types}
                    setTypes={setTypes}
                />

                <TrailersMovieList
                    flatListRef={flatListRef}
                    showScrollTopIcon={data?.pages[0].length > 0}
                    data={data?.pages.flat(1) || []}
                    isLoading={isPending}
                    isFetching={isFetching}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                    isError={isError}
                    retry={_onRefresh}
                    onScroll={_onScroll}
                    showNothing={showNothing}
                    extraHeightDiff={showFilterTab ? 0 : -45}
                />

            </View>
        </ScreenLayout>
    );
};

const style = StyleSheet.create({});


export default TrailersScreen;

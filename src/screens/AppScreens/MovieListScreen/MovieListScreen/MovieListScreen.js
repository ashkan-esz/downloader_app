import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StatusBar} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {ScreenLayout} from "../../../../components/layouts";
import MovieList from "./MovieList";
import FilterType from "../FilterType";
import {useSelector} from "react-redux";
import * as movieApis from "../../../../api/movieApis";
import {movieTypes} from "../../../../utils";
import {useFrameCallback} from "react-native-reanimated";

const MovieListScreen = () => {
    const route = useRoute();
    const [showNothing, setShowNothing] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [types, setTypes] = useState(movieTypes.all);
    const [showFilterTab, setShowFilterTab] = useState(true);
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

    const _onScroll = useCallback((event) => {
        setShowFilterTab(event.nativeEvent.contentOffset.y < 150);
    }, []);

    async function getData(pageParam) {
        let result = await movieApis.getSortedMovies(route.params.pageType, types, 'medium', pageParam);
        if (result && result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, fetchNextPage, isPending, isFetching, isFetchingNextPage, isError} = useInfiniteQuery({
        queryKey: ['movie', route.params.pageType, 'movieListScreen', types],
        queryFn: ({pageParam}) => getData(pageParam),
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

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({
            queryKey: ['movie', route.params.pageType, 'movieListScreen', types]
        });
        setRefreshing(false);
    };

    const _retry = async () => {
        await queryClient.refetchQueries({
            queryKey: ['movie', route.params.pageType, 'movieListScreen', types]
        });
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

                <MovieList
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
                    extraHeightDiff={showFilterTab ? -5 : -50}
                />
            </View>
        </ScreenLayout>
    );
};

export default MovieListScreen;
